import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateDockerCleanup = createTool({
  name: "settings-update-docker-cleanup",
  description: "Updates Docker cleanup settings in Dokploy.",
  schema: z.object({
    enableDockerCleanup: z
      .boolean()
      .describe("Whether to enable automatic Docker cleanup."),
    serverId: z
      .string()
      .optional()
      .describe(
        "Optional server ID to update cleanup settings on a specific server.",
      ),
  }),
  annotations: {
    title: "Update Docker Cleanup Settings",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.updateDockerCleanup",
      input,
    );

    return ResponseFormatter.success(
      "Docker cleanup settings updated successfully",
      response.data,
    );
  },
});
