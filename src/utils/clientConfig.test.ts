import { describe, expect, it } from "vitest";
import { parseCustomHeaders } from "./clientConfig.js";

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
