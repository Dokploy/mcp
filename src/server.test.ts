import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { ToolListChangedNotificationSchema } from "@modelcontextprotocol/sdk/types.js";
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

const LOAD_TOOLS = "dokploy-loadTools";

function countByTags(tags: string[]): number {
  const wanted = new Set(tags.map((tag) => tag.toLowerCase()));
  return generatedTools.filter((tool) => wanted.has(tool.tag.toLowerCase())).length;
}

describe("MCP server tools/list", () => {
  const toolsetEnvVars = [
    "DOKPLOY_ENABLED_TAGS",
    "DOKPLOY_DISABLED_TAGS",
    "DOKPLOY_TOOL_PRESET",
    "DOKPLOY_DYNAMIC_TOOLS",
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

  // The toolset without the dokploy-loadTools meta-tool, which is listed
  // whenever a preset or tag filter leaves tools unloaded.
  async function getApiToolList() {
    return (await getToolList()).filter((tool) => tool.name !== LOAD_TOOLS);
  }

  async function connect() {
    const server = createServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    const client = new Client({ name: "test-client", version: "1.0.0" });
    await client.connect(clientTransport);
    return client;
  }

  function parseResult(result: Awaited<ReturnType<Client["callTool"]>>) {
    return JSON.parse((result.content as { text: string }[])[0]?.text ?? "{}");
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

    const tools = await getApiToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(countByTags(["project", "application"]));
    expect(tags).toEqual(new Set(["application", "project"]));
  });

  it("supports DOKPLOY_TOOL_PRESET=core for common application workflows", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "core";

    const tools = await getApiToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(countByTags(["project", "server", "application"]));
    expect(tags).toEqual(new Set(["application", "project", "server"]));
  });

  it("lets DOKPLOY_ENABLED_TAGS override presets", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "core";
    process.env.DOKPLOY_ENABLED_TAGS = "project,application";

    const tools = await getApiToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(countByTags(["project", "application"]));
    expect(tags).toEqual(new Set(["application", "project"]));
  });

  it("excludes DOKPLOY_DISABLED_TAGS after selecting tools", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "deploy";
    process.env.DOKPLOY_DISABLED_TAGS = "domain,deployment";

    const tools = await getApiToolList();
    const tags = new Set(tools.map((tool) => tool.name.split("-")[0]));

    expect(tools).toHaveLength(
      countByTags(["project", "environment", "server", "application", "compose"]),
    );
    expect(tags.has("domain")).toBe(false);
    expect(tags.has("deployment")).toBe(false);
  });

  it("falls back to all tools for an unknown preset", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "unknown";

    const tools = await getToolList();

    expect(tools).toHaveLength(generatedTools.length);
  });

  it("does not list dokploy-loadTools when every tool is already loaded", async () => {
    const names = (await getToolList()).map((tool) => tool.name);

    expect(names).not.toContain(LOAD_TOOLS);
  });

  it("lists dokploy-loadTools when a preset leaves tools unloaded", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";

    const loader = (await getToolList()).find((tool) => tool.name === LOAD_TOOLS);

    expect(loader).toBeDefined();
    expect(loader?.description).toContain("postgres");
    expect(loader?.description).not.toMatch(/\bapplication\b,/);
  });

  it("can be turned off with DOKPLOY_DYNAMIC_TOOLS=false", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";
    process.env.DOKPLOY_DYNAMIC_TOOLS = "false";

    const tools = await getToolList();

    expect(tools.map((tool) => tool.name)).not.toContain(LOAD_TOOLS);
    expect(tools).toHaveLength(countByTags(["project", "application"]));
  });

  it("loads a tool group on demand and notifies the client once", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";
    const client = await connect();
    const listChanged = vi.fn();
    client.setNotificationHandler(ToolListChangedNotificationSchema, listChanged);

    const before = (await client.listTools()).tools.map((tool) => tool.name);
    const result = await client.callTool({
      name: LOAD_TOOLS,
      arguments: { tags: ["Postgres", "redis"] },
    });
    const after = (await client.listTools()).tools;
    await client.close();

    const payload = parseResult(result).data;
    expect(before).not.toContain("postgres-one");
    expect(after.map((tool) => tool.name)).toContain("postgres-one");
    expect(after.map((tool) => tool.name)).toContain("redis-one");
    expect(after).toHaveLength(before.length + countByTags(["postgres", "redis"]));
    expect(payload.loaded.map((group: { tag: string }) => group.tag)).toEqual([
      "postgres",
      "redis",
    ]);
    expect(payload.loaded[0].tools).toHaveLength(countByTags(["postgres"]));
    expect(payload.available.map((group: { tag: string }) => group.tag)).not.toContain("postgres");
    expect(listChanged).toHaveBeenCalledTimes(1);

    const loaded = after.find((tool) => tool.name === "postgres-one");
    expect((loaded?.inputSchema as Record<string, unknown>).$schema).toBe(
      "https://json-schema.org/draft/2020-12/schema",
    );
  });

  it("lists loadable groups when called without tags", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";
    const client = await connect();

    const payload = parseResult(await client.callTool({ name: LOAD_TOOLS, arguments: {} })).data;
    await client.close();

    expect(payload.loaded).toEqual([]);
    expect(payload.available).toContainEqual({ tag: "postgres", tools: countByTags(["postgres"]) });
    expect(payload.available.map((group: { tag: string }) => group.tag)).not.toContain("project");
  });

  it("never loads DOKPLOY_DISABLED_TAGS and reports why a tag is unavailable", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";
    process.env.DOKPLOY_DISABLED_TAGS = "settings";
    const client = await connect();

    const result = await client.callTool({
      name: LOAD_TOOLS,
      arguments: { tags: ["settings", "project", "nope"] },
    });
    const names = (await client.listTools()).tools.map((tool) => tool.name);
    await client.close();

    const payload = parseResult(result).data;
    expect(payload.loaded).toEqual([]);
    expect(payload.unavailable).toEqual([
      { tag: "settings", reason: "disabled by DOKPLOY_DISABLED_TAGS" },
      { tag: "project", reason: "already loaded" },
      { tag: "nope", reason: "unknown tag" },
    ]);
    expect(names.some((name) => name.startsWith("settings-"))).toBe(false);
  });

  it("reports a group as already loaded on a second request", async () => {
    process.env.DOKPLOY_TOOL_PRESET = "minimal";
    const client = await connect();

    await client.callTool({ name: LOAD_TOOLS, arguments: { tags: ["backup"] } });
    const second = await client.callTool({ name: LOAD_TOOLS, arguments: { tags: ["backup"] } });
    const tools = (await client.listTools()).tools;
    await client.close();

    expect(parseResult(second).data.unavailable).toEqual([
      { tag: "backup", reason: "already loaded" },
    ]);
    expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length);
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
