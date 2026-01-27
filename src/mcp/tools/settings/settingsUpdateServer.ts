import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateServer = createTool({
  name: "settings-update-server",
  description: "Updates the Dokploy server to the latest version.",
  schema: z.object({}),
  annotations: {
    title: "Update Server",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/settings.updateServer", {});

    return ResponseFormatter.success(
      "Server update initiated successfully",
      response.data,
    );
  },
});
