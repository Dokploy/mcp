import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Config } from "./utils/clientConfig.js";
import { DEFAULT_REDACTED_FIELDS } from "./utils/redactSensitive.js";
import { DEFAULT_SECRET_PATH_PATTERNS } from "./utils/secretPaths.js";

const mocks = vi.hoisted(() => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  config: {} as Config,
}));

vi.mock("./utils/apiClient.js", () => ({
  default: { get: mocks.apiGet, post: mocks.apiPost },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

vi.mock("./utils/clientConfig.js", () => ({
  getClientConfig: () => mocks.config,
}));

const { createHandler } = await import("./handler.js");

const readFileTool = {
  name: "docker-readContainerFile",
  description: "Read a file from a container",
  tag: "docker",
  method: "GET",
  path: "/docker.readContainerFile",
} as Parameters<typeof createHandler>[0];

const listProjectsTool = {
  name: "project-all",
  description: "List projects",
  tag: "project",
  method: "GET",
  path: "/project.all",
} as Parameters<typeof createHandler>[0];

const readLogsTool = {
  name: "deployment-readLogs",
  description: "Read deployment logs",
  tag: "deployment",
  method: "GET",
  path: "/deployment.readLogs",
} as Parameters<typeof createHandler>[0];

/** Unwraps the JSON payload that ResponseFormatter packs into a text block. */
function payloadOf(response: { content: { text: string }[] }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? "{}");
}

beforeEach(() => {
  mocks.apiGet.mockReset();
  mocks.apiPost.mockReset();
  mocks.config = {
    dokployUrl: "https://example.com",
    authToken: "test-key",
    customHeaders: {},
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    redactEnv: true,
    redactFields: DEFAULT_REDACTED_FIELDS,
    blockSecretPaths: true,
    secretPathPatterns: DEFAULT_SECRET_PATH_PATTERNS,
  };
});

describe("createHandler — secret path guard", () => {
  it("refuses a dotenv read without contacting the API", async () => {
    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/.env",
    });

    expect(response.isError).toBe(true);
    expect(mocks.apiGet).not.toHaveBeenCalled();
  });

  it("refuses a traversal that resolves onto a secret", async () => {
    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/logs/../.env",
    });

    expect(response.isError).toBe(true);
    expect(mocks.apiGet).not.toHaveBeenCalled();
  });

  it("still allows ordinary files", async () => {
    mocks.apiGet.mockResolvedValue({ data: { content: "starting up" } });

    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/logs/error.log",
    });

    expect(response.isError).toBeUndefined();
    expect(mocks.apiGet).toHaveBeenCalledOnce();
  });

  it("can be switched off entirely", async () => {
    mocks.config.blockSecretPaths = false;
    mocks.apiGet.mockResolvedValue({ data: { content: "PORT=3000" } });

    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/.env",
    });

    expect(response.isError).toBeUndefined();
    expect(mocks.apiGet).toHaveBeenCalledOnce();
  });

  it("leaves tools without a path argument alone", async () => {
    mocks.apiGet.mockResolvedValue({ data: [{ name: "web" }] });

    const response = await createHandler(listProjectsTool)({});

    expect(response.isError).toBeUndefined();
    expect(mocks.apiGet).toHaveBeenCalledOnce();
  });
});

