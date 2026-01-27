import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const deploymentAll = createTool({
  name: "deployment-all",
  description: "Gets all deployments for a specific application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .min(1)
      .describe("The ID of the application to get deployments for."),
  }),
  annotations: {
    title: "List Application Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/deployment.all?applicationId=${input.applicationId}`
    );

    return ResponseFormatter.success(
      `Successfully fetched deployments for application "${input.applicationId}"`,
      response.data
    );
  },
});
