import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const previewDeploymentDelete = createTool({
  name: "preview-deployment-delete",
  description: "Deletes a preview deployment in Dokploy.",
  schema: z.object({
    previewDeploymentId: z
      .string()
      .describe("The unique identifier of the preview deployment to delete. Required."),
  }),
  annotations: {
    title: "Delete Preview Deployment",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/previewDeployment.delete", {
      previewDeploymentId: input.previewDeploymentId,
    });

    return ResponseFormatter.success(
      `Successfully deleted preview deployment "${input.previewDeploymentId}"`,
      response.data,
    );
  },
});
