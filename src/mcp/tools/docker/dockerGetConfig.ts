import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const dockerGetConfig = createTool({
  name: "docker-get-config",
  description: "Gets the configuration of a Docker container in Dokploy.",
  schema: z.object({
    containerId: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9.\-_]+$/)
      .describe("The ID of the container to get configuration for."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server where the container is running."),
  }),
  annotations: {
    title: "Get Docker Container Config",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("containerId", input.containerId);
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }

    const response = await apiClient.get(
      `/docker.getConfig?${params.toString()}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched config for container "${input.containerId}"`,
      response.data,
    );
  },
});
