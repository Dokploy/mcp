import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanAll = createTool({
  name: "settings-clean-all",
  description:
    "Cleans all Docker resources (images, volumes, containers, builder cache) in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe(
        "Optional server ID to clean all resources on a specific server.",
      ),
  }),
  annotations: {
    title: "Clean All Docker Resources",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.cleanAll", input);

    return ResponseFormatter.success(
      "All Docker resources cleaned successfully",
      response.data,
    );
  },
});
