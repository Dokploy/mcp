import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanRedis = createTool({
  name: "settings-clean-redis",
  description: "Cleans Redis cache in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Clean Redis",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/settings.cleanRedis", {});

    return ResponseFormatter.success(
      "Redis cleaned successfully",
      response.data,
    );
  },
});
