import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanUnusedVolumes = createTool({
  name: "settings-clean-unused-volumes",
  description: "Cleans unused Docker volumes in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to clean volumes on a specific server."),
  }),
  annotations: {
    title: "Clean Unused Volumes",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.cleanUnusedVolumes",
      input,
    );

    return ResponseFormatter.success(
      "Unused volumes cleaned successfully",
      response.data,
    );
  },
});
