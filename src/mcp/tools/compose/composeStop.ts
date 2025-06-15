import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeStop = createTool({
  name: "compose-stop",
  description: "Stops a compose service in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose service to stop."),
  }),
  annotations: {
    title: "Stop Compose Service",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.stop", input);

    return ResponseFormatter.success(
      `Compose service "${input.composeId}" stopped successfully`,
      response.data
    );
  },
});
