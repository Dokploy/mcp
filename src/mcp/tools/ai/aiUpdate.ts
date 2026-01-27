import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const aiUpdate = createTool({
  name: "ai-update",
  description: "Updates an existing AI configuration in Dokploy.",
  schema: z.object({
    aiId: z
      .string()
      .min(1)
      .describe("The ID of the AI configuration to update."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("The new name for the AI configuration."),
    apiUrl: z
      .string()
      .url()
      .optional()
      .describe("The new API URL for the AI service."),
    apiKey: z
      .string()
      .optional()
      .describe("The new API key for authentication."),
    model: z.string().min(1).optional().describe("The new model to use."),
    isEnabled: z
      .boolean()
      .optional()
      .describe("Whether the AI configuration is enabled."),
    createdAt: z.string().optional().describe("The creation timestamp."),
  }),
  annotations: {
    title: "Update AI Configuration",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const body: Record<string, unknown> = { aiId: input.aiId };

    if (input.name !== undefined) body.name = input.name;
    if (input.apiUrl !== undefined) body.apiUrl = input.apiUrl;
    if (input.apiKey !== undefined) body.apiKey = input.apiKey;
    if (input.model !== undefined) body.model = input.model;
    if (input.isEnabled !== undefined) body.isEnabled = input.isEnabled;
    if (input.createdAt !== undefined) body.createdAt = input.createdAt;

    const response = await apiClient.post("/ai.update", body);

    return ResponseFormatter.success(
      `Successfully updated AI configuration "${input.aiId}"`,
      response.data,
    );
  },
});
