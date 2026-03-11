import { z } from "zod";
import { AxiosError } from "axios";
import apiClient from "../../utils/apiClient.js";
import { createLogger } from "../../utils/logger.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";
import {
  getGetOperations,
  getOperationsList,
} from "../../utils/openApiSpec.js";

const logger = createLogger("DokployApi");

async function getMethod(operation: string): Promise<"GET" | "POST"> {
  const getOps = await getGetOperations();
  return getOps.has(operation) ? "GET" : "POST";
}

export const schema = {
  operation: z
    .string()
    .min(1)
    .describe(
      'The API operation path, e.g. "application.create", "server.one", "postgres.deploy"'
    ),
  params: z
    .record(z.any())
    .optional()
    .describe(
      "Parameters object. Sent as JSON body for mutations, query string for reads."
    ),
};

export const name = "dokploy-api";

// The description is built dynamically on first use, but we need a static
// string for tool registration. We use a base description and the tool
// handler enriches error messages with available operations when needed.
export let description =
  "Execute any Dokploy API operation. HTTP method is auto-detected from the OpenAPI spec. Use dokploy-api-schema to discover parameters for an operation.";

// Lazy-initialize the full description with operations list on first call
let descriptionInitialized = false;
async function ensureDescription(): Promise<void> {
  if (descriptionInitialized) return;
  try {
    const opsList = await getOperationsList();
    description = `Execute any Dokploy API operation. HTTP method is auto-detected from the OpenAPI spec. Use dokploy-api-schema to discover parameters for an operation.\n\n${opsList}`;
    descriptionInitialized = true;
  } catch {
    // If spec fetch fails, keep the base description — tool still works
    logger.warn("Could not fetch operations list for description");
  }
}

export const annotations = {
  title: "Dokploy API",
  readOnlyHint: false,
  openWorldHint: true,
};

export async function handler(input: {
  operation: string;
  params?: Record<string, unknown>;
}) {
  // Ensure description is populated for future registrations
  await ensureDescription();

  const { operation, params } = input;
  const method = await getMethod(operation);
  const endpoint = `/${operation}`;

  logger.info(`Executing ${method} ${endpoint}`, { hasParams: !!params });

  try {
    const response =
      method === "POST"
        ? await apiClient.post(endpoint, params ?? {})
        : await apiClient.get(endpoint, { params });

    return ResponseFormatter.success(
      `${method} ${operation} succeeded`,
      response.data
    );
  } catch (error) {
    logger.error(`${method} ${endpoint} failed`, {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const data = error.response.data as Record<string, unknown> | undefined;
      const detail =
        (data?.message as string) || (data?.error as string) || error.message;

      if (status === 400) {
        return ResponseFormatter.error(
          `Bad request for ${operation}`,
          detail
        );
      }
      if (status === 401) {
        return ResponseFormatter.error(
          "Authentication failed",
          "Please check your DOKPLOY_API_KEY configuration"
        );
      }
      if (status === 403) {
        return ResponseFormatter.error(
          "Access denied",
          `Insufficient permissions for ${operation}`
        );
      }
      if (status === 404) {
        return ResponseFormatter.error(
          "Resource not found",
          `Operation ${operation} not found or resource does not exist`
        );
      }
      if (status === 422) {
        return ResponseFormatter.error(
          `Validation error for ${operation}`,
          detail
        );
      }
      if (status >= 500) {
        return ResponseFormatter.error(
          "Server error",
          `Dokploy server error while processing ${operation}`
        );
      }
    }

    return ResponseFormatter.error(
      `Failed: ${operation}`,
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
