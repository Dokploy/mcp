import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanUnusedImages = createTool({
  name: "settings-clean-unused-images",
  description: "Cleans unused Docker images in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to clean images on a specific server."),
  }),
  annotations: {
    title: "Clean Unused Images",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.cleanUnusedImages", input);

    return ResponseFormatter.success(
      "Unused images cleaned successfully",
      response.data,
    );
  },
});
