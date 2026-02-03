import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { allTools } from "./mcp/tools/index.js";

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "1.0.0",
  });

  for (const tool of allTools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.schema.shape,
        ...(tool.outputSchema && { outputSchema: tool.outputSchema.shape }),
        ...(tool.annotations && { annotations: tool.annotations }),
      },
      tool.handler
    );
  }

  return server;
}
