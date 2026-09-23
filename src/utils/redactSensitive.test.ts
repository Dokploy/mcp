import { describe, expect, it } from "vitest";
import { DEFAULT_REDACTED_FIELDS, redactSensitive } from "./redactSensitive.js";

const redact = <T>(data: T) => redactSensitive(data, DEFAULT_REDACTED_FIELDS);

describe("redactSensitive", () => {
  it("redacts exact default field names", () => {
    const result = redact({ password: "hunter2", env: "KEY=value", apiKey: "sk-123" });
    expect(result).toEqual({ password: "[REDACTED]", env: "[REDACTED]", apiKey: "[REDACTED]" });
  });

  it("redacts provider-prefixed secret fields (issue #65)", () => {
    const result = redact({
      githubPrivateKey: "-----BEGIN RSA PRIVATE KEY-----",
      githubClientSecret: "ghs_abc",
      githubWebhookSecret: "whsec_abc",
      gitlabAccessToken: "glpat-abc",
      awsSecretAccessKey: "aws-abc",
    });
    expect(result).toEqual({
      githubPrivateKey: "[REDACTED]",
      githubClientSecret: "[REDACTED]",
      githubWebhookSecret: "[REDACTED]",
      gitlabAccessToken: "[REDACTED]",
      awsSecretAccessKey: "[REDACTED]",
    });
  });

  it("matches case-insensitively", () => {
    const result = redact({ PASSWORD: "x", GithubPrivateKey: "y" });
    expect(result).toEqual({ PASSWORD: "[REDACTED]", GithubPrivateKey: "[REDACTED]" });
  });

  it("preserves null and undefined values in sensitive fields", () => {
    const result = redact({ password: null, token: undefined });
    expect(result).toEqual({ password: null, token: undefined });
  });

  it("redacts inside nested objects and arrays", () => {
    const result = redact({
      apps: [{ name: "web", env: "SECRET=1" }, { config: { registryPassword: "p" } }],
    });
    expect(result).toEqual({
      apps: [{ name: "web", env: "[REDACTED]" }, { config: { registryPassword: "[REDACTED]" } }],
    });
  });

  it("leaves non-sensitive fields untouched", () => {
    const data = { appName: "web", domain: "example.com", port: 3000, https: true };
    expect(redact(data)).toEqual(data);
  });

  it("returns data unchanged when the field list is empty", () => {
    const data = { password: "visible" };
    expect(redactSensitive(data, [])).toBe(data);
  });

  it("supports custom field lists via suffix match", () => {
    const result = redactSensitive({ myCustomField: "x", other: "y" }, ["customField"]);
    expect(result).toEqual({ myCustomField: "[REDACTED]", other: "y" });
  });

  it("does not hang on circular structures", () => {
    const data: Record<string, unknown> = { name: "a" };
    data.self = data;
    expect(() => redact(data)).not.toThrow();
  });

  it("drops prototype-pollution keys", () => {
    const data = JSON.parse('{"__proto__": {"polluted": true}, "name": "safe"}');
    const result = redact(data) as Record<string, unknown>;
    expect(Object.keys(result)).toEqual(["name"]);
  });

  // Known, accepted collateral of suffix matching: flag-style keys that end in a
  // sensitive word (e.g. isSecret) are also redacted. Erring toward redaction is
  // intentional for security-sensitive output.
  it("redacts flag-like keys ending in a sensitive suffix", () => {
    const result = redact({ isSecret: true });
    expect(result).toEqual({ isSecret: "[REDACTED]" });
  });
});
