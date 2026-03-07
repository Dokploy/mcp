import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeRedeploy = createTool({
  name: "compose-redeploy",
  description: "Redeploys a compose stack in Dokploy (pulls latest images and restarts).",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose stack to redeploy."),
  }),
  annotations: {
    title: "Redeploy Compose Stack",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.redeploy", input);

    return ResponseFormatter.success(
      `Compose stack "${input.composeId}" redeployment started successfully`,
      response.data
    );
  },
});
