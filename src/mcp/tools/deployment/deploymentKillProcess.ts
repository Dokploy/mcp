import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const deploymentKillProcess = createTool({
  name: "deployment-kill-process",
  description: "Kills/cancels a running deployment process in Dokploy.",
  schema: z.object({
    deploymentId: z
      .string()
      .min(1)
      .describe("The ID of the deployment to kill."),
  }),
  annotations: {
    title: "Kill Deployment Process",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/deployment.killProcess", input);

    return ResponseFormatter.success(
      `Deployment "${input.deploymentId}" process killed successfully`,
      response.data
    );
  },
});
