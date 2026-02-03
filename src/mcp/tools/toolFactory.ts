import { z, ZodObject, ZodRawShape } from "zod";
import apiClient from "../../utils/apiClient.js";
import { createLogger } from "../../utils/logger.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";

// Updated to match MCP SDK response format
export type ToolHandler<T> = (input: T) => Promise<{
  content: { type: "text"; text: string }[];
  isError?: boolean;
}>;

// Defines the structure for a tool.
// TShape is the ZodRawShape (the object passed to z.object()).
// TOutputShape is the optional output schema ZodRawShape
export interface ToolDefinition<
  TShape extends ZodRawShape,
  TOutputShape extends ZodRawShape = ZodRawShape
> {
  name: string;
  description: string;
  schema: ZodObject<TShape>; // The schema must be a ZodObject
  outputSchema?: ZodObject<TOutputShape>; // Optional output schema for validation
  handler: ToolHandler<z.infer<ZodObject<TShape>>>; // Handler input is inferred from the ZodObject
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
}

interface ToolContext {
  apiClient: typeof apiClient;
  logger: ReturnType<typeof createLogger>;
}

const logger = createLogger("ToolFactory");

export function createToolContext(): ToolContext {
  return {
    apiClient,
    logger,
  };
}

export function createTool<
  TShape extends import("zod").ZodRawShape,
  TOutputShape extends import("zod").ZodRawShape = import("zod").ZodRawShape
>(
  definition: ToolDefinition<TShape, TOutputShape>
): ToolDefinition<TShape, TOutputShape> {
  return {
    ...definition,
    handler: async (input) => {
      const context = createToolContext();

      try {
        // Validate input against schema
        const validationResult = definition.schema.safeParse(input);
        if (!validationResult.success) {
          context.logger.warn(
            `Input validation failed for tool: ${definition.name}`,
            {
              errors: validationResult.error.errors,
              input,
            }
          );

          const errorMessages = validationResult.error.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", ");

          return ResponseFormatter.error(
            `Invalid input for tool: ${definition.name}`,
            `Validation errors: ${errorMessages}`
          );
        }

        context.logger.info(`Executing tool: ${definition.name}`, {
          input: validationResult.data,
        });
        const result = await definition.handler(validationResult.data);
        context.logger.info(`Tool executed successfully: ${definition.name}`);
        return result;
      } catch (error) {
        context.logger.error(`Tool execution failed: ${definition.name}`, {
          error: error instanceof Error ? error.message : "Unknown error",
          input,
        });

        // More specific error handling based on error types
        if (error instanceof Error) {
          if (
            error.message.includes("401") ||
            error.message.includes("Unauthorized")
          ) {
            return ResponseFormatter.error(
              `Authentication failed for tool: ${definition.name}`,
              "Please check your DOKPLOY_API_KEY configuration"
            );
          }

          if (
            error.message.includes("404") ||
            error.message.includes("Not Found")
          ) {
            return ResponseFormatter.error(
              `Resource not found`,
              `The requested resource for ${definition.name} could not be found`
            );
          }

          if (
            error.message.includes("500") ||
            error.message.includes("Internal Server Error")
          ) {
            return ResponseFormatter.error(
              `Server error occurred`,
              `Dokploy server encountered an internal error while processing ${definition.name}`
            );
          }
        }

        return ResponseFormatter.error(
          `Failed to execute tool: ${definition.name}`,
          `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
        );
      }
    },
  };
}
