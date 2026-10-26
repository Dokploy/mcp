import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./clientConfig.js", () => ({
  getClientConfig: () => ({
    dokployUrl: "https://dokploy.example.test",
    authToken: "initial-test-key",
    customHeaders: { "X-Test-Proxy": "proxy-test-header" },
    timeout: 30000,
  }),
}));
vi.mock("./logger.js", () => ({
  createLogger: () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

async function requestHeaders(method: "get" | "post" = "get") {
  const { default: client } = await import("./apiClient.js");
  const response = await client.request({
    method,
    url: "/project.all",
    adapter: async (config) => ({
      data: config.headers.toJSON(),
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    }),
  });
  return response.data;
}

describe("API client authentication defaults", () => {
  beforeEach(() => vi.resetModules());

  it("sends the configured key and custom headers initially", async () => {
    expect(await requestHeaders()).toMatchObject({
      "x-api-key": "initial-test-key",
      "X-Test-Proxy": "proxy-test-header",
    });
  });

  it("replaces the initial key for subsequent GET and POST requests", async () => {
    const { setAuthToken } = await import("./apiClient.js");
    setAuthToken("replacement-test-key");
    for (const method of ["get", "post"] as const) {
      expect((await requestHeaders(method))["x-api-key"]).toBe("replacement-test-key");
    }
  });

  it("clears the initial key without retaining a root-level credential", async () => {
    const { clearAuthToken } = await import("./apiClient.js");
    clearAuthToken();
    expect(await requestHeaders()).not.toHaveProperty("x-api-key");
  });

  it("can clear and then set a new key without changing proxy headers", async () => {
    const { setAuthToken, clearAuthToken } = await import("./apiClient.js");
    setAuthToken("replacement-test-key");
    clearAuthToken();
    expect(await requestHeaders("post")).not.toHaveProperty("x-api-key");
    setAuthToken("third-test-key");
    expect(await requestHeaders()).toMatchObject({
      "x-api-key": "third-test-key",
      "X-Test-Proxy": "proxy-test-header",
    });
  });
});
