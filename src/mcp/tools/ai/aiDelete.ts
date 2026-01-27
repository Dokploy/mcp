import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const aiDelete = createTool({
  name: "ai-delete",
  description: "Deletes an AI configuration in Dokploy.",
  schema: z.object({
    aiId: z.string().describe("The ID of the AI configuration to delete."),
  }),
  annotations: {
    title: "Delete AI Configuration",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/ai.delete", {
      aiId: input.aiId,
    });

    return ResponseFormatter.success(
      `Successfully deleted AI configuration "${input.aiId}"`,
      response.data,
    );
  },
});
