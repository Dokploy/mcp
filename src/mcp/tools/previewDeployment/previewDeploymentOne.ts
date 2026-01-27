import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const previewDeploymentOne = createTool({
  name: "preview-deployment-one",
  description: "Gets a specific preview deployment by its ID in Dokploy.",
  schema: z.object({
    previewDeploymentId: z
      .string()
      .describe("The unique identifier of the preview deployment to retrieve. Required."),
  }),
  annotations: {
    title: "Get Preview Deployment Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/previewDeployment.one?previewDeploymentId=${input.previewDeploymentId}`,
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch preview deployment",
        `Preview deployment with ID "${input.previewDeploymentId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched preview deployment "${input.previewDeploymentId}"`,
      response.data,
    );
  },
});
