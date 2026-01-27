import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReloadTraefik = createTool({
  name: "settings-reload-traefik",
  description: "Reloads Traefik in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to reload Traefik on a specific server."),
  }),
  annotations: {
    title: "Reload Traefik",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.reloadTraefik", input);

    return ResponseFormatter.success(
      "Traefik reloaded successfully",
      response.data,
    );
  },
});
