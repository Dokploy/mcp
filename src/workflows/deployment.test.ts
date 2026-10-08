import { describe, expect, it, vi } from "vitest";
import { deployAndWait, latestDeployment, type WorkflowClock } from "./deployment.js";
import type { WorkflowApi } from "./types.js";

// A clock that jumps forward on every sleep, so polling tests run instantly.
function fakeClock(): WorkflowClock & { sleeps: number[] } {
  let time = 0;
  const sleeps: number[] = [];
  return {
    sleeps,
    now: () => time,
    sleep: async (ms) => {
      sleeps.push(ms);
      time += ms;
    },
  };
}

// Serves one deployment list per call; the last list repeats once exhausted.
function fakeApi(lists: unknown[][], logs: string | Error = "build log") {
  let listCalls = 0;
  const get = vi.fn(async (path: string, _config?: { params?: Record<string, unknown> }) => {
    if (path === "/deployment.readLogs") {
      if (logs instanceof Error) throw logs;
      return { data: logs };
    }
    const data = lists[Math.min(listCalls, lists.length - 1)];
    listCalls++;
    return { data };
  });
  const post = vi.fn(async (_path: string, _body?: Record<string, unknown>) => ({ data: true }));
  return { get, post } satisfies WorkflowApi;
}

const old = { deploymentId: "old", status: "done" };

describe("deployAndWait", () => {
  it("triggers a deploy and returns once the new deployment is done", async () => {
    const api = fakeApi([
      [old],
      [old],
      [{ deploymentId: "new", status: "running" }, old],
      [{ deploymentId: "new", status: "done", finishedAt: "2026-01-01T00:00:10Z" }, old],
    ]);
    const clock = fakeClock();

    const result = await deployAndWait({ applicationId: "app-1" }, api, clock);

    expect(api.post).toHaveBeenCalledWith("/application.deploy", { applicationId: "app-1" });
    expect(api.get).toHaveBeenCalledWith("/deployment.all", { params: { applicationId: "app-1" } });
    expect(result.message).toBe("Deployment finished with status: done");
    expect(result.data).toMatchObject({
      applicationId: "app-1",
      status: "done",
      finished: true,
      deployment: { deploymentId: "new", finishedAt: "2026-01-01T00:00:10Z" },
      logs: "build log",
    });
    expect(clock.sleeps).toEqual([3000, 3000]);
  });

  it("ignores deployments that existed before the trigger", async () => {
    const api = fakeApi([
      [old],
      [{ deploymentId: "new", status: "error", errorMessage: "boom" }, old],
    ]);

    const result = await deployAndWait({ applicationId: "app-1" }, api, fakeClock());

    expect(result.message).toBe("Deployment finished with status: error");
    expect(result.data).toMatchObject({
      status: "error",
      deployment: { deploymentId: "new", errorMessage: "boom" },
    });
  });

  it("uses the compose endpoints and redeploy when asked", async () => {
    const api = fakeApi([[], [{ deploymentId: "new", status: "done" }]]);

    await deployAndWait(
      { composeId: "cmp-1", redeploy: true, title: "Release 2" },
      api,
      fakeClock(),
    );

    expect(api.post).toHaveBeenCalledWith("/compose.redeploy", {
      composeId: "cmp-1",
      title: "Release 2",
    });
    expect(api.get).toHaveBeenCalledWith("/deployment.allByCompose", {
      params: { composeId: "cmp-1" },
    });
  });

  it("returns status running when the deployment outlasts waitSeconds", async () => {
    const api = fakeApi([[old], [{ deploymentId: "new", status: "running" }, old]]);

    const result = await deployAndWait(
      { applicationId: "app-1", waitSeconds: 10, pollSeconds: 5 },
      api,
      fakeClock(),
    );

    expect(result.message).toBe("Deployment is still running after 10s");
    expect(result.data).toMatchObject({ status: "running", finished: false, waitedSeconds: 10 });
    expect(result.data).toHaveProperty("next");
  });

  it("reports queued when no new deployment appears in time", async () => {
    const api = fakeApi([[old]]);

    const result = await deployAndWait(
      { applicationId: "app-1", waitSeconds: 6, pollSeconds: 3 },
      api,
      fakeClock(),
    );

    expect(result.data).toMatchObject({ status: "queued", finished: false });
    expect(api.get).not.toHaveBeenCalledWith("/deployment.readLogs", expect.anything());
  });

  it("still returns the result when the logs cannot be read", async () => {
    const api = fakeApi([[], [{ deploymentId: "new", status: "done" }]], new Error("no logs"));

    const result = await deployAndWait({ applicationId: "app-1" }, api, fakeClock());

    expect(result.data).toMatchObject({ status: "done", finished: true });
    expect(result.data).not.toHaveProperty("logs");
  });

  it.each([
    [{}],
    [{ applicationId: "app-1", composeId: "cmp-1" }],
  ])("rejects %j before calling the API", async (input) => {
    const api = fakeApi([[]]);

    await expect(deployAndWait(input, api, fakeClock())).rejects.toThrow(
      "Provide exactly one of applicationId or composeId",
    );
    expect(api.post).not.toHaveBeenCalled();
  });
});

describe("latestDeployment", () => {
  it("returns the newest deployment with its logs", async () => {
    const api = fakeApi(
      [[{ deploymentId: "new", status: "error", errorMessage: "boom" }, old]],
      "tail",
    );

    const result = await latestDeployment({ applicationId: "app-1", logTail: 20 }, api);

    expect(api.get).toHaveBeenCalledWith("/deployment.readLogs", {
      params: { deploymentId: "new", tail: 20 },
    });
    expect(result.data).toMatchObject({
      status: "error",
      finished: true,
      deployment: { deploymentId: "new", errorMessage: "boom" },
      logs: "tail",
    });
    expect(api.post).not.toHaveBeenCalled();
  });

  it("reports when a service has never been deployed", async () => {
    const api = fakeApi([[]]);

    const result = await latestDeployment({ composeId: "cmp-1" }, api);

    expect(result.data).toMatchObject({ composeId: "cmp-1", status: "none" });
  });
});
