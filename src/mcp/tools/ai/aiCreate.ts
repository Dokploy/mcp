import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const aiCreate = createTool({
  name: "ai-create",
  description: "Creates a new AI configuration in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the AI configuration."),
    apiUrl: z.string().url().describe("The API URL for the AI service."),
    apiKey: z.string().describe("The API key for authentication."),
    model: z.string().min(1).describe("The model to use."),
    isEnabled: z.boolean().describe("Whether the AI configuration is enabled."),
  }),
  annotations: {
    title: "Create AI Configuration",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/ai.create", {
      name: input.name,
      apiUrl: input.apiUrl,
      apiKey: input.apiKey,
      model: input.model,
      isEnabled: input.isEnabled,
    });

    return ResponseFormatter.success(
      `Successfully created AI configuration "${input.name}"`,
      response.data,
    );
  },
});
