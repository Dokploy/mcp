import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const clusterRemoveWorker = createTool({
  name: "cluster-remove-worker",
  description: "Removes a worker node from the cluster in Dokploy.",
  schema: z.object({
    nodeId: z.string().describe("The ID of the worker node to remove."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to remove the worker from."),
  }),
  annotations: {
    title: "Remove Cluster Worker",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const body: Record<string, string> = { nodeId: input.nodeId };
    if (input.serverId) {
      body.serverId = input.serverId;
    }

    const response = await apiClient.post("/cluster.removeWorker", body);

    return ResponseFormatter.success(
      `Successfully removed worker node "${input.nodeId}" from cluster`,
      response.data,
    );
  },
});
