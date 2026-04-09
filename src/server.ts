import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generatedTools } from "./generated/tools.js";
import { createHandler } from "./handler.js";

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "2.0.0",
  });

  for (const tool of generatedTools) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema.shape,
      tool.annotations ?? {},
      createHandler(tool),
    );
  }

  return server;
}
