import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateWebServerTraefikConfig = createTool({
  name: "settings-update-web-server-traefik-config",
  description: "Updates the web server Traefik configuration in Dokploy.",
  schema: z.object({
    traefikConfig: z
      .string()
      .min(1)
      .describe(
        "The new web server Traefik configuration content. Must be at least 1 character.",
      ),
  }),
  annotations: {
    title: "Update Web Server Traefik Config",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.updateWebServerTraefikConfig",
      input,
    );

    return ResponseFormatter.success(
      "Web server Traefik configuration updated successfully",
      response.data,
    );
  },
});
