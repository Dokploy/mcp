import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReadWebServerTraefikConfig = createTool({
  name: "settings-read-web-server-traefik-config",
  description: "Reads the web server Traefik configuration in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Read Web Server Traefik Config",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get(
      "/settings.readWebServerTraefikConfig",
    );

    return ResponseFormatter.success(
      "Successfully fetched web server Traefik configuration",
      response.data,
    );
  },
});
