import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeCancelDeployment = createTool({
  name: "compose-cancelDeployment",
  description:
    "Cancels an ongoing deployment for a Docker Compose project in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to cancel deployment for."),
  }),
  annotations: {
    title: "Cancel Compose Deployment",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.cancelDeployment", input);

    return ResponseFormatter.success(
      `Deployment for compose project "${input.composeId}" cancelled successfully`,
      response.data,
    );
  },
});
