import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverCreate = createTool({
  name: "server-create",
  description: "Creates a new server in Dokploy.",
  schema: z.object({
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
  }),
  annotations: {
    title: "Create Server",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/server.create", input);

    return ResponseFormatter.success(
      `Server "${input.name}" created successfully`,
      response.data
    );
  },
});
