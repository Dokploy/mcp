import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userDeleteApiKey = createTool({
  name: "user-delete-api-key",
  description: "Deletes an API key for the current user in Dokploy.",
  schema: z.object({
    apiKeyId: z.string().describe("The ID of the API key to delete."),
  }),
  annotations: {
    title: "Delete API Key",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/user.deleteApiKey", input);

    return ResponseFormatter.success(
      `API key "${input.apiKeyId}" deleted successfully`,
      response.data,
    );
  },
});
