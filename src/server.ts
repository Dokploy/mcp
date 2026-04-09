import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generatedTools } from "./generated/tools.js";
import { createHandler } from "./handler.js";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("MCP-Server");

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

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "2.0.0",
  });

  const tools = getEnabledTools();

  for (const tool of tools) {
    server.tool(tool.name, tool.description, tool.schema.shape, tool.annotations ?? {}, createHandler(tool));
  }

  return server;
}
