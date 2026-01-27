import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsSetupGPU = createTool({
  name: "settings-setup-gpu",
  description: "Sets up GPU support in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to setup GPU on a specific server."),
  }),
  annotations: {
    title: "Setup GPU",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.setupGPU", input);

    return ResponseFormatter.success(
      "GPU setup completed successfully",
      response.data,
    );
  },
});
