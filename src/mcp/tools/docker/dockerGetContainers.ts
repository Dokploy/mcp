import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const dockerGetContainers = createTool({
  name: "docker-get-containers",
  description: "Gets all Docker containers from Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to get containers from."),
  }),
  annotations: {
    title: "Get Docker Containers",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    if (input.serverId) {
      params.append("serverId", input.serverId);
    }

    const queryString = params.toString();
    const url = `/docker.getContainers${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);

    return ResponseFormatter.success(
      "Successfully fetched Docker containers",
      response.data,
    );
  },
});
