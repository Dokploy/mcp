import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentQueueList = createTool({
  name: "deployment-queueList",
  description: "Lists the deployment queue in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List Deployment Queue",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const result = await apiClient.get("/deployment.queueList");
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch deployment queue", "Could not fetch deployment queue");
    }
    return ResponseFormatter.success("Successfully fetched deployment queue", result.data);
  },
});
