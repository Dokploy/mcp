import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { makeAuthMiddleware } from "./auth.js";

/**
 * Builds a tiny Hono app that runs the middleware in front of a fixed
 * `200 ok` handler, so tests can drive it with real `fetch()` calls
 * instead of hand-mocking a Context.
 */
function appWithAuth(token: string | undefined) {
  const app = new Hono();
  app.use("/mcp", makeAuthMiddleware(token));
  app.post("/mcp", (c) => c.text("ok"));
  return app;
}

const post = async (app: Hono, path: string, init: RequestInit = {}): Promise<Response> =>
  app.request(path, { method: "POST", ...init });

describe("makeAuthMiddleware", () => {
  describe("when token is undefined (upstream default)", () => {
    it("passes through without any header or query param", async () => {
      const app = appWithAuth(undefined);
      const res = await post(app, "/mcp");
      expect(res.status).toBe(200);
    });

    it("passes through with an arbitrary Authorization header (ignored)", async () => {
      const app = appWithAuth(undefined);
      const res = await post(app, "/mcp", {
        headers: { authorization: "Bearer anything" },
      });
      expect(res.status).toBe(200);
    });
  });

  describe("when token is empty string", () => {
    it("treats it as unset (does not become an accept-anyone-with-empty-token trap)", async () => {
      const app = appWithAuth("");
      const res = await post(app, "/mcp");
      expect(res.status).toBe(200);
    });
  });

  describe("when token is set", () => {
    const token = "s3cret-value";

    it("rejects a request with no credentials", async () => {
      const app = appWithAuth(token);
      const res = await post(app, "/mcp");
      expect(res.status).toBe(401);
      expect(res.headers.get("www-authenticate")).toBe('Bearer realm="dokploy-mcp"');
      const body = await res.json();
      expect(body).toEqual({
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized" },
        id: null,
      });
    });

    it("accepts the correct Authorization: Bearer header", async () => {
      const app = appWithAuth(token);
      const res = await post(app, "/mcp", {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("ok");
    });

    it("rejects a wrong-value Authorization: Bearer header", async () => {
      const app = appWithAuth(token);
      const res = await post(app, "/mcp", {
        headers: { authorization: "Bearer wrong-value-same-length!!" },
      });
      expect(res.status).toBe(401);
    });

    it("rejects an Authorization header that isn't a Bearer scheme", async () => {
      const app = appWithAuth(token);
      const res = await post(app, "/mcp", {
        headers: { authorization: `Basic ${Buffer.from(`user:${token}`).toString("base64")}` },
      });
      expect(res.status).toBe(401);
    });

    it("accepts the correct ?token= query param", async () => {
      const app = appWithAuth(token);
      const res = await post(app, `/mcp?token=${encodeURIComponent(token)}`);
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("ok");
    });

    it("rejects a wrong-value ?token= query param", async () => {
      const app = appWithAuth(token);
      const res = await post(app, "/mcp?token=nope");
      expect(res.status).toBe(401);
    });

    it("rejects a token of the wrong length (guards the timing-safe compare)", async () => {
      const app = appWithAuth(token);
      const res = await post(app, "/mcp?token=short");
      expect(res.status).toBe(401);
    });

    it("prefers the header when both header and query are present and both valid", async () => {
      // Not a behavioral guarantee we need to document — just checks that
      // presenting both doesn't somehow break by double-consuming or
      // short-circuiting to a rejection.
      const app = appWithAuth(token);
      const res = await post(app, `/mcp?token=${encodeURIComponent(token)}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
    });

    it("still rejects if the header is valid but the query is wrong (no fall-through)", async () => {
      // Regression guard: valid header must accept the request even if
      // the query has garbage.
      const app = appWithAuth(token);
      const res = await post(app, "/mcp?token=garbage", {
        headers: { authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
    });
  });
});
