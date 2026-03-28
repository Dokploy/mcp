import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentRemoveDeployment = createTool({
  name: "deployment-removeDeployment",
  description: "Removes a deployment in Dokploy.",
  schema: z.object({
    deploymentId: z.string().min(1).describe("The ID of the deployment to remove."),
  }),
  annotations: {
    title: "Remove Deployment",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
    destructiveHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/deployment.removeDeployment", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to remove deployment", `Could not remove deployment "${input.deploymentId}"`);
    }
    return ResponseFormatter.success(`Successfully removed deployment "${input.deploymentId}"`, result.data);
  },
});
