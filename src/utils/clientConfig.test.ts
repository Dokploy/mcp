import { describe, expect, it } from "vitest";
import { parseCustomHeaders, resolveList } from "./clientConfig.js";

describe("parseCustomHeaders", () => {
  it("returns no custom headers when unset", () => {
    expect(parseCustomHeaders(undefined)).toEqual({});
  });

  it("accepts Cloudflare Access-style headers", () => {
    const headers = parseCustomHeaders(
      JSON.stringify({
        "CF-Access-Client-Id": "client-id-placeholder",
        "CF-Access-Client-Secret": "client-secret-placeholder",
      }),
    );

    expect(headers).toEqual({
      "CF-Access-Client-Id": "client-id-placeholder",
      "CF-Access-Client-Secret": "client-secret-placeholder",
    });
  });

  it("rejects malformed JSON", () => {
    expect(() => parseCustomHeaders("not-json")).toThrow(/must be valid JSON/);
  });

  it("rejects an empty string when configured", () => {
    expect(() => parseCustomHeaders("")).toThrow(/must be valid JSON/);
  });

  it("rejects arrays", () => {
    expect(() => parseCustomHeaders("[]")).toThrow(/must be a JSON object/);
  });

  it("rejects non-object JSON", () => {
    expect(() => parseCustomHeaders('"header-value"')).toThrow(/must be a JSON object/);
  });

  it("rejects non-string values", () => {
    expect(() => parseCustomHeaders(JSON.stringify({ "X-Custom-Header": 123 }))).toThrow(
      /only string header values/,
    );
  });

  it("rejects empty header names", () => {
    expect(() => parseCustomHeaders(JSON.stringify({ "": "value" }))).toThrow(/empty header name/);
  });

  it("rejects reserved header names case-insensitively", () => {
    expect(() => parseCustomHeaders(JSON.stringify({ "X-API-Key": "override" }))).toThrow(
      /cannot override reserved header/,
    );
    expect(() => parseCustomHeaders(JSON.stringify({ "Content-Type": "text/plain" }))).toThrow(
      /cannot override reserved header/,
    );
    expect(() => parseCustomHeaders(JSON.stringify({ ACCEPT: "text/plain" }))).toThrow(
      /cannot override reserved header/,
    );
  });
});

describe("resolveList", () => {
  const NAMES = { override: "DOKPLOY_THING", extra: "DOKPLOY_EXTRA_THING" };
  const DEFAULTS = ["alpha", "beta"];
  const resolve = (override?: string, extra?: string) =>
    resolveList(NAMES, override, extra, DEFAULTS);

  it("returns the defaults when neither variable is set", () => {
    expect(resolve()).toEqual(DEFAULTS);
  });

  it("adds to the defaults instead of replacing them", () => {
    expect(resolve(undefined, "gamma")).toEqual(["alpha", "beta", "gamma"]);
  });

  it("replaces the defaults when the override is set", () => {
    expect(resolve("gamma")).toEqual(["gamma"]);
  });

  it("adds to an explicit override as well", () => {
    expect(resolve("gamma", "delta")).toEqual(["gamma", "delta"]);
  });

  it("ignores blank entries and surrounding whitespace", () => {
    expect(resolve(undefined, " gamma , , delta ")).toEqual(["alpha", "beta", "gamma", "delta"]);
  });

  it("does not duplicate an addition that is already a default", () => {
    expect(resolve(undefined, "beta,gamma")).toEqual(["alpha", "beta", "gamma"]);
  });

  it("treats an empty override as unset rather than as an empty list", () => {
    expect(resolve("")).toEqual(DEFAULTS);
    expect(resolve("  ,  ")).toEqual(DEFAULTS);
  });
});

describe("getClientConfig", () => {
  it("enables response redaction by default", async () => {
    process.env.DOKPLOY_URL = "https://example.com";
    process.env.DOKPLOY_API_KEY = "test-key";
    delete process.env.DOKPLOY_REDACT_ENV;

    const { getClientConfig } = await import("./clientConfig.js");
    const config = getClientConfig();

    expect(config.redactEnv).toBe(true);
    expect(config.redactFields.length).toBeGreaterThan(0);
  });
});
