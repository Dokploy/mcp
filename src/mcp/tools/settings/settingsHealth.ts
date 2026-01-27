import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsHealth = createTool({
  name: "settings-health",
  description: "Gets the health status of the Dokploy server.",
  schema: z.object({}),
  annotations: {
    title: "Check Health",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.health");

    return ResponseFormatter.success(
      "Successfully fetched health status",
      response.data,
    );
  },
});
