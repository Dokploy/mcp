import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeStop = createTool({
  name: "compose-stop",
  description: "Stops a Docker Compose project in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to stop."),
  }),
  annotations: {
    title: "Stop Compose Project",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.stop", input);

    return ResponseFormatter.success(
      `Compose project "${input.composeId}" stopped successfully`,
      response.data,
    );
  },
});
