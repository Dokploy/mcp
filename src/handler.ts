import type { ToolDefinition } from "./types.js";
import apiClient from "./utils/apiClient.js";
import { getClientConfig } from "./utils/clientConfig.js";
import { createLogger } from "./utils/logger.js";
import { redactSecretAssignmentsDeep, redactSensitive } from "./utils/redactSensitive.js";
import { ResponseFormatter } from "./utils/responseFormatter.js";
import { getGuardedPath, isSensitivePath } from "./utils/secretPaths.js";
import { redactSecretShapesDeep } from "./utils/secretShapes.js";

const logger = createLogger("ToolHandler");

export function createHandler(tool: ToolDefinition) {
  return async (input: Record<string, unknown>) => {
    const { redactEnv, redactFields, blockSecretPaths, secretPathPatterns } = getClientConfig();
    const guardedPath = getGuardedPath(input);

    const redact = <T>(value: T): T => {
      if (!redactEnv) return value;

      let result = redactSensitive(value, redactFields);

      // Log output has neither a field name nor a path to key off, so the only
      // remaining handle is the shape of the secret itself. Applied to every
      // response rather than just the log tools: a PEM block or a URI with
      // credentials in it is a secret whichever endpoint returned it.
      result = redactSecretShapesDeep(result);

      // A tool that takes a path returns file contents, where secrets live
      // inside the string rather than in a tell-tale field name. Only those
      // responses get the extra pass, so ordinary payloads stay untouched.
      if (guardedPath !== null) {
        result = redactSecretAssignmentsDeep(result, redactFields);
      }

      return result;
    };

    // Name-based redaction cannot protect file contents: they come back as an
    // opaque string whose field name gives no hint about what is inside. The
    // path is the only reliable signal, and it is available before the call.
    if (
      blockSecretPaths &&
      guardedPath !== null &&
      isSensitivePath(guardedPath, secretPathPatterns)
    ) {
      logger.warn(`Blocked secret-bearing path for tool: ${tool.name}`, { path: guardedPath });
      return ResponseFormatter.error(
        `Access to this path is blocked for ${tool.name}`,
        "The requested path matches a secret-bearing pattern (DOKPLOY_SECRET_PATH_PATTERNS). " +
          "Adjust that list, or set DOKPLOY_BLOCK_SECRET_PATHS=false to disable the guard.",
      );
    }

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
