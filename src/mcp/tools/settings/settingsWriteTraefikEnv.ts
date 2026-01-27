import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsWriteTraefikEnv = createTool({
  name: "settings-write-traefik-env",
  description: "Writes the Traefik environment variables in Dokploy.",
  schema: z.object({
    env: z
      .string()
      .describe(
        "The Traefik environment variables content in KEY=value format. Required field.",
      ),
    serverId: z
      .string()
      .optional()
      .describe(
        "Optional server ID to write environment variables on a specific server.",
      ),
  }),
  annotations: {
    title: "Write Traefik Env",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.writeTraefikEnv", input);

    return ResponseFormatter.success(
      "Traefik environment updated successfully",
      response.data,
    );
  },
});
