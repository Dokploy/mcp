import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReadDirectories = createTool({
  name: "settings-read-directories",
  description: "Reads Traefik configuration directories in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe(
        "Optional server ID to read directories from a specific server.",
      ),
  }),
  annotations: {
    title: "Read Directories",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = input.serverId ? `?serverId=${input.serverId}` : "";
    const response = await apiClient.get(`/settings.readDirectories${params}`);

    return ResponseFormatter.success(
      "Successfully fetched directories",
      response.data,
    );
  },
});
