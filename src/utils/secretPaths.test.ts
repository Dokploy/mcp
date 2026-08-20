import { describe, expect, it } from "vitest";
import {
  DEFAULT_SECRET_PATH_PATTERNS,
  getGuardedPath,
  globToRegExp,
  isSensitivePath,
  normalizePath,
} from "./secretPaths.js";

const isSensitive = (path: string) => isSensitivePath(path, DEFAULT_SECRET_PATH_PATTERNS);

describe("normalizePath", () => {
  it("collapses traversal segments", () => {
    expect(normalizePath("/app/../app/.env")).toBe("/app/.env");
    expect(normalizePath("/app/./config/../.env")).toBe("/app/.env");
  });

  it("collapses repeated and trailing separators", () => {
    expect(normalizePath("/app//logs///error.log")).toBe("/app/logs/error.log");
    expect(normalizePath("/app/logs/")).toBe("/app/logs");
  });

  it("normalizes backslashes to forward slashes", () => {
    expect(normalizePath("C:\\app\\.env")).toBe("C:/app/.env");
  });

  it("preserves whether the path is absolute", () => {
    expect(normalizePath("app/.env")).toBe("app/.env");
    expect(normalizePath("/app/.env")).toBe("/app/.env");
  });

  it("does not escape above the root", () => {
    expect(normalizePath("/../../etc/passwd")).toBe("/etc/passwd");
  });
});

describe("globToRegExp", () => {
  it("does not let a single star cross a separator", () => {
    expect(globToRegExp("*.env").test("prod.env")).toBe(true);
    expect(globToRegExp("*.env").test("app/prod.env")).toBe(false);
  });

  it("lets a double star cross separators", () => {
    expect(globToRegExp("/run/secrets/**").test("/run/secrets/db/password")).toBe(true);
  });

  it("treats a leading double-star segment as optional", () => {
    expect(globToRegExp("**/.ssh/**").test(".ssh/id_rsa")).toBe(true);
    expect(globToRegExp("**/.ssh/**").test("/home/app/.ssh/id_rsa")).toBe(true);
  });

  it("escapes regex metacharacters in the literal parts", () => {
    expect(globToRegExp("file.txt").test("fileXtxt")).toBe(false);
  });
});

describe("isSensitivePath", () => {
  it("blocks dotenv files in any directory", () => {
    expect(isSensitive("/app/.env")).toBe(true);
    expect(isSensitive("/srv/deep/nested/.env")).toBe(true);
    expect(isSensitive(".env")).toBe(true);
  });

  it("blocks suffixed and prefixed dotenv variants", () => {
    expect(isSensitive("/app/.env.production")).toBe(true);
    expect(isSensitive("/app/staging.env")).toBe(true);
  });

  it("blocks docker and swarm secret mounts", () => {
    expect(isSensitive("/run/secrets/db_password")).toBe(true);
    expect(isSensitive("/var/lib/secrets/token")).toBe(true);
  });

  it("blocks private keys and credential stores", () => {
    expect(isSensitive("/certs/server.pem")).toBe(true);
    expect(isSensitive("/certs/server.key")).toBe(true);
    expect(isSensitive("/root/.ssh/id_rsa")).toBe(true);
    expect(isSensitive("/root/.npmrc")).toBe(true);
    expect(isSensitive("/root/.aws/credentials")).toBe(true);
    expect(isSensitive("/root/.docker/config.json")).toBe(true);
  });

  it("blocks traversal attempts that resolve onto a secret", () => {
    expect(isSensitive("/app/logs/../.env")).toBe(true);
    expect(isSensitive("/app/../../app/.env")).toBe(true);
  });

  it("blocks percent-encoded attempts", () => {
    expect(isSensitive("/app/%2Eenv")).toBe(true);
  });

  it("leaves ordinary application files alone", () => {
    expect(isSensitive("/app/logs/error.log")).toBe(false);
    expect(isSensitive("/app/package.json")).toBe(false);
    expect(isSensitive("/etc/nginx/nginx.conf")).toBe(false);
    expect(isSensitive("/app/src/environment.ts")).toBe(false);
  });

  it("does not block a directory that merely contains secrets", () => {
    expect(isSensitive("/app")).toBe(false);
  });

  it("is inert when the pattern list is empty", () => {
    expect(isSensitivePath("/app/.env", [])).toBe(false);
  });

  it("supports a custom pattern list", () => {
    expect(isSensitivePath("/app/private.conf", ["private.conf"])).toBe(true);
    expect(isSensitivePath("/app/.env", ["private.conf"])).toBe(false);
  });
});

describe("getGuardedPath", () => {
  it("returns the path argument of file-access tools", () => {
    expect(getGuardedPath({ containerId: "abc", path: "/app/.env" })).toBe("/app/.env");
  });

  it("returns null for tools without a path argument", () => {
    expect(getGuardedPath({ projectId: "abc" })).toBeNull();
  });

  it("ignores non-string and empty paths", () => {
    expect(getGuardedPath({ path: 42 })).toBeNull();
    expect(getGuardedPath({ path: "" })).toBeNull();
  });
});
