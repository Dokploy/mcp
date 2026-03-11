#!/usr/bin/env bun

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("MCP-Entry");

async function main() {
  // Check if running in HTTP mode
  const args = process.argv.slice(2);
  const httpMode =
    args.includes("--http") ||
    args.includes("--sse") ||
    process.env.MCP_TRANSPORT === "http" ||
    process.env.MCP_TRANSPORT === "sse";

  if (httpMode) {
    // Dynamic import to avoid loading Express dependencies when not needed
    const httpModule = await import("./http-server.js");
    if (typeof httpModule.main === "function") {
      return httpModule.main();
    } else {
      throw new Error("HTTP server module does not export main function");
    }
  }

  // Default: stdio mode
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("MCP Dokploy CLI server running via stdio");
}

main().catch((error) => {
  logger.error("Fatal error occurred", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
