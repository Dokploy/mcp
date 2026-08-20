import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock apiClient before server.ts is imported — it calls getClientConfig() at
// module level which requires DOKPLOY_URL/DOKPLOY_API_KEY env vars.
vi.mock("./utils/apiClient.js", () => ({
  default: { get: vi.fn(), post: vi.fn() },
  setAuthToken: vi.fn(),
  clearAuthToken: vi.fn(),
}));

const { createServer } = await import("./server.js");
const { generatedTools } = await import("./generated/tools.js");

function countByTags(tags: string[]): number {
  const wanted = new Set(tags.map((tag) => tag.toLowerCase()));
  return generatedTools.filter((tool) => wanted.has(tool.tag.toLowerCase())).length;
}

describe("MCP server tools/list", () => {
  const toolsetEnvVars = [
    "DOKPLOY_ENABLED_TAGS",
    "DOKPLOY_DISABLED_TAGS",
    "DOKPLOY_DISABLED_TOOLS",
    "DOKPLOY_TOOL_PRESET",
  ];

  afterEach(() => {
    for (const envVar of toolsetEnvVars) {
      delete process.env[envVar];
    }
  });

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

  it("returns all tools by default", async () => {
    const tools = await getToolList();
    expect(tools).toHaveLength(generatedTools.length);
  });

  it("supports DOKPLOY_TOOL_PRESET=minimal for clients sensitive to large toolsets", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";

    const tools = await getToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(countByTags(["project", "application"]));
    expect(tags).toEqual(new Set(["application", "project"]));
  });

  it("supports DOKPLOY_TOOL_PRESET=core for common application workflows", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "core";

    const tools = await getToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(countByTags(["project", "server", "application"]));
    expect(tags).toEqual(new Set(["application", "project", "server"]));
  });

  it("lets DOKPLOY_ENABLED_TAGS override presets", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "core";
    process.env.DOKPLOY_ENABLED_TAGS = "project,application";

    const tools = await getToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(countByTags(["project", "application"]));
    expect(tags).toEqual(new Set(["application", "project"]));
  });

  it("excludes DOKPLOY_DISABLED_TAGS after selecting tools", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "deploy";
    process.env.DOKPLOY_DISABLED_TAGS = "domain,deployment";

    const tools = await getToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(
      countByTags(["project", "environment", "server", "application", "compose"]),
    );
    expect(tags.has("domain")).toBe(false);
    expect(tags.has("deployment")).toBe(false);
  });

  it("excludes individual tools named in DOKPLOY_DISABLED_TOOLS", async () => {
    process.env.DOKPLOY_DISABLED_TOOLS = "docker-readContainerFile,docker-writeContainerFile";

    const tools = await getToolList();
    const names = new Set(tools.map((tool) => tool.name));

    expect(tools).toHaveLength(generatedTools.length - 2);
    expect(names.has("docker-readContainerFile")).toBe(false);
    expect(names.has("docker-writeContainerFile")).toBe(false);
    // The rest of the docker category survives — that is the point of
    // disabling by tool name instead of by tag.
    expect(names.has("docker-getContainers")).toBe(true);
    expect(names.has("docker-restartContainer")).toBe(true);
  });

  it("matches DOKPLOY_DISABLED_TOOLS case-insensitively and ignores spacing", async () => {
    process.env.DOKPLOY_DISABLED_TOOLS = " DOCKER-READCONTAINERFILE , ";

    const tools = await getToolList();
    const names = new Set(tools.map((tool) => tool.name));

    expect(tools).toHaveLength(generatedTools.length - 1);
    expect(names.has("docker-readContainerFile")).toBe(false);
  });

  it("ignores unknown names in DOKPLOY_DISABLED_TOOLS", async () => {
    process.env.DOKPLOY_DISABLED_TOOLS = "does-notExist";

    const tools = await getToolList();

    expect(tools).toHaveLength(generatedTools.length);
  });

  it("applies DOKPLOY_DISABLED_TOOLS on top of a preset", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";
    process.env.DOKPLOY_DISABLED_TOOLS = "project-remove";

    const tools = await getToolList();
    const names = new Set(tools.map((tool) => tool.name));

    expect(tools).toHaveLength(countByTags(["project", "application"]) - 1);
    expect(names.has("project-remove")).toBe(false);
  });

  it("falls back to all tools for an unknown preset", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "unknown";

    const tools = await getToolList();

    expect(tools).toHaveLength(generatedTools.length);
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

  it("no tool inputSchema exposes regex lookaround patterns", async () => {
    const tools = await getToolList();

    function findLookaroundPatterns(obj: unknown, path = ""): string[] {
      if (obj === null || typeof obj !== "object") return [];
      if (Array.isArray(obj)) {
        return obj.flatMap((item, i) => findLookaroundPatterns(item, `${path}[${i}]`));
      }

      const record = obj as Record<string, unknown>;
      const found: string[] = [];
      for (const [key, value] of Object.entries(record)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (key === "pattern" && typeof value === "string" && /\(\?<?[=!]/.test(value)) {
          found.push(currentPath);
        }
        found.push(...findLookaroundPatterns(value, currentPath));
      }
      return found;
    }

    for (const tool of tools) {
      const found = findLookaroundPatterns(tool.inputSchema);
      expect(
        found,
        `Tool "${tool.name}" exposes provider-incompatible lookaround patterns at: ${found.join(", ")}`,
      ).toHaveLength(0);
    }
  });

  it("no tool inputSchema exposes patterns invalid under strict regex syntax", async () => {
    const tools = await getToolList();

    function findStrictInvalidPatterns(obj: unknown, path = ""): string[] {
      if (obj === null || typeof obj !== "object") return [];
      if (Array.isArray(obj)) {
        return obj.flatMap((item, i) => findStrictInvalidPatterns(item, `${path}[${i}]`));
      }

      const record = obj as Record<string, unknown>;
      const found: string[] = [];
      for (const [key, value] of Object.entries(record)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (key === "pattern" && typeof value === "string") {
          try {
            new RegExp(value, "v");
          } catch {
            found.push(`${currentPath}: ${value}`);
          }
        }
        found.push(...findStrictInvalidPatterns(value, currentPath));
      }
      return found;
    }

    for (const tool of tools) {
      const found = findStrictInvalidPatterns(tool.inputSchema);
      expect(
        found,
        `Tool "${tool.name}" exposes provider-incompatible patterns at: ${found.join(", ")}`,
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
