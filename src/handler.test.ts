import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createHandler } from "./handler.js";
import apiClient from "./utils/apiClient.js";

const logs = vi.hoisted(() => ({ info: vi.fn(), error: vi.fn() }));
vi.mock("./utils/logger.js", () => ({ createLogger: () => logs }));
vi.mock("./utils/apiClient.js", () => ({ default: { get: vi.fn(), post: vi.fn() } }));
vi.mock("./utils/clientConfig.js", () => ({
  getClientConfig: () => ({ redactEnv: true, redactFields: [] }),
}));
const handler = createHandler({
  name: "server-all",
  tag: "server",
  description: "Read servers",
  method: "GET",
  path: "/server.all",
  schema: z.object({}),
});

describe("tool error diagnostics", () => {
  beforeEach(() => vi.clearAllMocks());
  it("preserves a permission status without forwarding body/config/message secrets", async () => {
    vi.mocked(apiClient.get).mockRejectedValue({
      isAxiosError: true,
      message: "SECRET_MESSAGE",
      config: { method: "get", headers: { "x-api-key": "SECRET_KEY" } },
      response: { status: 403, data: { env: "SECRET_BODY" }, headers: {} },
    });
    const result = await handler({});
    expect(result.isError).toBe(true);
    expect(JSON.parse(result.content[0]!.text).diagnostics).toMatchObject({
      code: "PERMISSION_DENIED",
      httpStatus: 403,
      retryable: false,
    });
    expect(JSON.stringify(result)).not.toContain("SECRET");
    expect(JSON.stringify(logs.error.mock.calls)).not.toContain("SECRET");
  });
  it("does not echo an untrusted non-HTTP exception or classify by its message", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error("401 Not Found SECRET"));
    const result = await handler({});
    expect(JSON.parse(result.content[0]!.text).diagnostics.code).toBe("INTERNAL_ERROR");
    expect(JSON.stringify(result)).not.toContain("SECRET");
  });
});
