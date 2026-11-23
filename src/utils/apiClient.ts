import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { getClientConfig } from "./clientConfig.js";
import { createLogger } from "./logger.js";
import { getRequestAuth } from "./requestAuth.js";

// Extend the config interface to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

// Create logger instance for axios client
const logger = createLogger("AxiosClient");

// Get configuration from existing client config
const config = getClientConfig();

// Default headers for MCP server context
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  ...config.customHeaders,
  ...(config.authMode === "process" && config.authToken ? { "x-api-key": config.authToken } : {}),
} as const;

// Create axios instance with configuration from clientConfig
// Ensure baseURL includes /api prefix for Dokploy API routes
const baseURL = `${config.dokployUrl.replace(/\/+$/, "")}/api`;

const apiClient = axios.create({
  baseURL,
  timeout: config.timeout,
  headers: DEFAULT_HEADERS,
});

// Request interceptor - Add request timing and logging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestAuth = getRequestAuth();
    if (requestAuth?.mode === "api-key") {
      config.headers["x-api-key"] = requestAuth.token;
    } else if (requestAuth?.mode === "oauth") {
      config.headers.Authorization = `Bearer ${requestAuth.token}`;
    }

    // Add request timestamp for performance monitoring
    (config as ExtendedAxiosRequestConfig).metadata = { startTime: Date.now() };

    logger.debug("Making API request", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      hasData: !!config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    logger.error("Request interceptor error", { error: error.message });
    return Promise.reject(error);
  },
);

// Response interceptor - Handle responses and errors with proper logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time for performance monitoring
    const metadata = (response.config as ExtendedAxiosRequestConfig).metadata;
    const startTime = metadata?.startTime;

    if (startTime) {
      const duration = Date.now() - startTime;
      logger.info("API request completed", {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
        duration: `${duration}ms`,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    const { response, request, config } = error;

    // Handle different error scenarios with proper logging
    if (response) {
      // Server responded with error status
      handleServerError(response);
    } else if (request) {
      // Request was made but no response received
      handleNetworkError(request, config);
    } else {
      // Something else happened
      handleUnknownError(error);
    }

    return Promise.reject(error);
  },
);

// Helper Functions

function handleServerError(response: AxiosResponse): void {
  const { status, data, config } = response;

  const errorContext = {
    status,
    method: config?.method?.toUpperCase(),
    url: config?.url,
    message: data?.message || data?.error || "Unknown server error",
  };

  switch (status) {
    case 401:
      logger.error(
        "Authentication failed - Invalid or expired Dokploy authorization",
        errorContext,
      );
      break;
    case 403:
      logger.error("Access forbidden - Insufficient permissions", errorContext);
      break;
    case 404:
      logger.error("Resource not found", errorContext);
      break;
    case 422:
      logger.error("Validation error", {
        ...errorContext,
        errors: data?.errors,
      });
      break;
    case 500:
      logger.error("Internal server error", errorContext);
      break;
    default:
      logger.error(`Server error (${status})`, errorContext);
  }
}

function handleNetworkError(
  _request: XMLHttpRequest,
  config: InternalAxiosRequestConfig | undefined,
): void {
  logger.error("Network error - Request failed", {
    method: config?.method?.toUpperCase(),
    url: config?.url || "Unknown URL",
    timeout: config?.timeout || "No timeout set",
    error: "No response received from server",
  });
}

function handleUnknownError(error: AxiosError): void {
  logger.error("Unknown error occurred", {
    error: error.message,
    stack: error.stack,
  });
}

// Utility function to update auth token (for MCP context)
export function setAuthToken(token: string): void {
  // Update default headers for future requests
  apiClient.defaults.headers.common["x-api-key"] = token;
  logger.info("Auth token updated for API client");
}

// Utility function to clear auth token
export function clearAuthToken(): void {
  // Remove authorization header
  delete apiClient.defaults.headers.common["x-api-key"];
  logger.info("Auth token cleared from API client");
}

export async function verifyRequestApiKey(token: string): Promise<void> {
  await apiClient.get("/user.get", {
    headers: { "x-api-key": token },
  });
}

export async function verifyRequestOAuthToken(token: string): Promise<void> {
  await apiClient.get("/user.get", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Export the configured axios instance
export default apiClient;
