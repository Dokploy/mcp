import type { ToolDefinition } from "./types.js";
import apiClient from "./utils/apiClient.js";
import { getClientConfig } from "./utils/clientConfig.js";
import { createLogger } from "./utils/logger.js";
import { redactSensitive } from "./utils/redactSensitive.js";
import { ResponseFormatter } from "./utils/responseFormatter.js";

const logger = createLogger("ToolHandler");

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getRedactFieldsForTool(tool: ToolDefinition, input: Record<string, unknown>) {
  if (tool.name !== "application-env-upsert" || !isRecord(input.variables)) {
    return [];
  }

  return Object.keys(input.variables);
}

export function createHandler(tool: ToolDefinition) {
  return async (input: Record<string, unknown>) => {
    const { redactEnv, redactFields } = getClientConfig();
    const toolRedactFields = getRedactFieldsForTool(tool, input);
    const effectiveRedactFields = redactEnv
      ? [...new Set([...redactFields, ...toolRedactFields])]
      : toolRedactFields;
    const redact = <T>(value: T): T =>
      effectiveRedactFields.length > 0 ? redactSensitive(value, effectiveRedactFields) : value;

    try {
      logger.info(`Executing tool: ${tool.name}`, { input: redact(input) });

      const response =
        tool.method === "GET"
          ? await apiClient.get(tool.path, { params: input })
          : await apiClient.post(tool.path, input);

      return ResponseFormatter.success(
        `${tool.name} completed successfully`,
        redact(response.data),
      );
    } catch (error) {
      logger.error(`Tool execution failed: ${tool.name}`, {
        error: error instanceof Error ? error.message : "Unknown error",
      });

      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          return ResponseFormatter.error(
            `Authentication failed for ${tool.name}`,
            "Please check your DOKPLOY_API_KEY configuration",
          );
        }
        if (error.message.includes("404") || error.message.includes("Not Found")) {
          return ResponseFormatter.error(
            "Resource not found",
            `The requested resource for ${tool.name} could not be found`,
          );
        }
      }

      return ResponseFormatter.error(
        `Failed to execute ${tool.name}`,
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };
}
