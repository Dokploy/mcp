import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanMonitoring = createTool({
  name: "settings-clean-monitoring",
  description: "Cleans monitoring data in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Clean Monitoring Data",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/settings.cleanMonitoring", {});

    return ResponseFormatter.success(
      "Monitoring data cleaned successfully",
      response.data,
    );
  },
});
