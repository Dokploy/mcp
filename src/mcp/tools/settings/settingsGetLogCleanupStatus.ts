import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetLogCleanupStatus = createTool({
  name: "settings-get-log-cleanup-status",
  description: "Gets the log cleanup status in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Log Cleanup Status",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.getLogCleanupStatus");

    return ResponseFormatter.success(
      "Successfully fetched log cleanup status",
      response.data,
    );
  },
});
