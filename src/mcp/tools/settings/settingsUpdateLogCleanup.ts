import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateLogCleanup = createTool({
  name: "settings-update-log-cleanup",
  description: "Updates log cleanup settings in Dokploy.",
  schema: z.object({
    cronExpression: z
      .string()
      .nullable()
      .describe(
        "Cron expression for log cleanup schedule. Set to null to disable.",
      ),
  }),
  annotations: {
    title: "Update Log Cleanup",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.updateLogCleanup", input);

    return ResponseFormatter.success(
      "Log cleanup settings updated successfully",
      response.data,
    );
  },
});
