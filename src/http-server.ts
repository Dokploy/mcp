#!/usr/bin/env node

import { randomUUID, timingSafeEqual } from "node:crypto";
import type { HttpBindings } from "@hono/node-server";
import { serve } from "@hono/node-server";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { Hono, type Context, type Next } from "hono";
import { createServer } from "./server.js";
import { createLogger } from "./utils/logger.js";

const PORT = 3000;
const logger = createLogger("MCP-HTTP-Server");

const jsonrpcError = (code: number, message: string) => ({
  jsonrpc: "2.0" as const,
  error: { code, message },
  id: null,
});

/**
 * Optional shared-secret gate on the MCP endpoints. When MCP_AUTH_TOKEN is
 * set, callers must present the token as *either*:
 *   - `Authorization: Bearer <token>` (preferred, RFC 6750-clean), or
 *   - `?token=<token>` query param
 *
 * The query-param path exists so this server works with MCP client UIs that
 * only let you paste a URL (Cowork's "Add custom connector" dialog, and
 * similar). Those UIs can't attach a custom header. The token only travels
 * over the URL between the client and this process; this server doesn't
 * log request URLs, so the leakage vectors RFC 6750 warns about (access
 * logs, referer headers, browser history) don't apply to this shape.
 *
 * When MCP_AUTH_TOKEN is unset, the endpoints are open — matches the
 * upstream Dokploy/mcp behavior so upgrading doesn't lock existing
 * deployments out. A startup warning is logged in that case.
 */
const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
const MCP_AUTH_TOKEN_BUF = MCP_AUTH_TOKEN
  ? Buffer.from(MCP_AUTH_TOKEN, "utf8")
  : null;

function tokensMatch(presented: string): boolean {
  if (!MCP_AUTH_TOKEN_BUF) return true;
  const buf = Buffer.from(presented, "utf8");
  if (buf.length !== MCP_AUTH_TOKEN_BUF.length) return false;
  return timingSafeEqual(buf, MCP_AUTH_TOKEN_BUF);
}

async function requireAuth(c: Context, next: Next) {
  if (!MCP_AUTH_TOKEN_BUF) return next();

  const header = c.req.header("authorization");
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    if (tokensMatch(header.slice("Bearer ".length))) return next();
  }

  const queryToken = c.req.query("token");
  if (typeof queryToken === "string" && tokensMatch(queryToken)) {
    return next();
  }

  c.header("WWW-Authenticate", 'Bearer realm="dokploy-mcp"');
  return c.json(jsonrpcError(-32001, "Unauthorized"), 401);
}

// When MCP transport takes over the raw Node response, we must prevent
// Hono/@hono/node-server from trying to write its own response headers.
// We return a Promise that NEVER resolves — the underlying Node response
// is already being handled by the MCP transport, so Hono must not touch it.
function neverResolve(): Promise<never> {
  return new Promise(() => {});
}

