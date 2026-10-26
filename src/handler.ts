import type { ToolDefinition } from "./types.js";
import apiClient from "./utils/apiClient.js";
import { classifyApiError } from "./utils/apiError.js";
import { getClientConfig } from "./utils/clientConfig.js";
import { createLogger } from "./utils/logger.js";
import { redactSensitive } from "./utils/redactSensitive.js";
import { ResponseFormatter } from "./utils/responseFormatter.js";

const logger = createLogger("ToolHandler");

export function createHandler(tool: ToolDefinition) {
  return async (input: Record<string, unknown>) => {
    const { redactEnv, redactFields } = getClientConfig();
    const redact = <T>(value: T): T => (redactEnv ? redactSensitive(value, redactFields) : value);

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
      const failure = classifyApiError(error);
      logger.error(`Tool execution failed: ${tool.name}`, { ...failure });
      return ResponseFormatter.error(`Failed to execute ${tool.name}`, failure.hint, failure);
    }
  };
}
