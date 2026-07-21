import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it, vi } from "vitest";

// Mock apiClient before server.ts is imported — it calls getClientConfig() at
// module level which requires DOKPLOY_URL/DOKPLOY_API_KEY env vars.
vi.mock("./utils/apiClient.js", () => ({
  default: { get: vi.fn(), post: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

const { createServer } = await import("./server.js");

describe("MCP server tools/list", () => {
  async function withClient<T>(fn: (client: Client) => Promise<T>) {
    const server = createServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    const client = new Client({ name: "test-client", version: "1.0.0" });
    await client.connect(clientTransport);
    try {
      return await fn(client);
    } finally {
      await client.close();
    }
  }

  async function getToolList() {
    return withClient(async (client) => {
      const { tools } = await client.listTools();
      return tools;
    });
  }

  it("returns tools", async () => {
    const tools = await getToolList();
    expect(tools.length).toBeGreaterThan(0);
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

  it("does not emit pattern keywords in tool input schemas", async () => {
    const tools = await getToolList();

    function findPatternKeys(obj: unknown, path = ""): string[] {
      if (obj === null || typeof obj !== "object") return [];
      if (Array.isArray(obj)) {
        return obj.flatMap((item, i) => findPatternKeys(item, `${path}[${i}]`));
      }

      const record = obj as Record<string, unknown>;
      const found: string[] = [];
      for (const [key, value] of Object.entries(record)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (key === "pattern") {
          found.push(`${currentPath}: ${value}`);
        }
        found.push(...findPatternKeys(value, currentPath));
      }
      return found;
    }

    for (const tool of tools) {
      const found = findPatternKeys(tool.inputSchema);
      expect(
        found,
        `Tool "${tool.name}" has provider-incompatible pattern keywords at: ${found.join(", ")}`,
      ).toHaveLength(0);
    }
  });

  it("returns empty resource and prompt lists for clients that query them", async () => {
    await withClient(async (client) => {
      await expect(client.listResources()).resolves.toEqual({ resources: [] });
      await expect(client.listResourceTemplates()).resolves.toEqual({ resourceTemplates: [] });
      await expect(client.listPrompts()).resolves.toEqual({ prompts: [] });
    });
  });
});
