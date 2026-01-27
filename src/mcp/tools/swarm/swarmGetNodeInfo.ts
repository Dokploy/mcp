import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const swarmGetNodeInfo = createTool({
  name: "swarm-get-node-info",
  description:
    "Gets detailed information about a specific swarm node in Dokploy.",
  schema: z.object({
    nodeId: z.string().describe("The ID of the node to get information for."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to get node info from."),
  }),
  annotations: {
    title: "Get Swarm Node Info",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("nodeId", input.nodeId);
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }

    const response = await apiClient.get(
      `/swarm.getNodeInfo?${params.toString()}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched info for swarm node "${input.nodeId}"`,
      response.data,
    );
  },
});
