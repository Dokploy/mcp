import { DEFAULT_REDACTED_FIELDS } from "./redactSensitive.js";

export interface Config {
  dokployUrl: string;
  authToken?: string;
  authMode: "process" | "api-key" | "oauth";
  mcpResourceUrl?: string;
  customHeaders: Record<string, string>;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  redactEnv: boolean;
  redactFields: string[];
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
    const isHttpTransport =
      process.env.MCP_TRANSPORT === "http" ||
      process.env.MCP_TRANSPORT === "sse" ||
      process.argv.includes("--http") ||
      process.argv.includes("--sse");
    const requestedAuthMode =
      process.env.MCP_AUTH_MODE?.trim().toLowerCase() || (isHttpTransport ? "oauth" : "process");
    const authMode =
      requestedAuthMode === "api-key" || requestedAuthMode === "oauth"
        ? requestedAuthMode
        : "process";
    const mcpResourceUrl = process.env.MCP_RESOURCE_URL?.trim();

    if (!dokployUrl) {
      throw new Error("Environment variable DOKPLOY_URL is not defined");
    }
    if (
      requestedAuthMode !== "process" &&
      requestedAuthMode !== "api-key" &&
      requestedAuthMode !== "oauth"
    ) {
      throw new Error("MCP_AUTH_MODE must be 'process', 'api-key', or 'oauth'");
    }
    if (!authToken && !(isHttpTransport && (authMode === "api-key" || authMode === "oauth"))) {
      throw new Error("Environment variable DOKPLOY_API_KEY is not defined");
    }
    if (isHttpTransport && authMode === "oauth" && !mcpResourceUrl) {
      throw new Error(
        "MCP_RESOURCE_URL must be the public HTTPS URL of the protected /mcp endpoint when OAuth is enabled",
      );
    }
    if (mcpResourceUrl) {
      const resource = new URL(mcpResourceUrl);
      if (
        resource.pathname !== "/mcp" ||
        (resource.protocol !== "https:" &&
          resource.hostname !== "localhost" &&
          resource.hostname !== "127.0.0.1")
      ) {
        throw new Error(
          "MCP_RESOURCE_URL must use HTTPS and end in /mcp (HTTP is allowed only on localhost)",
        );
      }
    }

    const redactEnv = parseBoolean(process.env.DOKPLOY_REDACT_ENV, true);
    const parsedFields =
      process.env.DOKPLOY_REDACT_FIELDS?.split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0) ?? [];
    const redactFields = parsedFields.length > 0 ? parsedFields : DEFAULT_REDACTED_FIELDS;

    return {
      dokployUrl,
      ...(authToken ? { authToken } : {}),
      authMode,
      ...(mcpResourceUrl ? { mcpResourceUrl } : {}),
      customHeaders: parseCustomHeaders(process.env.DOKPLOY_CUSTOM_HEADERS),
      timeout: parseInt(process.env.DOKPLOY_TIMEOUT || "30000", 10),
      retryAttempts: parseInt(process.env.DOKPLOY_RETRY_ATTEMPTS || "3", 10),
      retryDelay: parseInt(process.env.DOKPLOY_RETRY_DELAY || "1000", 10),
      redactEnv,
      redactFields,
    };
  }
}

export function getClientConfig(): Config {
  return ConfigManager.getInstance().getConfig();
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off", ""].includes(normalized)) return false;
  return fallback;
}
