import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsToggleDashboard = createTool({
  name: "settings-toggle-dashboard",
  description: "Toggles the Traefik dashboard in Dokploy.",
  schema: z.object({
    enableDashboard: z
      .boolean()
      .optional()
      .describe("Whether to enable or disable the dashboard."),
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to toggle dashboard on a specific server."),
  }),
  annotations: {
    title: "Toggle Dashboard",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.toggleDashboard", input);

    return ResponseFormatter.success(
      "Dashboard toggled successfully",
      response.data,
    );
  },
});
