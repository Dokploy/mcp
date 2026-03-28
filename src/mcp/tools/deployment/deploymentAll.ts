import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentAll = createTool({
  name: "deployment-all",
  description: "Lists all deployments for an application in Dokploy.",
  schema: z.object({
    applicationId: z.string().describe("The ID of the application to list deployments for."),
  }),
  annotations: {
    title: "List Application Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.get(`/deployment.all?applicationId=${input.applicationId}`);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch deployments", `Could not fetch deployments for application "${input.applicationId}"`);
    }
    return ResponseFormatter.success(`Successfully fetched deployments for application "${input.applicationId}"`, result.data);
  },
});
