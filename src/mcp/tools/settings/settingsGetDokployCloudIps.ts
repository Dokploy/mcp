import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetDokployCloudIps = createTool({
  name: "settings-get-dokploy-cloud-ips",
  description: "Gets the Dokploy Cloud IP addresses.",
  schema: z.object({}),
  annotations: {
    title: "Get Dokploy Cloud IPs",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.getDokployCloudIps");

    return ResponseFormatter.success(
      "Successfully fetched Dokploy Cloud IPs",
      response.data,
    );
  },
});
