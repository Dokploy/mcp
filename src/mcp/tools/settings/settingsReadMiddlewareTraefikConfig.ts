import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReadMiddlewareTraefikConfig = createTool({
  name: "settings-read-middleware-traefik-config",
  description: "Reads the middleware Traefik configuration in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Read Middleware Traefik Config",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get(
      "/settings.readMiddlewareTraefikConfig",
    );

    return ResponseFormatter.success(
      "Successfully fetched middleware Traefik configuration",
      response.data,
    );
  },
});
