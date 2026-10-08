import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { type ZodObject, type ZodRawShape, z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { generatedTools } from "./generated/tools.js";
import { createHandler } from "./handler.js";
import type { ToolDefinition } from "./types.js";
import { createLogger } from "./utils/logger.js";
import { ResponseFormatter } from "./utils/responseFormatter.js";

const logger = createLogger("MCP-Server");

const JSON_SCHEMA_2020_12 = "https://json-schema.org/draft/2020-12/schema";
const LARGE_TOOLSET_WARNING_THRESHOLD = 150;
const LOAD_TOOLS_NAME = "dokploy-loadTools";

const TOOL_PRESETS = {
  all: null,
  minimal: "project,application",
  core: "project,server,application",
  deploy: "project,environment,server,application,compose,domain,deployment",
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

function isDynamicLoadingEnabled(): boolean {
  const value = process.env.DOKPLOY_DYNAMIC_TOOLS?.trim().toLowerCase();
  return !["false", "0", "no", "off"].includes(value ?? "");
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

  // Tools left out by the preset or enabled tags can be loaded later through
  // dokploy-loadTools. Disabled tags are a hard exclusion and stay unavailable.
  const enabled = new Set(filtered);
  const loadable = generatedTools.filter(
    (tool) => !enabled.has(tool) && !disabledTags.has(tool.tag.toLowerCase()),
  );

  return { enabled: filtered, loadable, disabledTags };
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

// Provider schema validators (OpenAI, Sonnet strict, DeepSeek) accept only a
// conservative subset of ECMA-262: lookarounds and loosely-escaped character
// classes (e.g. an unescaped "[" inside a class) are rejected even though JS
// allows them. Lookarounds compile fine under the strict "v" flag, so they
// need their own check; everything else is caught by the "v" compile test.
function usesUnsupportedRegexSyntax(pattern: unknown): boolean {
  if (typeof pattern !== "string") return false;
  if (/\(\?<?[=!]/.test(pattern)) return true;
  try {
    new RegExp(pattern, "v");
    return false;
  } catch {
    return true;
  }
}

function stripUnsupportedRegexPatterns(value: unknown): void {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) stripUnsupportedRegexPatterns(item);
    return;
  }

  const record = value as Record<string, unknown>;
  if (usesUnsupportedRegexSyntax(record.pattern)) {
    delete record.pattern;
  }

  for (const child of Object.values(record)) {
    stripUnsupportedRegexPatterns(child);
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
  stripUnsupportedRegexPatterns(result);
  result.$schema = JSON_SCHEMA_2020_12;
  return result;
}

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "2.0.0",
  });

  const { enabled, loadable, disabledTags } = getEnabledTools();

  const toolList: Record<string, unknown>[] = [];

  function registerTool(tool: ToolDefinition) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema.shape,
      tool.annotations ?? {},
      createHandler(tool),
    );
    toolList.push({
      name: tool.name,
      description: tool.description,
      inputSchema: toDraft2020_12JsonSchema(tool.schema),
      annotations: tool.annotations,
    });
  }

  for (const tool of enabled) {
    registerTool(tool);
  }

  if (loadable.length > 0 && isDynamicLoadingEnabled()) {
    registerLoadTools(server, loadable, disabledTags, registerTool, toolList);
  }

  server.server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolList,
  }));

  return server;
}

// Lets a session start on a small preset and add tool groups when it needs
// them, instead of restarting the client with a wider DOKPLOY_ENABLED_TAGS.
// See https://github.com/Dokploy/mcp/issues/81
function registerLoadTools(
  server: McpServer,
  loadable: ToolDefinition[],
  disabledTags: Set<string>,
  registerTool: (tool: ToolDefinition) => void,
  toolList: Record<string, unknown>[],
) {
  // Keyed by lowercased tag; a tag is removed once its tools are loaded.
  const pending = new Map<string, { tag: string; tools: ToolDefinition[] }>();
  for (const tool of loadable) {
    const key = tool.tag.toLowerCase();
    const group = pending.get(key) ?? { tag: tool.tag, tools: [] };
    group.tools.push(tool);
    pending.set(key, group);
  }

  const availableGroups = () =>
    [...pending.values()]
      .map((group) => ({ tag: group.tag, tools: group.tools.length }))
      .sort((a, b) => a.tag.localeCompare(b.tag));

  const shape = {
    tags: z
      .array(z.string().min(1))
      .default([])
      .describe(
        'Tool groups to load, e.g. ["backup", "postgres"]. Leave empty to list the groups that can be loaded.',
      ),
  };
  const description = `Load more Dokploy tool groups into this session. Only part of the Dokploy API is loaded at startup; call this with the tags you need and the new tools become available. Call it with no tags to list what can be loaded. Available now: ${availableGroups()
    .map((group) => group.tag)
    .join(", ")}.`;
  const annotations = { title: "Dokploy Load Tools", idempotentHint: true, openWorldHint: false };

  server.tool(LOAD_TOOLS_NAME, description, shape, annotations, async ({ tags }) => {
    const loaded: { tag: string; tools: { name: string; description: string }[] }[] = [];
    const unavailable: { tag: string; reason: string }[] = [];

    // server.tool() notifies the client on every registration once connected.
    // Hold those back so one call sends a single tools/list_changed.
    const notify = server.sendToolListChanged.bind(server);
    server.sendToolListChanged = () => {};
    try {
      for (const requested of new Set(tags.map((tag) => tag.trim().toLowerCase()))) {
        const group = pending.get(requested);
        if (group) {
          for (const tool of group.tools) registerTool(tool);
          pending.delete(requested);
          loaded.push({
            tag: group.tag,
            tools: group.tools.map((tool) => ({ name: tool.name, description: tool.description })),
          });
        } else if (disabledTags.has(requested)) {
          unavailable.push({ tag: requested, reason: "disabled by DOKPLOY_DISABLED_TAGS" });
        } else if (generatedTools.some((tool) => tool.tag.toLowerCase() === requested)) {
          unavailable.push({ tag: requested, reason: "already loaded" });
        } else {
          unavailable.push({ tag: requested, reason: "unknown tag" });
        }
      }
    } finally {
      server.sendToolListChanged = notify;
    }

    if (loaded.length > 0) {
      logger.info("Loaded tool groups on demand", {
        tags: loaded.map((group) => group.tag),
        tools: loaded.reduce((count, group) => count + group.tools.length, 0),
      });
      server.sendToolListChanged();
    }

    const toolCount = loaded.reduce((count, group) => count + group.tools.length, 0);
    return ResponseFormatter.success(
      loaded.length > 0
        ? `Loaded ${toolCount} tools from ${loaded.length} group(s); they are now available`
        : "No tool groups were loaded",
      { loaded, unavailable, available: availableGroups() },
    );
  });

  toolList.push({
    name: LOAD_TOOLS_NAME,
    description,
    inputSchema: toDraft2020_12JsonSchema(z.object(shape)),
    annotations,
  });
}
