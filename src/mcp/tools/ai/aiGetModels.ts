import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const aiGetModels = createTool({
  name: "ai-get-models",
  description: "Gets available AI models from an API endpoint in Dokploy.",
  schema: z.object({
    apiUrl: z.string().min(1).describe("The API URL to fetch models from."),
    apiKey: z.string().describe("The API key for authentication."),
  }),
  annotations: {
    title: "Get AI Models",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("apiUrl", input.apiUrl);
    params.append("apiKey", input.apiKey);

    const response = await apiClient.get(`/ai.getModels?${params.toString()}`);

    return ResponseFormatter.success(
      "Successfully fetched AI models",
      response.data,
    );
  },
});
