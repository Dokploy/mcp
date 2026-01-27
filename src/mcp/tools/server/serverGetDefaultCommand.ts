import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverGetDefaultCommand = createTool({
  name: "server-get-default-command",
  description: "Gets the default command for a specific server in Dokploy.",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to get the default command for."),
  }),
  annotations: {
    title: "Get Server Default Command",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/server.getDefaultCommand?serverId=${input.serverId}`
    );

    return ResponseFormatter.success(
      `Successfully fetched default command for server "${input.serverId}"`,
      response.data
    );
  },
});
