import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeDeploy = createTool({
  name: "compose-deploy",
  description: "Deploy a compose stack by creating a new deployment.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose to deploy."),
    title: z.string().optional().describe("Title for the deployment."),
    description: z.string().optional().describe("Description for the deployment."),
  }),
  annotations: {
    title: "Deploy Compose",
    destructiveHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.deploy", input);

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to deploy compose",
        `Could not deploy compose "${input.composeId}"`
      );
    }

    return ResponseFormatter.success(
      `Compose "${input.composeId}" deployed successfully`,
      response.data
    );
  },
});
