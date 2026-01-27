import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverRemove = createTool({
  name: "server-remove",
  description: "Removes/deletes a server from Dokploy.",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to remove."),
  }),
  annotations: {
    title: "Remove Server",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/server.remove", input);

    return ResponseFormatter.success(
      `Server "${input.serverId}" removed successfully`,
      response.data
    );
  },
});
