import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanDockerBuilder = createTool({
  name: "settings-clean-docker-builder",
  description: "Cleans Docker builder cache in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe(
        "Optional server ID to clean builder cache on a specific server.",
      ),
  }),
  annotations: {
    title: "Clean Docker Builder",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.cleanDockerBuilder",
      input,
    );

    return ResponseFormatter.success(
      "Docker builder cache cleaned successfully",
      response.data,
    );
  },
});
