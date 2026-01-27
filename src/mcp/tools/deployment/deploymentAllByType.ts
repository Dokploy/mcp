import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const deploymentAllByType = createTool({
  name: "deployment-all-by-type",
  description: "Gets all deployments filtered by type in Dokploy.",
  schema: z.object({
    id: z
      .string()
      .min(1)
      .describe("The ID of the resource to get deployments for."),
    type: z
      .enum([
        "application",
        "compose",
        "server",
        "schedule",
        "previewDeployment",
        "backup",
        "volumeBackup",
      ])
      .describe("The type of deployments to retrieve."),
  }),
  annotations: {
    title: "List Deployments By Type",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/deployment.allByType?id=${input.id}&type=${input.type}`
    );

    return ResponseFormatter.success(
      `Successfully fetched ${input.type} deployments for ID "${input.id}"`,
      response.data
    );
  },
});
