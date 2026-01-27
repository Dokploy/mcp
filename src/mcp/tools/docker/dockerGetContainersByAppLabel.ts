import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const dockerGetContainersByAppLabel = createTool({
  name: "docker-get-containers-by-app-label",
  description: "Gets Docker containers by app label in Dokploy.",
  schema: z.object({
    appName: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9.\-_]+$/)
      .describe("The app name to search for."),
    type: z
      .enum(["standalone", "swarm"])
      .describe("The deployment type (standalone or swarm)."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to search on."),
  }),
  annotations: {
    title: "Get Docker Containers by App Label",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("appName", input.appName);
    params.append("type", input.type);
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }

    const response = await apiClient.get(
      `/docker.getContainersByAppLabel?${params.toString()}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched containers for app "${input.appName}" with type "${input.type}"`,
      response.data,
    );
  },
});
