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
const { generatedTools } = await import("./generated/tools.js");
const { createServer } = await import("./server.js");

describe("MCP server tools/list", () => {
  const originalDokployUrl = process.env.DOKPLOY_URL;
  const originalDokployApiKey = process.env.DOKPLOY_API_KEY;
  const originalDokployRedactEnv = process.env.DOKPLOY_REDACT_ENV;
  const originalDokployRedactFields = process.env.DOKPLOY_REDACT_FIELDS;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DOKPLOY_URL = "https://dokploy.example";
    process.env.DOKPLOY_API_KEY = "test-api-key";
    process.env.DOKPLOY_REDACT_ENV = "false";
    delete process.env.DOKPLOY_REDACT_FIELDS;
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

    if (originalDokployRedactEnv === undefined) {
      delete process.env.DOKPLOY_REDACT_ENV;
    } else {
      process.env.DOKPLOY_REDACT_ENV = originalDokployRedactEnv;
    }

    if (originalDokployRedactFields === undefined) {
      delete process.env.DOKPLOY_REDACT_FIELDS;
    } else {
      process.env.DOKPLOY_REDACT_FIELDS = originalDokployRedactFields;
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

  it("exposes application env upsert with partial-update inputs", async () => {
    const tools = await getToolList();
    const tool = tools.find((candidate) => candidate.name === "application-env-upsert");

    expect(tool).toBeDefined();
    expect(tool?.description).toBe("POST /application/env/upsert");

    const schema = tool?.inputSchema as Record<string, unknown>;
    const properties = schema.properties as Record<string, Record<string, unknown>>;

    expect(schema.required).toEqual(["applicationId", "variables"]);
    expect(properties.applicationId.type).toBe("string");
    expect(properties.variables.type).toBe("object");
    expect(properties.variables.additionalProperties).toMatchObject({
      type: "string",
    });
    expect(properties.variables.propertyNames).toMatchObject({
      pattern: "^[A-Za-z_][A-Za-z0-9_]*$",
    });
    expect(properties.redeploy.type).toBe("boolean");
    expect(properties.dryRun.type).toBe("boolean");
    expect(properties.expectedRevision.type).toBe("string");

    const generatedTool = generatedTools.find(
      (candidate) => candidate.name === "application-env-upsert",
    );
    expect(generatedTool).toBeDefined();
    expect(
      generatedTool?.schema.safeParse({
        applicationId: "app_1",
        variables: {
          REDIS_PASSWORD: "placeholder-secret-value",
        },
      }).success,
    ).toBe(true);
    expect(
      generatedTool?.schema.safeParse({
        applicationId: "app_1",
        variables: {},
      }).success,
    ).toBe(false);
    expect(
      generatedTool?.schema.safeParse({
        applicationId: "app_1",
        variables: {
          "1_BAD": "placeholder-secret-value",
        },
      }).success,
    ).toBe(false);
  });

  it("routes application env upsert without full environment replacement or raw value output", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        applicationId: "app_1",
        changed: true,
        revision: "env:next",
        dryRun: true,
        redeployed: false,
        variables: [
          {
            name: "REDIS_PASSWORD",
            action: "updated",
            secret: true,
          },
        ],
      },
    });

    const client = await createConnectedClient();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const result = await client.callTool({
        name: "application-env-upsert",
        arguments: {
          applicationId: "app_1",
          variables: {
            REDIS_PASSWORD: "placeholder-secret-value",
          },
          dryRun: true,
          redeploy: false,
          expectedRevision: "env:current",
        },
      });

      expect(apiClient.get).not.toHaveBeenCalled();
      expect(apiClient.post).toHaveBeenCalledTimes(1);
      expect(apiClient.post).toHaveBeenCalledWith("/application/env/upsert", {
        applicationId: "app_1",
        variables: {
          REDIS_PASSWORD: "placeholder-secret-value",
        },
        dryRun: true,
        redeploy: false,
        expectedRevision: "env:current",
      });
      expect(apiClient.post).not.toHaveBeenCalledWith(
        "/application.saveEnvironment",
        expect.anything(),
      );

      const [, postBody] = vi.mocked(apiClient.post).mock.calls[0] as [
        string,
        Record<string, unknown>,
      ];
      expect(postBody).not.toHaveProperty("env");
      expect(postBody).not.toHaveProperty("buildArgs");
      expect(postBody).not.toHaveProperty("buildSecrets");
      expect(postBody).not.toHaveProperty("createEnvFile");

      const responseText = result.content
        .map((item) => (item.type === "text" ? item.text : ""))
        .join("\n");
      const logText = consoleError.mock.calls.map((call) => String(call[0])).join("\n");

      expect(responseText).toContain('"applicationId": "app_1"');
      expect(responseText).toContain('"secret": true');
      expect(responseText).not.toContain("placeholder-secret-value");
      expect(logText).toContain('"REDIS_PASSWORD":"[REDACTED]"');
      expect(logText).not.toContain("placeholder-secret-value");
    } finally {
      consoleError.mockRestore();
      await client.close();
    }
  });
});
