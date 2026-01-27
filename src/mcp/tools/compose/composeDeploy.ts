import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeDeploy = createTool({
  name: "compose-deploy",
  description: "Deploys a Docker Compose project in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to deploy."),
    title: z.string().optional().describe("Optional title for the deployment."),
    description: z
      .string()
      .optional()
      .describe("Optional description for the deployment."),
  }),
  annotations: {
    title: "Deploy Compose Project",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.deploy", input);

    return ResponseFormatter.success(
      `Compose project "${input.composeId}" deployment started successfully`,
      response.data,
    );
  },
});
