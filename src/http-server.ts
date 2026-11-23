#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import type { HttpBindings } from "@hono/node-server";
import { serve } from "@hono/node-server";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { type Context, Hono } from "hono";
import { createServer } from "./server.js";
import { verifyRequestApiKey, verifyRequestOAuthToken } from "./utils/apiClient.js";
import { getClientConfig } from "./utils/clientConfig.js";
import { matchesSessionAuth, parseBearerAuthorization } from "./utils/httpAuth.js";
import { createLogger } from "./utils/logger.js";
import { runWithRequestAuth } from "./utils/requestAuth.js";

const PORT = 3000;
const logger = createLogger("MCP-HTTP-Server");
const requestAuthMode = getClientConfig().authMode;
const requestScopedAuth = requestAuthMode === "api-key" || requestAuthMode === "oauth";

interface AuthenticatedSession<T> {
  transport: T;
  authFingerprint?: Buffer;
}

function withCallerAuth<T>(token: string | undefined, callback: () => T): T {
  return token && requestScopedAuth
    ? runWithRequestAuth(token, requestAuthMode as "api-key" | "oauth", callback)
    : callback();
}

function unauthorized() {
  return {
    jsonrpc: "2.0" as const,
    error: {
      code: -32001,
      message: "Unauthorized: complete OAuth authorization or provide a valid bearer token",
    },
    id: null,
  };
}

async function authenticateRequest(authorization: string | undefined) {
  const auth = parseBearerAuthorization(authorization, requestScopedAuth);
  if (!auth) return null;
  if (auth.token) {
    try {
      if (requestAuthMode === "oauth") {
        const payload = auth.token.split(".")[1];
        if (!payload) return null;
        const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
          aud?: string | string[];
        };
        const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
        if (!audiences.includes(getClientConfig().mcpResourceUrl)) return null;
        await verifyRequestOAuthToken(auth.token);
      } else await verifyRequestApiKey(auth.token);
    } catch {
      return null;
    }
  }
  return auth;
}

