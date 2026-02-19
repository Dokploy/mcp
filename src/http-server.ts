#!/usr/bin/env node

import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import express from "express";
import { randomUUID } from "node:crypto";
import { createServer } from "./server.js";
import { createLogger } from "./utils/logger.js";

// Container always uses port 3000 internally
const PORT = 3000;
const logger = createLogger("MCP-HTTP-Server");

export async function main() {
  const app = express();

  app.use(express.json());

  // Store active transports by session ID for different transport types
  const transports = {
    streamable: {} as Record<string, StreamableHTTPServerTransport>,
    sse: {} as Record<string, SSEServerTransport>,
  };

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Modern Streamable HTTP endpoint for POST requests (client-to-server)
  app.post("/mcp", async (req, res) => {
    try {
      // Check for existing session ID
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports.streamable[sessionId]) {
        // Reuse existing transport
        transport = transports.streamable[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID
            transports.streamable[sessionId] = transport;
            logger.info("New MCP session initialized", { sessionId });
          },
        });

        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            logger.info("MCP session closed", {
              sessionId: transport.sessionId,
            });
            delete transports.streamable[transport.sessionId];
          }
        };

        // Create and connect server first
        const server = createServer();
        // The transport will have sessionId after initialization
        await server.connect(
          transport as unknown as Parameters<typeof server.connect>[0]
        );

        // Log after successful connection
        logger.info("New MCP session server connected", {
          sessionId: transport.sessionId,
        });
      } else {
        // Invalid request
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message:
              "Bad Request: No valid session ID provided for existing session or invalid initialization request",
          },
          id: null,
        });
        return;
      }

      // Handle the request
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      logger.error("Error handling HTTP request", {
        error: error instanceof Error ? error.message : String(error),
        sessionId: req.headers["mcp-session-id"],
      });
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }
    }
  });

  // Reusable handler for GET and DELETE requests (Streamable HTTP)
  const handleSessionRequest = async (
    req: express.Request,
    res: express.Response
  ) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (!sessionId || !transports.streamable[sessionId]) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Invalid or missing session ID",
        },
        id: null,
      });
      return;
    }

    try {
      const transport = transports.streamable[sessionId];
      await transport.handleRequest(req, res);
    } catch (error) {
      logger.error("Error handling session request", {
        error: error instanceof Error ? error.message : String(error),
        sessionId,
        method: req.method,
      });
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }
    }
  };

  // Handle GET requests for server-to-client notifications via SSE
  app.get("/mcp", handleSessionRequest);

  // Handle DELETE requests for session termination
  app.delete("/mcp", async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (!sessionId || !transports.streamable[sessionId]) {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Invalid or missing session ID",
        },
        id: null,
      });
      return;
    }

    try {
      const transport = transports.streamable[sessionId];
      await transport.handleRequest(req, res);

      // Clean up after session termination
      if (transports.streamable[sessionId]) {
        logger.info("MCP session terminated", { sessionId });
        delete transports.streamable[sessionId];
      }
    } catch (error) {
      logger.error("Error handling DELETE request", {
        error: error instanceof Error ? error.message : String(error),
        sessionId,
      });
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }
    }
  });

  // Legacy SSE endpoint for older clients (protocol version 2024-11-05)
  app.get("/sse", async (_req, res) => {
    try {
      // Create SSE transport for legacy clients
      const transport = new SSEServerTransport("/messages", res);
      transports.sse[transport.sessionId] = transport;

      res.on("close", () => {
        logger.info("Legacy SSE session closed", {
          sessionId: transport.sessionId,
        });
        delete transports.sse[transport.sessionId];
      });

      // Create and connect server for this transport
      const server = createServer();
      await server.connect(transport);

      logger.info("New legacy SSE session initialized", {
        sessionId: transport.sessionId,
      });
    } catch (error) {
      logger.error("Error handling SSE request", {
        error: error instanceof Error ? error.message : String(error),
      });
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }
    }
  });

  // Legacy message endpoint for older clients
  app.post("/messages", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;

      if (!sessionId) {
        logger.warn("No sessionId provided in message request");
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "sessionId query parameter is required",
          },
          id: null,
        });
        return;
      }

      const transport = transports.sse[sessionId];
      if (!transport) {
        logger.warn("No SSE transport found for sessionId", { sessionId });
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "No transport found for sessionId",
          },
          id: null,
        });
        return;
      }

      await transport.handlePostMessage(req, res, req.body);
    } catch (error) {
      logger.error("Error handling legacy message request", {
        error: error instanceof Error ? error.message : String(error),
        sessionId: req.query.sessionId,
      });
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }
    }
  });

  // Start the server
  app.listen(PORT, () => {
    logger.info("MCP Dokploy server started", {
      port: PORT,
      protocols: [
        "Streamable HTTP (MCP 2025-03-26)",
        "Legacy SSE (MCP 2024-11-05)",
      ],
      endpoints: {
        modern: {
          mcp: `http://localhost:${PORT}/mcp`,
          health: `http://localhost:${PORT}/health`,
        },
        legacy: {
          sse: `http://localhost:${PORT}/sse`,
          messages: `http://localhost:${PORT}/messages`,
        },
      },
    });
  });
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error("Fatal error occurred", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  });
}
