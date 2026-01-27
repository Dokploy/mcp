import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateTraefikConfig = createTool({
  name: "settings-update-traefik-config",
  description: "Updates the main Traefik configuration in Dokploy.",
  schema: z.object({
    traefikConfig: z
      .string()
      .min(1)
      .describe(
        "The new Traefik configuration content. Must be at least 1 character.",
      ),
  }),
  annotations: {
    title: "Update Traefik Config",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.updateTraefikConfig",
      input,
    );

    return ResponseFormatter.success(
      "Traefik configuration updated successfully",
      response.data,
    );
  },
});
