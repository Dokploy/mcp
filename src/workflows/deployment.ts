import { z } from "zod";
import type { WorkflowApi, WorkflowResult, WorkflowToolDefinition } from "./types.js";

const DEFAULT_WAIT_SECONDS = 120;
const MAX_WAIT_SECONDS = 900;
const DEFAULT_POLL_SECONDS = 3;
const DEFAULT_LOG_TAIL = 50;

interface Deployment {
  deploymentId: string;
  status?: string | null;
  title?: string | null;
  createdAt?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  errorMessage?: string | null;
}

interface ServiceTarget {
  kind: "application" | "compose";
  idField: "applicationId" | "composeId";
  id: string;
  listPath: string;
}

export interface WorkflowClock {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
}

const systemClock: WorkflowClock = {
  now: () => Date.now(),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

function resolveTarget(input: Record<string, unknown>): ServiceTarget {
  const applicationId = typeof input.applicationId === "string" ? input.applicationId : undefined;
  const composeId = typeof input.composeId === "string" ? input.composeId : undefined;

  if ((applicationId && composeId) || (!applicationId && !composeId)) {
    throw new Error("Provide exactly one of applicationId or composeId");
  }

  if (applicationId) {
    return {
      kind: "application",
      idField: "applicationId",
      id: applicationId,
      listPath: "/deployment.all",
    };
  }

  return {
    kind: "compose",
    idField: "composeId",
    id: composeId as string,
    listPath: "/deployment.allByCompose",
  };
}

// Dokploy returns deployments newest first.
async function listDeployments(api: WorkflowApi, target: ServiceTarget): Promise<Deployment[]> {
  const response = await api.get(target.listPath, { params: { [target.idField]: target.id } });
  return Array.isArray(response.data) ? (response.data as Deployment[]) : [];
}

async function readLogs(
  api: WorkflowApi,
  deploymentId: string,
  tail: number,
): Promise<string | undefined> {
  try {
    const response = await api.get("/deployment.readLogs", { params: { deploymentId, tail } });
    return typeof response.data === "string" ? response.data : undefined;
  } catch {
    // The deployment result is still worth returning without its logs.
    return undefined;
  }
}

function summarize(deployment: Deployment) {
  return {
    deploymentId: deployment.deploymentId,
    status: deployment.status ?? "unknown",
    title: deployment.title ?? null,
    createdAt: deployment.createdAt ?? null,
    startedAt: deployment.startedAt ?? null,
    finishedAt: deployment.finishedAt ?? null,
    errorMessage: deployment.errorMessage ?? null,
  };
}

export async function deployAndWait(
  input: Record<string, unknown>,
  api: WorkflowApi,
  clock: WorkflowClock = systemClock,
): Promise<WorkflowResult> {
  const target = resolveTarget(input);
  const waitSeconds =
    typeof input.waitSeconds === "number" ? input.waitSeconds : DEFAULT_WAIT_SECONDS;
  const pollSeconds =
    typeof input.pollSeconds === "number" ? input.pollSeconds : DEFAULT_POLL_SECONDS;
  const logTail = typeof input.logTail === "number" ? input.logTail : DEFAULT_LOG_TAIL;
  const action = input.redeploy === true ? "redeploy" : "deploy";

  // Deployments that exist before the trigger, so the new one can be told apart.
  const known = new Set((await listDeployments(api, target)).map((d) => d.deploymentId));

  await api.post(`/${target.kind}.${action}`, {
    [target.idField]: target.id,
    ...(typeof input.title === "string" ? { title: input.title } : {}),
    ...(typeof input.description === "string" ? { description: input.description } : {}),
  });

  const startedAt = clock.now();
  const deadline = startedAt + waitSeconds * 1000;
  let current: Deployment | undefined;

  while (true) {
    current = (await listDeployments(api, target)).find((d) => !known.has(d.deploymentId));
    if (current && current.status !== "running") break;
    if (clock.now() >= deadline) break;
    await clock.sleep(pollSeconds * 1000);
  }

  const waitedSeconds = Math.round((clock.now() - startedAt) / 1000);

  if (!current) {
    return {
      message: `The ${action} was requested but no deployment appeared within ${waitSeconds}s; it may still be queued`,
      data: {
        [target.idField]: target.id,
        status: "queued",
        finished: false,
        waitedSeconds,
        next: "Call deployment-latest with the same id to check again",
      },
    };
  }

  const logs = await readLogs(api, current.deploymentId, logTail);
  const finished = current.status !== "running";

  return {
    message: finished
      ? `Deployment finished with status: ${current.status ?? "unknown"}`
      : `Deployment is still running after ${waitSeconds}s`,
    data: {
      [target.idField]: target.id,
      status: current.status ?? "unknown",
      finished,
      waitedSeconds,
      deployment: summarize(current),
      ...(logs !== undefined ? { logs } : {}),
      ...(finished ? {} : { next: "Call deployment-latest with the same id to check again" }),
    },
  };
}

export async function latestDeployment(
  input: Record<string, unknown>,
  api: WorkflowApi,
): Promise<WorkflowResult> {
  const target = resolveTarget(input);
  const logTail = typeof input.logTail === "number" ? input.logTail : DEFAULT_LOG_TAIL;

  const [latest] = await listDeployments(api, target);
  if (!latest) {
    return {
      message: `No deployments found for this ${target.kind}`,
      data: { [target.idField]: target.id, status: "none", finished: true },
    };
  }

  const logs = await readLogs(api, latest.deploymentId, logTail);

  return {
    message: `Latest deployment status: ${latest.status ?? "unknown"}`,
    data: {
      [target.idField]: target.id,
      status: latest.status ?? "unknown",
      finished: latest.status !== "running",
      deployment: summarize(latest),
      ...(logs !== undefined ? { logs } : {}),
    },
  };
}

const targetShape = {
  applicationId: z
    .string()
    .min(1)
    .optional()
    .describe("ID of the application. Provide this or composeId, not both."),
  composeId: z
    .string()
    .min(1)
    .optional()
    .describe("ID of the Docker Compose service. Provide this or applicationId, not both."),
};

const logTailSchema = z
  .number()
  .int()
  .min(1)
  .max(10000)
  .default(DEFAULT_LOG_TAIL)
  .describe("Number of build log lines to return from the end of the log.");

export const deploymentWorkflowTools: WorkflowToolDefinition[] = [
  {
    name: "deployment-deployAndWait",
    description:
      "Deploy an application or Docker Compose service and wait for the result. Triggers the deployment, polls until it finishes or waitSeconds elapses, and returns the final status (done, error, cancelled) with the end of the build log. If it is still running at the timeout, returns status 'running' so you can follow up with deployment-latest.",
    tag: "deployment",
    schema: z.object({
      ...targetShape,
      redeploy: z.boolean().default(false).describe("Use the redeploy endpoint instead of deploy."),
      title: z.string().optional().describe("Title recorded on the deployment."),
      description: z.string().optional().describe("Description recorded on the deployment."),
      waitSeconds: z
        .number()
        .int()
        .min(1)
        .max(MAX_WAIT_SECONDS)
        .default(DEFAULT_WAIT_SECONDS)
        .describe(
          "How long to wait for the deployment to finish. Keep it below your MCP client's tool timeout.",
        ),
      pollSeconds: z
        .number()
        .int()
        .min(1)
        .max(30)
        .default(DEFAULT_POLL_SECONDS)
        .describe("Seconds between status checks."),
      logTail: logTailSchema,
    }),
    annotations: {
      title: "Deployment Deploy And Wait",
      openWorldHint: true,
    },
    run: (input, api) => deployAndWait(input, api),
  },
  {
    name: "deployment-latest",
    description:
      "Get the most recent deployment of an application or Docker Compose service: its status (running, done, error, cancelled), timestamps, error message, and the end of its build log. Use it to find out why the last deploy failed.",
    tag: "deployment",
    schema: z.object({
      ...targetShape,
      logTail: logTailSchema,
    }),
    annotations: {
      title: "Deployment Latest",
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    run: (input, api) => latestDeployment(input, api),
  },
];
