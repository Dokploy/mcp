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

  it("keeps redacting by field name as before", async () => {
    mocks.apiGet.mockResolvedValue({ data: { appName: "web", env: "DB_PASSWORD=hunter2" } });

    const response = await createHandler(listProjectsTool)({});

    expect(payloadOf(response).data).toEqual({ appName: "web", env: "[REDACTED]" });
  });
});
