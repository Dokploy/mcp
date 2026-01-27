import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateMiddlewareTraefikConfig = createTool({
  name: "settings-update-middleware-traefik-config",
  description: "Updates the middleware Traefik configuration in Dokploy.",
  schema: z.object({
    traefikConfig: z
      .string()
      .min(1)
      .describe(
        "The new middleware Traefik configuration content. Must be at least 1 character.",
      ),
  }),
  annotations: {
    title: "Update Middleware Traefik Config",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.updateMiddlewareTraefikConfig",
      input,
    );

    return ResponseFormatter.success(
      "Middleware Traefik configuration updated successfully",
      response.data,
    );
  },
});
