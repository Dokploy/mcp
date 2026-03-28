import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeRandomizeCompose = createTool({
  name: "compose-randomizeCompose",
  description: "Randomizes a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to randomize."),
    suffix: z.string().optional().describe("An optional suffix for the randomized compose."),
  }),
  annotations: {
    title: "Randomize Compose Stack",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.randomizeCompose", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to randomize compose stack", `Could not randomize compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully randomized compose stack "${input.composeId}"`, result.data);
  },
});
