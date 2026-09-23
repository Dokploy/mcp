import { timingSafeEqual } from "node:crypto";
import type { Context, MiddlewareHandler, Next } from "hono";

/**
 * Optional shared-secret gate for the HTTP/SSE transports. When `token`
 * is a non-empty string, the returned middleware requires callers to
 * present the token as *either*:
 *   - `Authorization: Bearer <token>` (preferred, RFC 6750-clean), or
 *   - `?token=<token>` query param
 *
 * The query-param path exists so this server works with MCP client UIs
 * that only accept a URL (Cowork's "Add custom connector" dialog, and
 * similar). The token is only visible to whoever already holds the URL,
 * and this process doesn't log request URLs — so the leakage vectors
 * RFC 6750 warns about (access logs, referer headers, browser history)
 * don't apply to this deployment shape. Prefer the header form when the
 * client supports it.
 *
 * When `token` is undefined or empty, the middleware is a no-op — this
 * preserves upstream Dokploy/mcp behavior so existing deployments aren't
 * locked out on upgrade.
 *
 * Comparisons use `timingSafeEqual` so a byte-by-byte early return
 * can't leak the token via response-time differences.
 */
export function makeAuthMiddleware(token: string | undefined): MiddlewareHandler {
  if (!token) {
    return async (_c: Context, next: Next) => next();
  }

  const expected = Buffer.from(token, "utf8");

  const matches = (presented: string): boolean => {
    const buf = Buffer.from(presented, "utf8");
    if (buf.length !== expected.length) return false;
    return timingSafeEqual(buf, expected);
  };

  return async (c: Context, next: Next) => {
    const header = c.req.header("authorization");
    if (typeof header === "string" && header.startsWith("Bearer ")) {
      if (matches(header.slice("Bearer ".length))) return next();
    }

    const queryToken = c.req.query("token");
    if (typeof queryToken === "string" && matches(queryToken)) {
      return next();
    }

    c.header("WWW-Authenticate", 'Bearer realm="dokploy-mcp"');
    return c.json(
      {
        jsonrpc: "2.0" as const,
        error: { code: -32001, message: "Unauthorized" },
        id: null,
      },
      401,
    );
  };
}
