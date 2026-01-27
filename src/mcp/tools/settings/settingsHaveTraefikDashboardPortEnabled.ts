import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsHaveTraefikDashboardPortEnabled = createTool({
  name: "settings-have-traefik-dashboard-port-enabled",
  description: "Checks if the Traefik dashboard port is enabled in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to check on a specific server."),
  }),
  annotations: {
    title: "Check Traefik Dashboard Port",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = input.serverId ? `?serverId=${input.serverId}` : "";
    const response = await apiClient.get(
      `/settings.haveTraefikDashboardPortEnabled${params}`,
    );

    return ResponseFormatter.success(
      "Successfully checked Traefik dashboard port status",
      response.data,
    );
  },
});
