import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReadTraefikConfig = createTool({
  name: "settings-read-traefik-config",
  description: "Reads the Traefik configuration in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Read Traefik Config",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.readTraefikConfig");

    return ResponseFormatter.success(
      "Successfully fetched Traefik configuration",
      response.data,
    );
  },
});
