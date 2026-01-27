import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const clusterAddWorker = createTool({
  name: "cluster-add-worker",
  description:
    "Gets the command to add a worker node to the cluster in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to add the worker to."),
  }),
  annotations: {
    title: "Add Cluster Worker",
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
    const url = `/cluster.addWorker${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);

    return ResponseFormatter.success(
      "Successfully retrieved add worker command",
      response.data,
    );
  },
});
