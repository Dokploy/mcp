import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsReloadRedis = createTool({
  name: "settings-reload-redis",
  description: "Reloads Redis in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Reload Redis",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/settings.reloadRedis", {});

    return ResponseFormatter.success(
      "Redis reloaded successfully",
      response.data,
    );
  },
});
