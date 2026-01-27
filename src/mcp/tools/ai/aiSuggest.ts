import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const aiSuggest = createTool({
  name: "ai-suggest",
  description: "Gets AI suggestions based on input in Dokploy.",
  schema: z.object({
    aiId: z.string().describe("The ID of the AI configuration to use."),
    input: z.string().describe("The input to get suggestions for."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to get suggestions for."),
  }),
  annotations: {
    title: "Get AI Suggestions",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const body: Record<string, string> = {
      aiId: input.aiId,
      input: input.input,
    };

    if (input.serverId) {
      body.serverId = input.serverId;
    }

    const response = await apiClient.post("/ai.suggest", body);

    return ResponseFormatter.success(
      "Successfully retrieved AI suggestions",
      response.data,
    );
  },
});
