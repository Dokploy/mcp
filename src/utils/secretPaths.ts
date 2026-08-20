/**
 * Path guard for the file-access tools.
 *
 * `DOKPLOY_REDACT_ENV` masks secret-bearing *fields* in API responses by matching
 * the field name. That does not help for tools that return raw file contents
 * (`docker-readContainerFile`, `dockerVolume-readVolumeFile`,
 * `settings-readTraefikFile`, ...): the secret arrives as an opaque string whose
 * field name reveals nothing, so name-based redaction never fires.
 *
 * This module closes that gap on the request side instead: before a tool that
 * takes a filesystem `path` is executed, the path is checked against a
 * deny-list. Everything else about the tool stays usable — reading
 * `/app/logs/error.log` still works, reading `/app/.env` does not.
 */

export const DEFAULT_SECRET_PATH_PATTERNS = [
  // Dotenv files, in any directory and with any suffix (.env.production, ...).
  ".env",
  ".env.*",
  "*.env",
  // Docker / Swarm secret mounts.
  "/run/secrets/**",
  "**/secrets/**",
  // Private keys and certificates.
  "*.pem",
  "*.key",
  "*.p12",
  "*.pfx",
  "id_rsa*",
  "id_dsa*",
  "id_ecdsa*",
  "id_ed25519*",
  // Credential stores of common tooling.
  ".npmrc",
  ".netrc",
  ".pgpass",
  ".git-credentials",
  ".htpasswd",
  "credentials",
  "credentials.*",
  "**/.ssh/**",
  "**/.aws/**",
  "**/.gnupg/**",
  "**/.docker/config.json",
  "**/.kube/config",
];

const globCache = new Map<string, RegExp>();

/**
 * Translates a glob into an anchored, case-insensitive RegExp.
 *
 * Supported: `?` (one character, not `/`), `*` (any run of characters, not `/`)
 * and `**` (any run of characters, `/` included). `**​/` additionally matches
 * the empty string, so `**​/.ssh/**` matches both `.ssh/id_rsa` and
 * `/home/app/.ssh/id_rsa`.
 */
export function globToRegExp(glob: string): RegExp {
  const cached = globCache.get(glob);
  if (cached) return cached;

  let source = "";
  // charAt is used instead of index access so that reading past the end yields
  // "" rather than undefined, which keeps the lookaheads below simple.
  for (let index = 0; index < glob.length; index++) {
    const char = glob.charAt(index);

    if (char === "*") {
      if (glob.charAt(index + 1) === "*") {
        index++;
        if (glob.charAt(index + 1) === "/") {
          index++;
          source += "(?:.*/)?";
        } else {
          source += ".*";
        }
      } else {
        source += "[^/]*";
      }
      continue;
    }

    if (char === "?") {
      source += "[^/]";
      continue;
    }

    source += char.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }

  const regExp = new RegExp(`^${source}$`, "i");
  globCache.set(glob, regExp);
  return regExp;
}

/**
 * Collapses `.`/`..` segments and backslashes so that `/app/../app/.env` cannot
 * slip past a deny-list entry that only spells out `/app/.env`.
 */
export function normalizePath(input: string): string {
  const slashed = input.replace(/\\/g, "/");
  const isAbsolute = slashed.startsWith("/");
  const segments: string[] = [];

  for (const segment of slashed.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }

  return (isAbsolute ? "/" : "") + segments.join("/");
}

/**
 * Returns the raw path plus, if it differs, its percent-decoded form. Both are
 * checked so that `%2e%65nv`-style encodings cannot bypass the deny-list.
 */
function pathVariants(rawPath: string): string[] {
  const variants = [rawPath];
  try {
    const decoded = decodeURIComponent(rawPath);
    if (decoded !== rawPath) variants.push(decoded);
  } catch {
    // Malformed escape sequence — the raw form is all we can check.
  }
  return variants;
}

/**
 * A pattern containing `/` is matched against the whole normalized path,
 * everything else against the file name only. That makes `.env` block every
 * dotenv file regardless of directory, while `/run/secrets/**` stays anchored.
 */
export function isSensitivePath(rawPath: string, patterns: string[]): boolean {
  if (patterns.length === 0) return false;

  for (const variant of pathVariants(rawPath)) {
    const normalized = normalizePath(variant);
    const baseName = normalized.split("/").pop() ?? "";

    for (const pattern of patterns) {
      const regExp = globToRegExp(pattern);
      const target = pattern.includes("/") ? normalized : baseName;
      if (regExp.test(target)) return true;
    }
  }

  return false;
}

/**
 * Every tool that reads, writes or lists a file takes its target as a string
 * `path` argument. Deriving the guard from the argument rather than from a list
 * of tool names keeps it correct when tools are added or renamed upstream.
 */
export function getGuardedPath(input: Record<string, unknown>): string | null {
  const path = input.path;
  return typeof path === "string" && path.length > 0 ? path : null;
}
