export interface Config {
  dokployUrl: string;
  authToken: string;
  customHeaders: Record<string, string>;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
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
    };
  }
}

export function getClientConfig(): Config {
  return ConfigManager.getInstance().getConfig();
}
