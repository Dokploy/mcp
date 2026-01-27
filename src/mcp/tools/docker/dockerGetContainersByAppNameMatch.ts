import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const dockerGetContainersByAppNameMatch = createTool({
  name: "docker-get-containers-by-app-name-match",
  description:
    "Gets Docker containers matching an app name pattern in Dokploy.",
  schema: z.object({
    appName: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9.\-_]+$/)
      .describe("The app name pattern to match containers against."),
    appType: z
      .enum(["stack", "docker-compose"])
      .optional()
      .describe("The type of app to filter by ('stack' for Docker Swarm stacks or 'docker-compose' for Compose projects)."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to search on."),
  }),
  annotations: {
    title: "Get Docker Containers by App Name Match",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("appName", input.appName);
    if (input.appType) {
      params.append("appType", input.appType);
    }
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }

    const response = await apiClient.get(
      `/docker.getContainersByAppNameMatch?${params.toString()}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched containers matching app name "${input.appName}"`,
      response.data,
    );
  },
});
