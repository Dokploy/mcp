import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeRedeploy = createTool({
  name: "compose-redeploy",
  description: "Redeploys a Docker Compose project in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to redeploy."),
    title: z
      .string()
      .optional()
      .describe("Optional title for the redeployment."),
    description: z
      .string()
      .optional()
      .describe("Optional description for the redeployment."),
  }),
  annotations: {
    title: "Redeploy Compose Project",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.redeploy", input);

    return ResponseFormatter.success(
      `Compose project "${input.composeId}" redeployment started successfully`,
      response.data,
    );
  },
});
