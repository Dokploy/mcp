import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetIp = createTool({
  name: "settings-get-ip",
  description: "Gets the IP address of the Dokploy server.",
  schema: z.object({}),
  annotations: {
    title: "Get Server IP",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.getIp");

    return ResponseFormatter.success(
      "Successfully fetched server IP",
      response.data,
    );
  },
});
