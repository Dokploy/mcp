import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import type { ToolDefinition } from "./types.js";
import apiClient from "./utils/apiClient.js";
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
      if (tool.bodyType === "multipart") {
        const fileFields = tool.fileFields ?? {};
        const verifiedFiles: {
          inputKey: string;
          formField: string;
          filePath: string;
          size: number;
        }[] = [];

        for (const [inputKey, formField] of Object.entries(fileFields)) {
          const rawPath = input[inputKey];
          if (typeof rawPath !== "string" || rawPath.trim() === "") {
            return ResponseFormatter.error(
              `Failed to execute ${tool.name}`,
              `File not found: ${String(rawPath ?? "")}`,
            );
          }

          let fileStat: Awaited<ReturnType<typeof stat>>;
          try {
            fileStat = await stat(rawPath);
          } catch {
            return ResponseFormatter.error(
              `Failed to execute ${tool.name}`,
              `File not found: ${rawPath}`,
            );
          }

          if (!fileStat.isFile()) {
            return ResponseFormatter.error(
              `Failed to execute ${tool.name}`,
              `File not found: ${rawPath}`,
            );
          }

          verifiedFiles.push({
            inputKey,
            formField,
            filePath: rawPath,
            size: fileStat.size,
          });
        }

        const form = new FormData();
        const fileLogMeta: Record<string, { path: string; size: number }> = {};

        for (const fileInfo of verifiedFiles) {
          const content = await readFile(fileInfo.filePath);
          const blob = new Blob([content]);
          form.append(fileInfo.formField, blob, basename(fileInfo.filePath));
          fileLogMeta[fileInfo.inputKey] = {
            path: fileInfo.filePath,
            size: fileInfo.size,
          };
        }

        const nonFileInput: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(input)) {
          if (key in fileFields || value === undefined) {
            continue;
          }
          form.append(key, String(value));
          nonFileInput[key] = value;
        }

        logger.info(`Executing tool: ${tool.name}`, {
          input: redact(nonFileInput),
          files: fileLogMeta,
        });

        const response = await apiClient.post(tool.path, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return ResponseFormatter.success(
          `${tool.name} completed successfully`,
          redact(response.data),
        );
      }

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
