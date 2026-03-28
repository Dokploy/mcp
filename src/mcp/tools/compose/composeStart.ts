import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeStart = createTool({
  name: "compose-start",
  description: "Starts a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to start."),
  }),
  annotations: {
    title: "Start Compose Stack",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.start", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to start compose stack", `Could not start compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully started compose stack "${input.composeId}"`, result.data);
  },
});
