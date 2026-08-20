export const DEFAULT_REDACTED_FIELDS = [
  "env",
  "buildArgs",
  "composeFile",
  "dockerCompose",
  "environment",
  "buildSecrets",
  "previewBuildSecrets",
  "password",
  "currentPassword",
  "appPassword",
  "databasePassword",
  "databaseRootPassword",
  "redisPassword",
  "mariadbPassword",
  "mongoPassword",
  "mysqlPassword",
  "postgresPassword",
  "registryPassword",
  "token",
  "accessToken",
  "appToken",
  "apiToken",
  "botToken",
  "refreshToken",
  "secret",
  "clientSecret",
  "apiKey",
  "secretAccessKey",
  "accessKey",
  "licenseKey",
  "userKey",
  "privateKey",
  "privateKeyPass",
  "encPrivateKey",
  "encPrivateKeyPass",
  "sshKey",
  "sshPrivateKey",
  "customGitSSHKey",
  "dockerAuth",
];

const REDACTED_PLACEHOLDER = "[REDACTED]";

export function redactSensitive<T>(data: T, fields: string[]): T {
  if (fields.length === 0) return data;
  const suffixes = fields.map((f) => f.toLowerCase());
  return walk(data, suffixes, new WeakSet()) as T;
}

/**
 * `KEY=value` assignment, optionally `export`-prefixed and indented. The value
 * is whatever follows the first `=`, which is how dotenv itself parses a line.
 */
const ASSIGNMENT = /^([ \t]*(?:export[ \t]+)?)([A-Za-z_][A-Za-z0-9_]*)([ \t]*=[ \t]*)(.+)$/;

/** Underscores are dropped so that `DATABASE_PASSWORD` matches the `password` suffix. */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/_/g, "");
}

/**
 * The suffix list is written for camelCase JSON fields, so `SCREAMING_SNAKE`
 * env keys need one extra angle: besides the whole key, each underscore-
 * delimited word is compared as well. Without it `SECRET_KEY` slips through —
 * it collapses to `secretkey`, which ends in neither `secret` nor any listed
 * `*Key` entry. Words must match exactly, so the widening stays narrow.
 */
function isSecretAssignmentKey(rawKey: string, suffixes: string[]): boolean {
  const collapsed = normalizeKey(rawKey);
  if (suffixes.some((suffix) => collapsed.endsWith(suffix))) return true;

  const words = rawKey.toLowerCase().split("_").filter(Boolean);
  if (words.length < 2) return false;
  return words.some((word) => suffixes.includes(word));
}

/**
 * Masks the value side of secret-bearing assignments inside a block of text.
 *
 * Field-name matching only sees the *container* of a value. When a tool returns
 * a whole file as one string, the secrets sit inside that string and are missed.
 * This applies the very same suffix list to the keys found within the text, so
 * `DATABASE_PASSWORD=hunter2` is masked while `PORT=3000` stays readable —
 * without introducing a second, separately configured list of secret names.
 */
export function redactSecretAssignments(text: string, fields: string[]): string {
  if (fields.length === 0 || !text.includes("=")) return text;

  const suffixes = fields.map((field) => normalizeKey(field));
  let changed = false;

  const lines = text.split("\n").map((line) => {
    const carriageReturn = line.endsWith("\r") ? "\r" : "";
    const bare = carriageReturn ? line.slice(0, -1) : line;

    const match = ASSIGNMENT.exec(bare);
    if (!match) return line;

    const [, prefix = "", key = "", separator = ""] = match;
    if (!isSecretAssignmentKey(key, suffixes)) return line;

    changed = true;
    return `${prefix}${key}${separator}${REDACTED_PLACEHOLDER}${carriageReturn}`;
  });

  return changed ? lines.join("\n") : text;
}

/**
 * Applies {@link redactSecretAssignments} to every string in a response,
 * whatever shape the endpoint uses to wrap the file contents.
 */
export function redactSecretAssignmentsDeep<T>(data: T, fields: string[]): T {
  if (fields.length === 0) return data;
  return walkStrings(data, fields, new WeakSet()) as T;
}

function walkStrings(value: unknown, fields: string[], seen: WeakSet<object>): unknown {
  if (typeof value === "string") return redactSecretAssignments(value, fields);

  if (Array.isArray(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    return value.map((item) => walkStrings(item, fields, seen));
  }

  if (isPlainObject(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    const out: Record<string, unknown> = Object.create(null);
    for (const [key, val] of Object.entries(value)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      out[key] = walkStrings(val, fields, seen);
    }
    return out;
  }

  return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function walk(value: unknown, suffixes: string[], seen: WeakSet<object>): unknown {
  if (Array.isArray(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    return value.map((item) => walk(item, suffixes, seen));
  }
  if (isPlainObject(value)) {
    if (seen.has(value)) return value;
    seen.add(value);
    const out: Record<string, unknown> = Object.create(null);
    for (const [key, val] of Object.entries(value)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      const loweredKey = key.toLowerCase();
      if (suffixes.some((suffix) => loweredKey.endsWith(suffix))) {
        out[key] = val === null || val === undefined ? val : REDACTED_PLACEHOLDER;
      } else {
        out[key] = walk(val, suffixes, seen);
      }
    }
    return out;
  }
  return value;
}
