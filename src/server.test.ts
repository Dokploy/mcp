import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { generatedTools } from "./generated/tools.js";

vi.stubEnv("DOKPLOY_URL", "https://dokploy.example.com");
vi.stubEnv("DOKPLOY_API_KEY", "test-api-key");
vi.stubEnv("DOKPLOY_ENABLED_TAGS", "");

// Mock apiClient before server.ts is imported so tool calls remain isolated
// from the Dokploy API.
vi.mock("./utils/apiClient.js", () => ({
  default: { get: vi.fn(), post: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

const { createServer } = await import("./server.js");
const { default: apiClient } = await import("./utils/apiClient.js");

describe("MCP server tools/list", () => {
  async function getToolList() {
    const server = createServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    const client = new Client({ name: "test-client", version: "1.0.0" });
    await client.connect(clientTransport);
    const { tools } = await client.listTools();
    await client.close();
    return tools;
  }

  it("returns tools", async () => {
    const tools = await getToolList();
    expect(tools.length).toBeGreaterThan(0);
  });

  it("does not construct validation schemas while listing tools", async () => {
    const tool = generatedTools[0];
    if (!tool) throw new Error("Expected at least one generated tool");

    const originalSchema = tool.schema;
    tool.schema = z.lazy(() => {
      throw new Error("tools/list constructed a validation schema");
    });

    try {
      const tools = await getToolList();
      expect(tools[0]?.name).toBe(tool.name);
    } finally {
      tool.schema = originalSchema;
    }
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

  it("keeps SDK validation and dispatch for lazily constructed schemas", async () => {
    vi.mocked(apiClient.get).mockClear();
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { applicationId: "app-1" } });

    const server = createServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    const client = new Client({ name: "test-client", version: "1.0.0" });
    await client.connect(clientTransport);

    try {
      const invalid = await client.callTool({
        name: "application-one",
        arguments: {},
      });
      expect(invalid.isError).toBe(true);
      expect(apiClient.get).not.toHaveBeenCalled();

      const valid = await client.callTool({
        name: "application-one",
        arguments: { applicationId: "app-1" },
      });
      expect(valid.isError).not.toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith("/application.one", {
        params: { applicationId: "app-1" },
      });
    } finally {
      await client.close();
    }
  });
});
