import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentAllByServer = createTool({
  name: "deployment-allByServer",
  description: "Lists all deployments for a server in Dokploy.",
  schema: z.object({
    serverId: z.string().describe("The ID of the server to list deployments for."),
  }),
  annotations: {
    title: "List Server Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.get(`/deployment.allByServer?serverId=${input.serverId}`);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch deployments", `Could not fetch deployments for server "${input.serverId}"`);
    }
    return ResponseFormatter.success(`Successfully fetched deployments for server "${input.serverId}"`, result.data);
  },
});
