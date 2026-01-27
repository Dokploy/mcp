import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanDockerPrune = createTool({
  name: "settings-clean-docker-prune",
  description: "Runs Docker system prune in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to run prune on a specific server."),
  }),
  annotations: {
    title: "Docker Prune",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.cleanDockerPrune", input);

    return ResponseFormatter.success(
      "Docker prune completed successfully",
      response.data,
    );
  },
});
