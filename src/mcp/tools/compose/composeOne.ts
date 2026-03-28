import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeOne = createTool({
  name: "compose-one",
  description: "Gets a specific compose stack by its ID in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose stack to retrieve."),
  }),
  annotations: {
    title: "Get Compose Stack Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.get(`/compose.one?composeId=${input.composeId}`);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch compose stack", `Compose stack with ID "${input.composeId}" not found`);
    }
    return ResponseFormatter.success(`Successfully fetched compose stack "${input.composeId}"`, result.data);
  },
});
