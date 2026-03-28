import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeLoadServices = createTool({
  name: "compose-loadServices",
  description: "Loads services for a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose stack."),
    type: z.enum(["fetch", "cache"]).optional().describe("Whether to fetch or use cache."),
  }),
  annotations: {
    title: "Load Compose Services",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const query = `composeId=${input.composeId}` + (input.type ? `&type=${input.type}` : "");
    const result = await apiClient.get(`/compose.loadServices?${query}`);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to load services", `Could not load services for compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully loaded services for compose stack "${input.composeId}"`, result.data);
  },
});
