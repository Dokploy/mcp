import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCheckGPUStatus = createTool({
  name: "settings-check-gpu-status",
  description: "Checks the GPU status in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to check GPU status on a specific server."),
  }),
  annotations: {
    title: "Check GPU Status",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = input.serverId ? `?serverId=${input.serverId}` : "";
    const response = await apiClient.get(`/settings.checkGPUStatus${params}`);

    return ResponseFormatter.success(
      "Successfully fetched GPU status",
      response.data,
    );
  },
});
