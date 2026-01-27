import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const dockerGetServiceContainersByAppName = createTool({
  name: "docker-get-service-containers-by-app-name",
  description: "Gets Docker service containers by app name in Dokploy.",
  schema: z.object({
    appName: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9.\-_]+$/)
      .describe("The app name to get service containers for."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to search on."),
  }),
  annotations: {
    title: "Get Docker Service Containers by App Name",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("appName", input.appName);
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }

    const response = await apiClient.get(
      `/docker.getServiceContainersByAppName?${params.toString()}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched service containers for app "${input.appName}"`,
      response.data,
    );
  },
});
