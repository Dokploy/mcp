import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock apiClient before server.ts is imported — it calls getClientConfig() at
// module level which requires DOKPLOY_URL/DOKPLOY_API_KEY env vars.
vi.mock("./utils/apiClient.js", () => ({
  default: { get: vi.fn(), post: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

const { default: apiClient } = await import("./utils/apiClient.js");
const { createServer } = await import("./server.js");

describe("MCP server tools/list", () => {
  const originalDokployUrl = process.env.DOKPLOY_URL;
  const originalDokployApiKey = process.env.DOKPLOY_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DOKPLOY_URL = "https://dokploy.example";
    process.env.DOKPLOY_API_KEY = "test-api-key";
  });

  afterEach(() => {
    if (originalDokployUrl === undefined) {
      delete process.env.DOKPLOY_URL;
    } else {
      process.env.DOKPLOY_URL = originalDokployUrl;
    }

    if (originalDokployApiKey === undefined) {
      delete process.env.DOKPLOY_API_KEY;
    } else {
      process.env.DOKPLOY_API_KEY = originalDokployApiKey;
    }
  });

  async function createConnectedClient() {
    const server = createServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    const client = new Client({ name: "test-client", version: "1.0.0" });
    await client.connect(clientTransport);
    return client;
  }

  async function getToolList() {
    const client = await createConnectedClient();
    const { tools } = await client.listTools();
    await client.close();
    return tools;
  }

  it("returns tools", async () => {
    const tools = await getToolList();
    expect(tools.length).toBeGreaterThan(0);
  });

  it("exposes deployment-readLogs for schedule deployment log inspection", async () => {
    const tools = await getToolList();
    const tool = tools.find(({ name }) => name === "deployment-readLogs");

    expect(tool).toBeDefined();
    expect(tool?.description).toBe("GET /deployment.readLogs");

    const schema = tool?.inputSchema as Record<string, unknown>;
    const properties = schema.properties as Record<string, Record<string, unknown>>;
    const required = schema.required as string[];

    expect(properties.deploymentId).toMatchObject({
      type: "string",
      minLength: 1,
    });
    expect(properties.tail).toMatchObject({
      type: "integer",
      minimum: 1,
      maximum: 10000,
      default: 100,
    });
    expect(required).toContain("deploymentId");
  });

  it("routes deployment-readLogs calls to the deployment log API endpoint", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: "schedule stdout\nschedule stderr",
    });

    const client = await createConnectedClient();
    const result = await client.callTool({
      name: "deployment-readLogs",
      arguments: {
        deploymentId: "dep_test",
        tail: 25,
      },
    });
    await client.close();

    expect(apiClient.get).toHaveBeenCalledWith("/deployment.readLogs", {
      params: {
        deploymentId: "dep_test",
        tail: 25,
      },
    });

    const content = result.content[0];
    expect(content.type).toBe("text");
    const parsed = JSON.parse(content.type === "text" ? content.text : "");

    expect(parsed).toEqual({
      success: true,
      message: "deployment-readLogs completed successfully",
      data: "schedule stdout\nschedule stderr",
    });
  });

  it("every tool inputSchema has $schema set to draft 2020-12", async () => {
    const tools = await getToolList();
    for (const tool of tools) {
      const schema = tool.inputSchema as Record<string, unknown>;
      expect(schema.$schema, `Tool "${tool.name}" is missing $schema or has wrong draft`).toBe(
        "https://json-schema.org/draft/2020-12/schema",
      );
    }
  });

  it("no tool inputSchema contains any $schema key at nested levels", async () => {
    const tools = await getToolList();

    function findNestedSchemaKeys(obj: unknown, path = ""): string[] {
      if (obj === null || typeof obj !== "object") return [];
      if (Array.isArray(obj)) {
        return obj.flatMap((item, i) => findNestedSchemaKeys(item, `${path}[${i}]`));
      }
      const record = obj as Record<string, unknown>;
      const found: string[] = [];
      for (const [key, value] of Object.entries(record)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (key === "$schema" && path !== "") found.push(currentPath);
        found.push(...findNestedSchemaKeys(value, currentPath));
      }
      return found;
    }

    for (const tool of tools) {
      const found = findNestedSchemaKeys(tool.inputSchema);
      expect(
        found,
        `Tool "${tool.name}" has nested $schema keys at: ${found.join(", ")}`,
      ).toHaveLength(0);
    }
  });

  it("all tools have name, inputSchema with type=object", async () => {
    const tools = await getToolList();
    for (const tool of tools) {
      expect(tool.name, "tool is missing name").toBeTruthy();
      expect(tool.inputSchema, `tool "${tool.name}" is missing inputSchema`).toBeDefined();
      expect(
        (tool.inputSchema as Record<string, unknown>).type,
        `tool "${tool.name}" inputSchema is missing type`,
      ).toBe("object");
    }
  });
});
