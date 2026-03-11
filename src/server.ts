import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as api from "./mcp/tools/api.js";
import * as apiSchema from "./mcp/tools/apiSchema.js";

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "1.0.0",
  });

  server.tool(
    api.name,
    api.description,
    api.schema,
    api.annotations,
    api.handler
  );

  server.tool(
    apiSchema.name,
    apiSchema.description,
    apiSchema.schema,
    apiSchema.annotations,
    apiSchema.handler
  );

  return server;
}
