import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsIsCloud = createTool({
  name: "settings-is-cloud",
  description: "Checks if the Dokploy instance is running in cloud mode.",
  schema: z.object({}),
  annotations: {
    title: "Check Cloud Mode",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.isCloud");

    return ResponseFormatter.success(
      "Successfully checked cloud mode status",
      response.data,
    );
  },
});
