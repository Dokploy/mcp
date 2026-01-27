import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const swarmGetNodeApps = createTool({
  name: "swarm-get-node-apps",
  description: "Gets all applications deployed on swarm nodes in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to get node apps from."),
  }),
  annotations: {
    title: "Get Swarm Node Apps",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }

    const queryString = params.toString();
    const url = `/swarm.getNodeApps${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);

    return ResponseFormatter.success(
      "Successfully fetched swarm node apps",
      response.data,
    );
  },
});
