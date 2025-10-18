import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const applicationDeploy = createTool({
  name: "application-deploy",
  description: "Deploys an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .min(1)
      .describe("The ID of the application to deploy."),
    title: z.string().optional().describe("Optional title for the deployment."),
    description: z
      .string()
      .optional()
      .describe("Optional description for the deployment."),
  }),
  annotations: {
    title: "Deploy Application",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/application.deploy", input);

    return ResponseFormatter.success(
      `Application "${input.applicationId}" deployment started successfully`,
      response.data
    );
  },
});
