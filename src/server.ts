import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import type { ZodObject, ZodRawShape } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { generatedTools } from "./generated/tools.js";
import { createHandler } from "./handler.js";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("MCP-Server");

const JSON_SCHEMA_2020_12 = "https://json-schema.org/draft/2020-12/schema";
const LARGE_TOOLSET_WARNING_THRESHOLD = 150;

const TOOL_PRESETS = {
  all: null,
  minimal: "project,application",
  core: "project,server,application",
  deploy: "project,environment,server,application,domain,deployment",
  databases: "postgres,redis,mysql,mariadb,mongo,libsql",
  git: "github,gitlab,bitbucket,gitea,gitProvider,registry,sshKey",
} as const;

type ToolPreset = keyof typeof TOOL_PRESETS;

function parseTagList(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isToolPreset(value: string): value is ToolPreset {
  return Object.hasOwn(TOOL_PRESETS, value);
}

function getEnabledTools() {
  const enabledTags = process.env.DOKPLOY_ENABLED_TAGS;
  const disabledTags = parseTagList(process.env.DOKPLOY_DISABLED_TAGS);
  const requestedPreset = process.env.DOKPLOY_TOOL_PRESET?.trim().toLowerCase() || "all";
  const preset: ToolPreset = isToolPreset(requestedPreset) ? requestedPreset : "all";

  if (!isToolPreset(requestedPreset)) {
    logger.warn("Unknown tool preset, falling back to all tools", {
      requestedPreset,
      availablePresets: Object.keys(TOOL_PRESETS),
    });
  }

  let selectedTags = parseTagList(enabledTags);
  const source = selectedTags.size > 0 ? "enabled-tags" : "preset";

  if (selectedTags.size === 0) {
    selectedTags = parseTagList(TOOL_PRESETS[preset] ?? undefined);
  }

  let filtered =
    selectedTags.size > 0
      ? generatedTools.filter((tool) => selectedTags.has(tool.tag.toLowerCase()))
      : generatedTools;

  if (disabledTags.size > 0) {
    filtered = filtered.filter((tool) => !disabledTags.has(tool.tag.toLowerCase()));
  }

  const context = {
    total: generatedTools.length,
    loaded: filtered.length,
    source,
    preset,
    enabledTags: [...selectedTags],
    disabledTags: [...disabledTags],
  };

  logger.info("Loaded tools", context);

  if (filtered.length > LARGE_TOOLSET_WARNING_THRESHOLD) {
    logger.warn("Large toolset loaded; some MCP clients or LLM providers may time out", {
      ...context,
      recommendation:
        "Set DOKPLOY_TOOL_PRESET=minimal or DOKPLOY_ENABLED_TAGS to reduce tool count",
    });
  }

  return filtered;
}

function stripNestedSchemaKeys(value: unknown): void {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) stripNestedSchemaKeys(item);
    return;
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key === "$schema") {
      delete record[key];
    } else {
      stripNestedSchemaKeys(record[key]);
    }
  }
}

// Claude's API requires JSON Schema draft 2020-12. The MCP SDK's built-in
// Zod→JSON Schema converter emits draft-07 by default, which causes a 400
// error on tools/list. We bypass the SDK's auto-generated handler by
// registering our own with pre-converted draft-2020-12 schemas.
// See https://github.com/Dokploy/mcp/issues/32
function toDraft2020_12JsonSchema(schema: ZodObject<ZodRawShape>): Record<string, unknown> {
  const result = zodToJsonSchema(schema, {
    target: "jsonSchema2019-09",
    strictUnions: true,
  }) as Record<string, unknown>;

  stripNestedSchemaKeys(result);
  result.$schema = JSON_SCHEMA_2020_12;
  return result;
}

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "2.0.0",
  });

  const tools = getEnabledTools();

  for (const tool of tools) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema.shape,
      tool.annotations ?? {},
      createHandler(tool),
    );
  }

  const toolList = tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: toDraft2020_12JsonSchema(tool.schema),
    annotations: tool.annotations,
  }));

  server.server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolList,
  }));

  return server;
}
