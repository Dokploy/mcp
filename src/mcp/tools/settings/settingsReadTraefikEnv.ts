import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReadTraefikEnv = createTool({
  name: "settings-read-traefik-env",
  description: "Reads the Traefik environment variables in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to read env from a specific server."),
  }),
  annotations: {
    title: "Read Traefik Env",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = input.serverId ? `?serverId=${input.serverId}` : "";
    const response = await apiClient.get(`/settings.readTraefikEnv${params}`);

    return ResponseFormatter.success(
      "Successfully fetched Traefik environment",
      response.data,
    );
  },
});
