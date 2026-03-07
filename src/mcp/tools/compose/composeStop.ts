import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeStop = createTool({
  name: "compose-stop",
  description: "Stops a running compose stack in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose stack to stop."),
  }),
  annotations: {
    title: "Stop Compose Stack",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.stop", input);

    return ResponseFormatter.success(
      `Compose stack "${input.composeId}" stopped successfully`,
      response.data
    );
  },
});
