import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetUpdateData = createTool({
  name: "settings-get-update-data",
  description: "Gets update data for Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Update Data",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/settings.getUpdateData", {});

    return ResponseFormatter.success(
      "Successfully fetched update data",
      response.data,
    );
  },
});
