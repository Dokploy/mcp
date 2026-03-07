import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeStart = createTool({
  name: "compose-start",
  description: "Starts a compose stack in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose stack to start."),
  }),
  annotations: {
    title: "Start Compose Stack",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.start", input);

    return ResponseFormatter.success(
      `Compose stack "${input.composeId}" started successfully`,
      response.data
    );
  },
});
