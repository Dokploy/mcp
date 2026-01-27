import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsToggleRequests = createTool({
  name: "settings-toggle-requests",
  description: "Toggles the activate requests feature in Dokploy.",
  schema: z.object({
    enable: z
      .boolean()
      .describe("Whether to enable or disable activate requests."),
  }),
  annotations: {
    title: "Toggle Requests",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.toggleRequests", input);

    return ResponseFormatter.success(
      `Activate requests ${input.enable ? "enabled" : "disabled"} successfully`,
      response.data,
    );
  },
});