export async function main() {
  const app = new Hono<{ Bindings: HttpBindings }>();

  const transports = {
    streamable: {} as Record<string, StreamableHTTPServerTransport>,
    sse: {} as Record<string, SSEServerTransport>,
  };

  // Health check — intentionally left open so orchestrators (Docker,
  // Traefik, k8s) can probe without a token.
  app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

  // Gate every MCP transport endpoint behind the optional shared-secret
  // check. `/health` above is deliberately registered before this line so
  // probes stay open.
  app.use("/mcp", requireAuth);
  app.use("/sse", requireAuth);
  app.use("/messages", requireAuth);

  // Modern Streamable HTTP - POST
  app.post("/mcp", async (c) => {
    const { incoming, outgoing } = c.env;
    try {
      const sessionId = c.req.header("mcp-session-id");
      let transport: StreamableHTTPServerTransport;
      const body = await c.req.json();

      if (sessionId && transports.streamable[sessionId]) {
        transport = transports.streamable[sessionId];
      } else if (!sessionId && isInitializeRequest(body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid) => {
            transports.streamable[sid] = transport;
            logger.info("New MCP session initialized", { sessionId: sid });
          },
        });

        transport.onclose = () => {
          if (transport.sessionId) {
            logger.info("MCP session closed", { sessionId: transport.sessionId });
            delete transports.streamable[transport.sessionId];
          }
        };

        const server = createServer();
        await server.connect(
          transport as unknown as import("@modelcontextprotocol/sdk/shared/transport.js").Transport,
        );
      } else {
        return c.json(
          jsonrpcError(
            -32000,
            "Bad Request: No valid session ID or invalid initialization request",
          ),
          400,
        );
      }

      await transport.handleRequest(incoming, outgoing, body);
      return neverResolve();
    } catch (error) {
      logger.error("Error handling HTTP request", {
        error: error instanceof Error ? error.message : String(error),
      });
      return c.json(jsonrpcError(-32603, "Internal server error"), 500);
    }
  });

  // Modern Streamable HTTP - GET (SSE notifications)
  app.get("/mcp", async (c) => {
    const { incoming, outgoing } = c.env;
    const sessionId = c.req.header("mcp-session-id");

    if (!sessionId || !transports.streamable[sessionId]) {
      return c.json(jsonrpcError(-32000, "Invalid or missing session ID"), 400);
    }

    try {
      const transport = transports.streamable[sessionId];
      await transport.handleRequest(incoming, outgoing);
      return neverResolve();
    } catch (error) {
      logger.error("Error handling GET request", {
        error: error instanceof Error ? error.message : String(error),
      });
      return c.json(jsonrpcError(-32603, "Internal server error"), 500);
    }
  });

  // Modern Streamable HTTP - DELETE (session termination)
  app.delete("/mcp", async (c) => {
    const { incoming, outgoing } = c.env;
    const sessionId = c.req.header("mcp-session-id");

    if (!sessionId || !transports.streamable[sessionId]) {
      return c.json(jsonrpcError(-32000, "Invalid or missing session ID"), 400);
    }

    try {
      const transport = transports.streamable[sessionId];
      await transport.handleRequest(incoming, outgoing);

      if (transports.streamable[sessionId]) {
        logger.info("MCP session terminated", { sessionId });
        delete transports.streamable[sessionId];
      }
      return neverResolve();
    } catch (error) {
      logger.error("Error handling DELETE request", {
        error: error instanceof Error ? error.message : String(error),
      });
      return c.json(jsonrpcError(-32603, "Internal server error"), 500);
    }
  });

  // Legacy SSE endpoint
  app.get("/sse", async (c) => {
    const { outgoing } = c.env;
    try {
      const transport = new SSEServerTransport("/messages", outgoing);
      transports.sse[transport.sessionId] = transport;

      outgoing.on("close", () => {
        logger.info("Legacy SSE session closed", { sessionId: transport.sessionId });
        delete transports.sse[transport.sessionId];
      });

      const server = createServer();
      await server.connect(transport);
      logger.info("New legacy SSE session initialized", { sessionId: transport.sessionId });
      return neverResolve();
    } catch (error) {
      logger.error("Error handling SSE request", {
        error: error instanceof Error ? error.message : String(error),
      });
      return c.json(jsonrpcError(-32603, "Internal server error"), 500);
    }
  });

  // Legacy message endpoint
  app.post("/messages", async (c) => {
    const { incoming, outgoing } = c.env;
    try {
      const sessionId = c.req.query("sessionId");
      if (!sessionId) {
        return c.json(jsonrpcError(-32000, "sessionId query parameter is required"), 400);
      }

      const transport = transports.sse[sessionId];
      if (!transport) {
        return c.json(jsonrpcError(-32000, "No transport found for sessionId"), 400);
      }

      const body = await c.req.json();
      await transport.handlePostMessage(incoming, outgoing, body);
      return neverResolve();
    } catch (error) {
      logger.error("Error handling legacy message request", {
        error: error instanceof Error ? error.message : String(error),
      });
      return c.json(jsonrpcError(-32603, "Internal server error"), 500);
    }
  });

  serve({ fetch: app.fetch, port: PORT }, () => {
    logger.info("MCP Dokploy server started", {
      port: PORT,
      protocols: ["Streamable HTTP (MCP 2025-03-26)", "Legacy SSE (MCP 2024-11-05)"],
      endpoints: {
        modern: `http://localhost:${PORT}/mcp`,
        legacy: `http://localhost:${PORT}/sse`,
        health: `http://localhost:${PORT}/health`,
      },
      auth: MCP_AUTH_TOKEN_BUF ? "bearer token required" : "open (MCP_AUTH_TOKEN unset)",
    });
    if (!MCP_AUTH_TOKEN_BUF) {
      logger.warn(
        "MCP_AUTH_TOKEN is not set — MCP endpoints are open to anyone who can reach this port. " +
          "Set MCP_AUTH_TOKEN or restrict access at the proxy layer before exposing publicly.",
      );
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error("Fatal error occurred", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  });
}
