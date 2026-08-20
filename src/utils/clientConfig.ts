import { createLogger } from "./logger.js";
import { DEFAULT_REDACTED_FIELDS } from "./redactSensitive.js";
import { DEFAULT_SECRET_PATH_PATTERNS } from "./secretPaths.js";

const logger = createLogger("ClientConfig");

export interface Config {
  dokployUrl: string;
  authToken: string;
  customHeaders: Record<string, string>;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  redactEnv: boolean;
  redactFields: string[];
  blockSecretPaths: boolean;
  secretPathPatterns: string[];
}

const RESERVED_CUSTOM_HEADER_NAMES = new Set(["x-api-key", "content-type", "accept"]);

export function parseCustomHeaders(rawHeaders: string | undefined): Record<string, string> {
  if (rawHeaders === undefined) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawHeaders);
  } catch (error) {
    throw new Error(
      "Environment variable DOKPLOY_CUSTOM_HEADERS must be valid JSON containing an object of string header names to string values",
      { cause: error },
    );
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(
      "Environment variable DOKPLOY_CUSTOM_HEADERS must be a JSON object of string header names to string values",
    );
  }

  const customHeaders: Record<string, string> = {};
  for (const [name, value] of Object.entries(parsed)) {
    if (name.trim() === "") {
      throw new Error("Environment variable DOKPLOY_CUSTOM_HEADERS contains an empty header name");
    }

    if (RESERVED_CUSTOM_HEADER_NAMES.has(name.toLowerCase())) {
      throw new Error(
        "Environment variable DOKPLOY_CUSTOM_HEADERS cannot override reserved headers x-api-key, content-type, or accept; configure Dokploy authentication with DOKPLOY_API_KEY",
      );
    }

    if (typeof value !== "string") {
      throw new Error(
        "Environment variable DOKPLOY_CUSTOM_HEADERS must contain only string header values",
      );
    }

    customHeaders[name] = value;
  }

  return customHeaders;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config | null = null;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getConfig(): Config {
    if (!this.config) {
      this.config = this.loadConfig();
    }
    return this.config;
  }

  private loadConfig(): Config {
    const dokployUrl = process.env.DOKPLOY_URL;
    const authToken = process.env.DOKPLOY_API_KEY;

    if (!dokployUrl) {
      throw new Error("Environment variable DOKPLOY_URL is not defined");
    }
    if (!authToken) {
      throw new Error("Environment variable DOKPLOY_API_KEY is not defined");
    }

    return {
      dokployUrl,
      authToken,
      customHeaders: parseCustomHeaders(process.env.DOKPLOY_CUSTOM_HEADERS),
      timeout: parseInt(process.env.DOKPLOY_TIMEOUT || "30000", 10),
      retryAttempts: parseInt(process.env.DOKPLOY_RETRY_ATTEMPTS || "3", 10),
      retryDelay: parseInt(process.env.DOKPLOY_RETRY_DELAY || "1000", 10),
      redactEnv: parseBoolean(process.env.DOKPLOY_REDACT_ENV, true),
      redactFields: resolveList(
        { override: "DOKPLOY_REDACT_FIELDS", extra: "DOKPLOY_EXTRA_REDACT_FIELDS" },
        process.env.DOKPLOY_REDACT_FIELDS,
        process.env.DOKPLOY_EXTRA_REDACT_FIELDS,
        DEFAULT_REDACTED_FIELDS,
      ),
      blockSecretPaths: parseBoolean(process.env.DOKPLOY_BLOCK_SECRET_PATHS, true),
      secretPathPatterns: resolveList(
        { override: "DOKPLOY_SECRET_PATH_PATTERNS", extra: "DOKPLOY_EXTRA_SECRET_PATHS" },
        process.env.DOKPLOY_SECRET_PATH_PATTERNS,
        process.env.DOKPLOY_EXTRA_SECRET_PATHS,
        DEFAULT_SECRET_PATH_PATTERNS,
      ),
    };
  }
}

export function getClientConfig(): Config {
  return ConfigManager.getInstance().getConfig();
}

/**
 * Resolves a security list from an optional full override plus an optional
 * additive extension.
 *
 * Overriding replaces the built-in defaults wholesale, which is easy to reach
 * for by accident: an operator who only wants one more entry writes out the
 * whole list, copies an outdated version of it, and silently drops protections
 * they never meant to touch. The `EXTRA_` variable exists so that the common
 * case — "the defaults, plus this" — never has that failure mode. An override
 * is still honoured, but it is logged, because weakening the defaults should
 * not happen quietly.
 */
export function resolveList(
  names: { override: string; extra: string },
  override: string | undefined,
  extra: string | undefined,
  defaults: string[],
): string[] {
  const base = parseList(override, defaults);
  const additions = parseList(extra, []);

  if (base !== defaults) {
    logger.warn(`${names.override} replaces the built-in defaults rather than extending them`, {
      defaultEntries: defaults.length,
      configuredEntries: base.length,
      hint: `Use ${names.extra} to keep the defaults and add to them`,
    });
  }

  return additions.length > 0 ? [...new Set([...base, ...additions])] : base;
}

/**
 * Parses a comma-separated environment variable, falling back to `fallback`
 * when the variable is unset or contains no usable entries.
 */
function parseList(value: string | undefined, fallback: string[]): string[] {
  const parsed =
    value
      ?.split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0) ?? [];

  return parsed.length > 0 ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off", ""].includes(normalized)) return false;
  return fallback;
}
