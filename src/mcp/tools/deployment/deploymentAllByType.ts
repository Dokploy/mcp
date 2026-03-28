import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentAllByType = createTool({
  name: "deployment-allByType",
  description: "Lists deployments filtered by type in Dokploy.",
  schema: z.object({
    id: z.string().describe("The ID of the resource to filter deployments by."),
    type: z.enum(["application", "compose", "server", "schedule", "previewDeployment", "backup", "volumeBackup"]).describe("The type of deployment to filter by."),
  }),
  annotations: {
    title: "List Deployments By Type",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.get(`/deployment.allByType?id=${input.id}&type=${input.type}`);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch deployments", `Could not fetch deployments of type "${input.type}" for "${input.id}"`);
    }
    return ResponseFormatter.success(`Successfully fetched deployments of type "${input.type}"`, result.data);
  },
});
