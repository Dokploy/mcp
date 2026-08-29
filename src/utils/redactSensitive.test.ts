import { describe, expect, it } from "vitest";
import {
  DEFAULT_REDACTED_FIELDS,
  redactSecretAssignments,
  redactSecretAssignmentsDeep,
  redactSensitive,
} from "./redactSensitive.js";

const redact = <T>(data: T) => redactSensitive(data, DEFAULT_REDACTED_FIELDS);
const redactText = (text: string) => redactSecretAssignments(text, DEFAULT_REDACTED_FIELDS);

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
      apps: [
        { name: "web", env: "[REDACTED]" },
        { config: { registryPassword: "[REDACTED]" } },
      ],
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

describe("redactSecretAssignments", () => {
  it("masks the value of secret-bearing assignments", () => {
    expect(redactText("DATABASE_PASSWORD=hunter2")).toBe("DATABASE_PASSWORD=[REDACTED]");
    expect(redactText("GITHUB_TOKEN=ghp_abc123")).toBe("GITHUB_TOKEN=[REDACTED]");
    expect(redactText("AWS_SECRET_ACCESS_KEY=abc/def")).toBe("AWS_SECRET_ACCESS_KEY=[REDACTED]");
  });

  it("masks screaming-snake keys whose word list names a secret", () => {
    // SECRET_KEY collapses to "secretkey", which ends in no listed suffix;
    // it is only caught by comparing the underscore-delimited words.
    expect(redactText("SECRET_KEY=django-insecure-abc")).toBe("SECRET_KEY=[REDACTED]");
    expect(redactText("APP_SECRET=abc")).toBe("APP_SECRET=[REDACTED]");
  });

  it("leaves harmless assignments readable", () => {
    const text = "PORT=3000\nNODE_VERSION=22\nCFLAGS=-O2\nLOG_LEVEL=debug\nDB_HOST=localhost";
    expect(redactText(text)).toBe(text);
  });

  it("masks only the secret lines of a mixed file", () => {
    const text = ["PORT=3000", "DB_PASSWORD=hunter2", "LOG_LEVEL=debug"].join("\n");
    expect(redactText(text)).toBe(
      ["PORT=3000", "DB_PASSWORD=[REDACTED]", "LOG_LEVEL=debug"].join("\n"),
    );
  });

  it("handles export-prefixed and indented assignments", () => {
    expect(redactText("  export API_TOKEN=abc")).toBe("  export API_TOKEN=[REDACTED]");
  });

  it("keeps spacing around the equals sign", () => {
    expect(redactText("CLIENT_SECRET = abc")).toBe("CLIENT_SECRET = [REDACTED]");
  });

  it("preserves windows line endings", () => {
    expect(redactText("DB_PASSWORD=hunter2\r\nPORT=3000\r\n")).toBe(
      "DB_PASSWORD=[REDACTED]\r\nPORT=3000\r\n",
    );
  });

  it("ignores commented-out assignments", () => {
    expect(redactText("# DB_PASSWORD=hunter2")).toBe("# DB_PASSWORD=hunter2");
  });

  it("ignores keys with no value", () => {
    expect(redactText("DB_PASSWORD=")).toBe("DB_PASSWORD=");
  });

  it("returns the identical string when nothing matches", () => {
    const text = "just some log output\nwith no assignments";
    expect(redactText(text)).toBe(text);
  });

  it("is inert when the field list is empty", () => {
    expect(redactSecretAssignments("DB_PASSWORD=hunter2", [])).toBe("DB_PASSWORD=hunter2");
  });
});

describe("redactSecretAssignmentsDeep", () => {
  it("reaches file contents wrapped in a neutrally named field", () => {
    const response = { path: "/app/config", content: "PORT=3000\nDB_PASSWORD=hunter2" };
    expect(redactSecretAssignmentsDeep(response, DEFAULT_REDACTED_FIELDS)).toEqual({
      path: "/app/config",
      content: "PORT=3000\nDB_PASSWORD=[REDACTED]",
    });
  });

  it("reaches a bare string response", () => {
    expect(redactSecretAssignmentsDeep("API_TOKEN=abc", DEFAULT_REDACTED_FIELDS)).toBe(
      "API_TOKEN=[REDACTED]",
    );
  });

  it("reaches strings nested in arrays", () => {
    const result = redactSecretAssignmentsDeep(
      { files: [{ body: "SECRET_KEY=abc" }] },
      DEFAULT_REDACTED_FIELDS,
    );
    expect(result).toEqual({ files: [{ body: "SECRET_KEY=[REDACTED]" }] });
  });

  it("leaves non-string values untouched", () => {
    const data = { size: 42, readable: true, missing: null };
    expect(redactSecretAssignmentsDeep(data, DEFAULT_REDACTED_FIELDS)).toEqual(data);
  });

  it("does not hang on circular structures", () => {
    const data: Record<string, unknown> = { name: "a" };
    data.self = data;
    expect(() => redactSecretAssignmentsDeep(data, DEFAULT_REDACTED_FIELDS)).not.toThrow();
  });
});
