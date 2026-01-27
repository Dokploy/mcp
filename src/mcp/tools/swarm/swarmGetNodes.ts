import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const swarmGetNodes = createTool({
  name: "swarm-get-nodes",
  description: "Gets all nodes in the Docker Swarm from Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to get swarm nodes from."),
  }),
  annotations: {
    title: "Get Swarm Nodes",
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
    const url = `/swarm.getNodes${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);

    return ResponseFormatter.success(
      "Successfully fetched swarm nodes",
      response.data,
    );
  },
});
