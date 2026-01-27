import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateTraefikFile = createTool({
  name: "settings-update-traefik-file",
  description: "Updates a specific Traefik configuration file in Dokploy.",
  schema: z.object({
    path: z
      .string()
      .min(1)
      .describe(
        "The path of the Traefik file to update. Must be at least 1 character.",
      ),
    traefikConfig: z
      .string()
      .min(1)
      .describe(
        "The new Traefik configuration content. Must be at least 1 character.",
      ),
    serverId: z
      .string()
      .optional()
      .describe(
        "Optional server ID to update the file on a specific remote server.",
      ),
  }),
  annotations: {
    title: "Update Traefik File",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.updateTraefikFile", input);

    return ResponseFormatter.success(
      `Traefik file "${input.path}" updated successfully`,
      response.data,
    );
  },
});
