import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverSetup = createTool({
  name: "server-setup",
  description: "Sets up a server in Dokploy (installs required dependencies and configures the server).",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to set up."),
  }),
  annotations: {
    title: "Setup Server",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/server.setup", input);

    return ResponseFormatter.success(
      `Server "${input.serverId}" setup initiated successfully`,
      response.data
    );
  },
});
