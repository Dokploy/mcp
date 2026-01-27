import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverSecurity = createTool({
  name: "server-security",
  description: "Gets security information for a specific server in Dokploy.",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to get security info for."),
  }),
  annotations: {
    title: "Get Server Security Info",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/server.security?serverId=${input.serverId}`
    );

    return ResponseFormatter.success(
      `Successfully fetched security info for server "${input.serverId}"`,
      response.data
    );
  },
});
