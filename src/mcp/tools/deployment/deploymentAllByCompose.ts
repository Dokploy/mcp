import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const deploymentAllByCompose = createTool({
  name: "deployment-all-by-compose",
  description: "Gets all deployments for a specific compose project in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to get deployments for."),
  }),
  annotations: {
    title: "List Compose Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/deployment.allByCompose?composeId=${input.composeId}`
    );

    return ResponseFormatter.success(
      `Successfully fetched deployments for compose "${input.composeId}"`,
      response.data
    );
  },
});
