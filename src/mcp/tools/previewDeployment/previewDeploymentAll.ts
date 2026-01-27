import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const previewDeploymentAll = createTool({
  name: "preview-deployment-all",
  description: "Gets all preview deployments for an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .min(1)
      .describe("The unique identifier of the application to get preview deployments for. Required."),
  }),
  annotations: {
    title: "Get All Preview Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/previewDeployment.all?applicationId=${input.applicationId}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched preview deployments for application "${input.applicationId}"`,
      response.data,
    );
  },
});
