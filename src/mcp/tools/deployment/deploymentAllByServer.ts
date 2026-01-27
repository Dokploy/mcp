import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const deploymentAllByServer = createTool({
  name: "deployment-all-by-server",
  description: "Gets all deployments for a specific server in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .min(1)
      .describe("The ID of the server to get deployments for."),
  }),
  annotations: {
    title: "List Server Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/deployment.allByServer?serverId=${input.serverId}`
    );

    return ResponseFormatter.success(
      `Successfully fetched deployments for server "${input.serverId}"`,
      response.data
    );
  },
});
