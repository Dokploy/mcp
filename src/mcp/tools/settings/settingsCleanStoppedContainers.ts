import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanStoppedContainers = createTool({
  name: "settings-clean-stopped-containers",
  description: "Cleans stopped Docker containers in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to clean containers on a specific server."),
  }),
  annotations: {
    title: "Clean Stopped Containers",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.cleanStoppedContainers",
      input,
    );

    return ResponseFormatter.success(
      "Stopped containers cleaned successfully",
      response.data,
    );
  },
});
