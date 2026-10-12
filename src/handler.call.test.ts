import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();
const post = vi.fn();

vi.mock("./utils/apiClient.js", () => ({
  default: { get, post },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

const { createServer } = await import("./server.js");

async function connect() {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: "test-client", version: "1.0.0" });
  await client.connect(clientTransport);
  return { client, close: () => client.close() };
}

function textOf(result: unknown): string {
  const content = (result as { content: { type: string; text: string }[] }).content;
  return content.map((c) => c.text).join("\n");
}

describe("MCP server tools/call", () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
  });

  afterEach(() => {
    delete process.env.DOKPLOY_TOOL_PRESET;
    delete process.env.DOKPLOY_ENABLED_TAGS;
  });

  it("validates arguments and dispatches a GET tool to the API client", async () => {
    get.mockResolvedValue({ data: { applicationId: "app-1", name: "demo" } });
    const { client, close } = await connect();

    const result = await client.callTool({
      name: "application-one",
      arguments: { applicationId: "app-1" },
    });

    expect(get).toHaveBeenCalledWith("/application.one", { params: { applicationId: "app-1" } });
    expect(result.isError).toBeFalsy();
    expect(textOf(result)).toContain("demo");
    await close();
  });

  it("dispatches a POST tool with its body", async () => {
    post.mockResolvedValue({ data: { ok: true } });
    const { client, close } = await connect();

    await client.callTool({
      name: "application-create",
      arguments: { name: "demo", environmentId: "env-1" },
    });

    expect(post).toHaveBeenCalledWith("/application.create", {
      name: "demo",
      environmentId: "env-1",
    });
    await close();
  });

  it("rejects invalid arguments before calling the API client", async () => {
    const { client, close } = await connect();

    const result = await client.callTool({
      name: "application-one",
      arguments: {},
    });

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("Invalid arguments for application-one");
    expect(get).not.toHaveBeenCalled();
    await close();
  });

  it("returns an error for a tool outside the active toolset", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";
    const { client, close } = await connect();

    const result = await client.callTool({
      name: "admin-setupMonitoring",
      arguments: {},
    });

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain("Unknown tool: admin-setupMonitoring");
    expect(get).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
    await close();
  });

  it("builds each tool's Zod schema lazily and caches it", async () => {
    const { generatedTools } = await import("./generated/tools.js");
    const tool = generatedTools.find((t) => t.name === "application-one");
    expect(typeof tool?.schema).toBe("function");
    const first = tool?.schema();
    const second = tool?.schema();
    expect(first).not.toBe(second);
    expect(first?.safeParse({ applicationId: "x" }).success).toBe(true);
  });
});
