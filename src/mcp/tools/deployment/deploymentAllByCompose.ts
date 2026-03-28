import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentAllByCompose = createTool({
  name: "deployment-allByCompose",
  description: "Lists all deployments for a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose stack to list deployments for."),
  }),
  annotations: {
    title: "List Compose Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.get(`/deployment.allByCompose?composeId=${input.composeId}`);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch deployments", `Could not fetch deployments for compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully fetched deployments for compose stack "${input.composeId}"`, result.data);
  },
});
