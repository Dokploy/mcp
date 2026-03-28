import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const deploymentAllCentralized = createTool({
  name: "deployment-allCentralized",
  description: "Lists all centralized deployments in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List All Centralized Deployments",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const result = await apiClient.get("/deployment.allCentralized");
    if (!result?.data) {
      return ResponseFormatter.error("Failed to fetch centralized deployments", "Could not fetch centralized deployments");
    }
    return ResponseFormatter.success("Successfully fetched centralized deployments", result.data);
  },
});
