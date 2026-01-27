import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetDokployVersion = createTool({
  name: "settings-get-dokploy-version",
  description: "Gets the current Dokploy version.",
  schema: z.object({}),
  annotations: {
    title: "Get Dokploy Version",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.getDokployVersion");

    return ResponseFormatter.success(
      "Successfully fetched Dokploy version",
      response.data,
    );
  },
});
