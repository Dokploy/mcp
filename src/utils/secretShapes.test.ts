import { describe, expect, it } from "vitest";
import { redactSecretShapes, redactSecretShapesDeep, SHAPE_RULE_NAMES } from "./secretShapes.js";

describe("redactSecretShapes", () => {
  it("masks the password in a connection string but keeps the rest readable", () => {
    expect(redactSecretShapes("postgres://appuser:hunter2@db.internal:5432/payroll")).toBe(
      "postgres://appuser:[REDACTED]@db.internal:5432/payroll",
    );
  });

  it("handles a connection string without a user name", () => {
    expect(redactSecretShapes("redis://:hunter2@cache:6379")).toBe(
      "redis://:[REDACTED]@cache:6379",
    );
  });

  it("leaves a credential-free URL alone", () => {
    const text = "GET https://api.example.com:8443/v1/status?retry=3";
    expect(redactSecretShapes(text)).toBe(text);
  });

  it("masks an authorization header without losing the scheme", () => {
    expect(redactSecretShapes("Authorization: Bearer abc.def-ghi_jkl")).toBe(
      "Authorization: Bearer [REDACTED]",
    );
  });

  it("masks a whole PEM block", () => {
    const text = [
      "loading key",
      "-----BEGIN RSA PRIVATE KEY-----",
      "MIIEowIBAAKCAQEAxyz",
      "abcdefghijklmnop",
      "-----END RSA PRIVATE KEY-----",
      "done",
    ].join("\n");

    expect(redactSecretShapes(text)).toBe("loading key\n[REDACTED]\ndone");
  });

  it("masks a JWT", () => {
    const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dBjftJeZ4CVPmB92K27u";
    expect(redactSecretShapes(`token=${jwt}`)).toBe("token=[REDACTED]");
  });

  it("does not mistake base64-encoded JSON for a JWT", () => {
    // Base64 of a JSON document also starts with "eyJ", but has no dots.
    const encoded = "eyJuYW1lIjoiQGFmZmluZS9zZXJ2ZXIiLCJ2ZXJzaW9uIjoiMC4yNi43In0=";
    expect(redactSecretShapes(encoded)).toBe(encoded);
  });

  it("masks provider tokens", () => {
    expect(redactSecretShapes(`ghp_${"a".repeat(36)}`)).toBe("[REDACTED]");
    expect(redactSecretShapes(`github_pat_${"b".repeat(30)}`)).toBe("[REDACTED]");
    expect(redactSecretShapes(`glpat-${"c".repeat(20)}`)).toBe("[REDACTED]");
    expect(redactSecretShapes("AKIAIOSFODNN7EXAMPLE")).toBe("[REDACTED]");
    expect(redactSecretShapes(`sk-${"d".repeat(32)}`)).toBe("[REDACTED]");
    expect(redactSecretShapes(`xoxb-${"1".repeat(12)}`)).toBe("[REDACTED]");
    expect(redactSecretShapes(`sk_live_${"e".repeat(24)}`)).toBe("[REDACTED]");
  });

  it("masks a secret embedded in a longer log line", () => {
    const line = `2026-08-20T10:00:00Z INFO  pushing image, token=ghp_${"a".repeat(36)} ok`;
    expect(redactSecretShapes(line)).toBe(
      "2026-08-20T10:00:00Z INFO  pushing image, token=[REDACTED] ok",
    );
  });

  it("leaves ordinary log output untouched", () => {
    const log = [
      "2026-08-20T10:00:00Z INFO  server listening on port 3000",
      "2026-08-20T10:00:01Z WARN  slow query took 1200ms",
      "2026-08-20T10:00:02Z INFO  GET /health 200",
    ].join("\n");

    expect(redactSecretShapes(log)).toBe(log);
  });

  it("returns the identical string when nothing matches", () => {
    const text = "nothing to see here";
    expect(redactSecretShapes(text)).toBe(text);
  });

  it("is not affected by state left over from a previous call", () => {
    const token = `ghp_${"a".repeat(36)}`;
    expect(redactSecretShapes(token)).toBe("[REDACTED]");
    expect(redactSecretShapes(token)).toBe("[REDACTED]");
  });

  it("cannot see a password written as prose — documented limitation", () => {
    const line = "Connecting as admin with password hunter2";
    expect(redactSecretShapes(line)).toBe(line);
  });

  it("exposes a name for every rule", () => {
    expect(SHAPE_RULE_NAMES.length).toBeGreaterThan(0);
    expect(new Set(SHAPE_RULE_NAMES).size).toBe(SHAPE_RULE_NAMES.length);
  });
});

describe("redactSecretShapesDeep", () => {
  it("reaches strings nested in objects and arrays", () => {
    const response = {
      lines: ["ok", "db=postgres://u:secret@h/db"],
      meta: { count: 2, next: null },
    };

    expect(redactSecretShapesDeep(response)).toEqual({
      lines: ["ok", "db=postgres://u:[REDACTED]@h/db"],
      meta: { count: 2, next: null },
    });
  });

  it("does not hang on circular structures", () => {
    const data: Record<string, unknown> = { name: "a" };
    data.self = data;
    expect(() => redactSecretShapesDeep(data)).not.toThrow();
  });
});
