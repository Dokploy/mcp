import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetTraefikPorts = createTool({
  name: "settings-get-traefik-ports",
  description: "Gets the Traefik ports configuration in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to get ports from a specific server."),
  }),
  annotations: {
    title: "Get Traefik Ports",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = input.serverId ? `?serverId=${input.serverId}` : "";
    const response = await apiClient.get(`/settings.getTraefikPorts${params}`);

    return ResponseFormatter.success(
      "Successfully fetched Traefik ports",
      response.data,
    );
  },
});
