import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { classifyApiError } from "./apiError.js";
import { getClientConfig } from "./clientConfig.js";
import { createLogger } from "./logger.js";

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
  "x-api-key": config.authToken,
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
    logger.error("Request interceptor error", { ...classifyApiError(error) });
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
    logger.error("API request failed", { ...classifyApiError(error) });
    return Promise.reject(error);
  },
);

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

// Export the configured axios instance
export default apiClient;
