import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentKillProcess = createTool({
  name: "deployment-killProcess",
  description: "Kills a deployment process in Dokploy.",
  schema: z.object({
    deploymentId: z.string().min(1).describe("The ID of the deployment to kill."),
  }),
  annotations: {
    title: "Kill Deployment Process",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
    destructiveHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/deployment.killProcess", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to kill deployment process", `Could not kill deployment "${input.deploymentId}"`);
    }
    return ResponseFormatter.success(`Successfully killed deployment "${input.deploymentId}"`, result.data);
  },
});
