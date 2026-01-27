import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverOne = createTool({
  name: "server-one",
  description: "Gets a specific server by its ID in Dokploy.",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to retrieve."),
  }),
  annotations: {
    title: "Get Server Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/server.one?serverId=${input.serverId}`
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch server",
        `Server with ID "${input.serverId}" not found`
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched server "${input.serverId}"`,
      response.data
    );
  },
});
