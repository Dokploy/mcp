import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const applicationCancelDeployment = createTool({
  name: "application-cancelDeployment",
  description: "Cancels an ongoing deployment for an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .describe("The ID of the application to cancel deployment for."),
  }),
  annotations: {
    title: "Cancel Application Deployment",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/application.cancelDeployment",
      input
    );

    return ResponseFormatter.success(
      `Deployment for application "${input.applicationId}" cancelled successfully`,
      response.data
    );
  },
});
