import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeFetchSourceType = createTool({
  name: "compose-fetchSourceType",
  description: "Fetches the source type for a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to fetch source type for."),
  }),
  annotations: {
    title: "Fetch Compose Source Type",
    readOnlyHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.fetchSourceType", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch source type", `Could not fetch source type for compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully fetched source type for compose stack "${input.composeId}"`, result.data);
  },
});
