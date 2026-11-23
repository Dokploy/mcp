import { describe, expect, it } from "vitest";
import { matchesSessionAuth, parseBearerAuthorization } from "./httpAuth.js";
import { getRequestAuth, runWithRequestAuth } from "./requestAuth.js";

describe("HTTP request authentication", () => {
  it("requires bearer credentials in per-client mode", () => {
    expect(parseBearerAuthorization(undefined, true)).toBeNull();
    expect(parseBearerAuthorization("Basic abc", true)).toBeNull();
    expect(parseBearerAuthorization("Bearer", true)).toBeNull();
  });

  it("binds MCP sessions to a timing-safe token fingerprint", () => {
    const first = parseBearerAuthorization("Bearer first-key", true);
    const same = parseBearerAuthorization("Bearer first-key", true);
    const other = parseBearerAuthorization("Bearer second-key", true);

    expect(first?.fingerprint).toBeInstanceOf(Buffer);
    expect(first?.fingerprint?.toString()).not.toContain("first-key");
    expect(matchesSessionAuth(first?.fingerprint, same?.fingerprint, true)).toBe(true);
    expect(matchesSessionAuth(first?.fingerprint, other?.fingerprint, true)).toBe(false);
    expect(matchesSessionAuth(undefined, other?.fingerprint, true)).toBe(false);
  });

  it("allows no caller token only when process mode was explicitly selected", () => {
    expect(parseBearerAuthorization(undefined, false)).toEqual({});
    expect(matchesSessionAuth(undefined, undefined, false)).toBe(true);
  });
});

describe("request-scoped credentials", () => {
  it("keeps concurrent MCP requests isolated", async () => {
    const first = runWithRequestAuth("first-key", "api-key", async () => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      return getRequestAuth();
    });
    const second = runWithRequestAuth("second-key", "oauth", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      return getRequestAuth();
    });

    await expect(Promise.all([first, second])).resolves.toEqual([
      { token: "first-key", mode: "api-key" },
      { token: "second-key", mode: "oauth" },
    ]);
    expect(getRequestAuth()).toBeUndefined();
  });
});
