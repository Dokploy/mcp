export const DEFAULT_REDACTED_FIELDS = [
  "env",
  "buildArgs",
  "composeFile",
  "dockerCompose",
  "environment",
  "password",
  "token",
  "secret",
  "apiKey",
  "privateKey",
  "sshKey",
  "customGitSSHKey",
  "dockerAuth",
  "registryPassword",
  "databasePassword",
  "redisPassword",
  "mariadbPassword",
  "mongoPassword",
  "mysqlPassword",
  "postgresPassword",
];

const REDACTED_PLACEHOLDER = "[REDACTED]";

export function redactSensitive<T>(data: T, fields: string[]): T {
  if (fields.length === 0) return data;
  const lowered = new Set(fields.map((f) => f.toLowerCase()));
  return walk(data, lowered, new WeakSet()) as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function walk(value: unknown, fields: Set<string>, seen: WeakSet<object>): unknown {
  if (Array.isArray(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    return value.map((item) => walk(item, fields, seen));
  }
  if (isPlainObject(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    const out: Record<string, unknown> = Object.create(null);
    for (const [key, val] of Object.entries(value)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      if (fields.has(key.toLowerCase())) {
        out[key] = val === null || val === undefined ? val : REDACTED_PLACEHOLDER;
      } else {
        out[key] = walk(val, fields, seen);
      }
    }
    return out;
  }
  return value;
}
