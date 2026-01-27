import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const aiGet = createTool({
  name: "ai-get",
  description: "Gets a specific AI configuration by its ID in Dokploy.",
  schema: z.object({
    aiId: z.string().describe("The ID of the AI configuration to retrieve."),
  }),
  annotations: {
    title: "Get AI Configuration by ID",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(`/ai.get?aiId=${input.aiId}`);

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch AI configuration",
        `AI configuration with ID "${input.aiId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched AI configuration "${input.aiId}"`,
      response.data,
    );
  },
});