const jsonrpcError = (code: number, message: string) => ({
  jsonrpc: "2.0" as const,
  error: { code, message },
  id: null,
});

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
    streamable: {} as Record<string, AuthenticatedSession<StreamableHTTPServerTransport>>,
    sse: {} as Record<string, AuthenticatedSession<SSEServerTransport>>,
  };

  // Health check
  app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

  // OAuth protected resource metadata used by any MCP-compatible client.
  const protectedResourceMetadata = (c: Context<{ Bindings: HttpBindings }>) => {
    const resource = getClientConfig().mcpResourceUrl;
    const authorizationServer = `${getClientConfig().dokployUrl.replace(/\/+$/, "")}/api/auth`;
    return c.json({
      resource,
      authorization_servers: [authorizationServer],
      bearer_methods_supported: ["header"],
      scopes_supported: ["dokploy"],
    });
  };
  app.get("/.well-known/oauth-protected-resource", protectedResourceMetadata);
  app.get("/.well-known/oauth-protected-resource/mcp", protectedResourceMetadata);

  const setOAuthChallenge = (c: Context<{ Bindings: HttpBindings }>) => {
    const resourceUrl = getClientConfig().mcpResourceUrl as string;
    const metadataUrl = new URL(
      "/.well-known/oauth-protected-resource/mcp",
      resourceUrl,
    ).toString();
    c.header("WWW-Authenticate", `Bearer resource_metadata="${metadataUrl}", scope="dokploy"`);
  };

  // Modern Streamable HTTP - POST
  app.post("/mcp", async (c) => {
    const { incoming, outgoing } = c.env;
    const callerAuth = await authenticateRequest(c.req.header("authorization"));
    if (!callerAuth) {
      setOAuthChallenge(c);
      return c.json(unauthorized(), 401);
    }
    try {
      const sessionId = c.req.header("mcp-session-id");
      const session = sessionId ? transports.streamable[sessionId] : undefined;
      if (
        sessionId &&
        (!session ||
          !matchesSessionAuth(session.authFingerprint, callerAuth.fingerprint, requestScopedAuth))
      ) {
        setOAuthChallenge(c);
        return c.json(unauthorized(), 401);
      }
      let transport: StreamableHTTPServerTransport;
      const body = await c.req.json();

      if (sessionId && session) {
        transport = session.transport;
      } else if (!sessionId && isInitializeRequest(body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid) => {
            transports.streamable[sid] = {
              transport,
              ...(callerAuth.fingerprint ? { authFingerprint: callerAuth.fingerprint } : {}),
            };
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

      await withCallerAuth(callerAuth.token, () =>
        transport.handleRequest(incoming, outgoing, body),
      );
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
    const callerAuth = await authenticateRequest(c.req.header("authorization"));
    if (!callerAuth) {
      setOAuthChallenge(c);
      return c.json(unauthorized(), 401);
    }

    const session = sessionId ? transports.streamable[sessionId] : undefined;
    if (!sessionId || !session) {
      return c.json(jsonrpcError(-32000, "Invalid or missing session ID"), 400);
    }
    if (!matchesSessionAuth(session.authFingerprint, callerAuth.fingerprint, requestScopedAuth)) {
      setOAuthChallenge(c);
      return c.json(unauthorized(), 401);
    }

    try {
      await withCallerAuth(callerAuth.token, () =>
        session.transport.handleRequest(incoming, outgoing),
      );
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
    const callerAuth = await authenticateRequest(c.req.header("authorization"));
    if (!callerAuth) {
      setOAuthChallenge(c);
      return c.json(unauthorized(), 401);
    }

    const session = sessionId ? transports.streamable[sessionId] : undefined;
    if (!sessionId || !session) {
      return c.json(jsonrpcError(-32000, "Invalid or missing session ID"), 400);
    }
    if (!matchesSessionAuth(session.authFingerprint, callerAuth.fingerprint, requestScopedAuth)) {
      setOAuthChallenge(c);
      return c.json(unauthorized(), 401);
    }

    try {
      await withCallerAuth(callerAuth.token, () =>
        session.transport.handleRequest(incoming, outgoing),
      );

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
    const callerAuth = await authenticateRequest(c.req.header("authorization"));
    if (!callerAuth) {
      setOAuthChallenge(c);
      return c.json(unauthorized(), 401);
    }
    try {
      const transport = new SSEServerTransport("/messages", outgoing);
      transports.sse[transport.sessionId] = {
        transport,
        ...(callerAuth.fingerprint ? { authFingerprint: callerAuth.fingerprint } : {}),
      };

      outgoing.on("close", () => {
        logger.info("Legacy SSE session closed", { sessionId: transport.sessionId });
        delete transports.sse[transport.sessionId];
      });

      const server = createServer();
      await withCallerAuth(callerAuth.token, () => server.connect(transport));
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
    const callerAuth = await authenticateRequest(c.req.header("authorization"));
    if (!callerAuth) {
      setOAuthChallenge(c);
      return c.json(unauthorized(), 401);
    }
    try {
      const sessionId = c.req.query("sessionId");
      if (!sessionId) {
        return c.json(jsonrpcError(-32000, "sessionId query parameter is required"), 400);
      }

      const session = transports.sse[sessionId];
      if (!session) {
        return c.json(jsonrpcError(-32000, "No transport found for sessionId"), 400);
      }
      if (!matchesSessionAuth(session.authFingerprint, callerAuth.fingerprint, requestScopedAuth)) {
        setOAuthChallenge(c);
        return c.json(unauthorized(), 401);
      }

      const body = await c.req.json();
      await withCallerAuth(callerAuth.token, () =>
        session.transport.handlePostMessage(incoming, outgoing, body),
      );
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
    });
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
