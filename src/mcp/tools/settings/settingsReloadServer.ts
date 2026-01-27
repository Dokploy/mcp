import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReloadServer = createTool({
  name: "settings-reload-server",
  description: "Reloads the Dokploy server.",
  schema: z.object({}),
  annotations: {
    title: "Reload Server",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/settings.reloadServer", {});

    return ResponseFormatter.success(
      "Server reloaded successfully",
      response.data,
    );
  },
});