describe("createHandler — secrets inside returned file contents", () => {
  it("masks secret assignments the field name cannot reveal", async () => {
    mocks.apiGet.mockResolvedValue({
      data: { content: "PORT=3000\nDB_PASSWORD=hunter2" },
    });

    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/config/local.conf",
    });

    const data = payloadOf(response).data as { content: string };
    expect(data.content).toBe("PORT=3000\nDB_PASSWORD=[REDACTED]");
  });

  it("does not scan responses of tools that take no path", async () => {
    mocks.apiGet.mockResolvedValue({ data: { note: "DB_PASSWORD=hunter2" } });

    const response = await createHandler(listProjectsTool)({});

    const data = payloadOf(response).data as { note: string };
    expect(data.note).toBe("DB_PASSWORD=hunter2");
  });

  it("follows DOKPLOY_REDACT_ENV=false", async () => {
    mocks.config.redactEnv = false;
    mocks.apiGet.mockResolvedValue({ data: { content: "DB_PASSWORD=hunter2" } });

    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/config/local.conf",
    });

    const data = payloadOf(response).data as { content: string };
    expect(data.content).toBe("DB_PASSWORD=hunter2");
  });

  it("masks secret shapes in log output, which has no field name to key off", async () => {
    mocks.apiGet.mockResolvedValue({
      data: {
        logs: [
          "INFO  connecting to postgres://payroll:hunter2@db.internal:5432/app",
          `INFO  pushing with token ghp_${"a".repeat(36)}`,
          "INFO  migration complete",
        ].join("\n"),
      },
    });

    const response = await createHandler(readLogsTool)({ deploymentId: "abc" });
    const data = payloadOf(response).data as { logs: string };

    expect(data.logs).toBe(
      [
        "INFO  connecting to postgres://payroll:[REDACTED]@db.internal:5432/app",
        "INFO  pushing with token [REDACTED]",
        "INFO  migration complete",
      ].join("\n"),
    );
  });

  it("does not disturb log lines that hold no secret", async () => {
    const logs = "INFO  server listening on port 3000\nWARN  slow query took 1200ms";
    mocks.apiGet.mockResolvedValue({ data: { logs } });

    const response = await createHandler(readLogsTool)({ deploymentId: "abc" });

    expect((payloadOf(response).data as { logs: string }).logs).toBe(logs);
  });

  it("follows DOKPLOY_REDACT_ENV=false for shape redaction too", async () => {
    mocks.config.redactEnv = false;
    const logs = "db=postgres://payroll:hunter2@db.internal/app";
    mocks.apiGet.mockResolvedValue({ data: { logs } });

    const response = await createHandler(readLogsTool)({ deploymentId: "abc" });

    expect((payloadOf(response).data as { logs: string }).logs).toBe(logs);
  });

  it("masks secrets in file contents that arrive base64-encoded", async () => {
    // What the container file API actually returns. Before the decode step the
    // assignment pass saw a base64 blob, found no KEY=value line, and passed
    // the secret through untouched — encoded, which stops nobody.
    const file = "PORT=3000\nDB_PASSWORD=hunter2\n";
    mocks.apiGet.mockResolvedValue({
      data: { content: Buffer.from(file, "utf8").toString("base64"), truncated: false },
    });

    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/config/local.conf",
    });

    const data = payloadOf(response).data as { content: string };
    expect(Buffer.from(data.content, "base64").toString("utf8")).toBe(
      "PORT=3000\nDB_PASSWORD=[REDACTED]\n",
    );
  });

  it("masks a secret shape inside a base64 payload", async () => {
    const file = "database_url: postgres://app:hunter2@db:5432/x\n";
    mocks.apiGet.mockResolvedValue({
      data: { content: Buffer.from(file, "utf8").toString("base64") },
    });

    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/config/app.yaml",
    });

    const data = payloadOf(response).data as { content: string };
    expect(Buffer.from(data.content, "base64").toString("utf8")).toBe(
      "database_url: postgres://app:[REDACTED]@db:5432/x\n",
    );
  });

  it("leaves a base64 payload byte-identical when it holds no secret", async () => {
    const encoded = Buffer.from("PORT=3000\nLOG_LEVEL=debug\n", "utf8").toString("base64");
    mocks.apiGet.mockResolvedValue({ data: { content: encoded } });

    const response = await createHandler(readFileTool)({
      containerId: "abc",
      path: "/app/config/local.conf",
    });

    expect((payloadOf(response).data as { content: string }).content).toBe(encoded);
  });

  it("keeps redacting by field name as before", async () => {
    mocks.apiGet.mockResolvedValue({ data: { appName: "web", env: "DB_PASSWORD=hunter2" } });

    const response = await createHandler(listProjectsTool)({});

    expect(payloadOf(response).data).toEqual({ appName: "web", env: "[REDACTED]" });
  });
});
