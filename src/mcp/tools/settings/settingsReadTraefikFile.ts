import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReadTraefikFile = createTool({
  name: "settings-read-traefik-file",
  description: "Reads a specific Traefik configuration file in Dokploy.",
  schema: z.object({
    path: z
      .string()
      .min(1)
      .describe(
        "The path of the Traefik file to read. Must be at least 1 character.",
      ),
    serverId: z
      .string()
      .optional()
      .describe(
        "Optional server ID to read the file from a specific remote server.",
      ),
  }),
  annotations: {
    title: "Read Traefik File",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams({ path: input.path });
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }
    const response = await apiClient.get(
      `/settings.readTraefikFile?${params.toString()}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched Traefik file "${input.path}"`,
      response.data,
    );
  },
});
