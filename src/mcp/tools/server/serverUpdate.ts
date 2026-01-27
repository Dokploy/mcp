import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverUpdate = createTool({
  name: "server-update",
  description: "Updates an existing server in Dokploy.",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to update."),
    name: z.string().min(1).describe("The name of the server."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("An optional description for the server."),
    ipAddress: z.string().describe("The IP address of the server."),
    port: z.number().describe("The SSH port of the server."),
    username: z.string().describe("The SSH username for the server."),
    sshKeyId: z
      .string()
      .nullable()
      .describe("The ID of the SSH key to use for authentication."),
    serverType: z
      .enum(["deploy", "build"])
      .describe("The type of server - 'deploy' for deployment or 'build' for building."),
    command: z
      .string()
      .optional()
      .describe("Custom command for the server."),
  }),
  annotations: {
    title: "Update Server",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/server.update", input);

    return ResponseFormatter.success(
      `Server "${input.serverId}" updated successfully`,
      response.data
    );
  },
});
