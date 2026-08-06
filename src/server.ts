import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { generatedTools } from "./generated/tools.js";
import { createHandler } from "./handler.js";
import type { ToolDefinition } from "./types.js";
import { getClientConfig } from "./utils/clientConfig.js";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("MCP-Server");
const parsedInputSchemas = new WeakMap<ToolDefinition, Record<string, unknown>>();

// Preserve fail-fast configuration validation while deferring the heavier
// Axios client until the first tool invocation.
getClientConfig();

function getEnabledTools() {
  const enabledTags = process.env.DOKPLOY_ENABLED_TAGS;

  if (!enabledTags) {
    return generatedTools;
  }

  const tags = new Set(
    enabledTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
  );

  const filtered = generatedTools.filter((tool) => tags.has(tool.tag.toLowerCase()));

  logger.info("Filtered tools by tags", {
    enabledTags: [...tags],
    total: generatedTools.length,
    loaded: filtered.length,
  });

  return filtered;
}

function getInputSchema(tool: ToolDefinition): Record<string, unknown> {
  const cached = parsedInputSchemas.get(tool);
  if (cached) return cached;

  const inputSchema = JSON.parse(tool.inputSchemaJson) as unknown;
  if (inputSchema === null || typeof inputSchema !== "object" || Array.isArray(inputSchema)) {
    throw new Error("Generated tool input schema must be a JSON object");
  }

  const parsed = inputSchema as Record<string, unknown>;
  parsedInputSchemas.set(tool, parsed);
  return parsed;
}

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "2.0.0",
  });

  const tools = getEnabledTools();

  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.schema,
        ...(tool.annotations ? { annotations: tool.annotations } : {}),
      },
      createHandler(tool),
    );
  }

  let toolList:
    | {
        name: string;
        description: string;
        inputSchema: Record<string, unknown>;
        annotations: (typeof tools)[number]["annotations"];
      }[]
    | undefined;

  // Claude's API requires JSON Schema draft 2020-12. Generate the exact
  // Zod-derived schemas once during catalog generation and deserialize them only when a
  // client lists tools. This preserves SDK registration and validation while
  // avoiding eager construction of the full generated schema graph.
  // See https://github.com/Dokploy/mcp/issues/32
  server.server.setRequestHandler(ListToolsRequestSchema, async () => {
    if (!toolList) {
      toolList = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: getInputSchema(tool),
        annotations: tool.annotations,
      }));
    }
    return { tools: toolList };
  });

  return server;
}
