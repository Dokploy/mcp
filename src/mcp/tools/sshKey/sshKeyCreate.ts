import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const sshKeyCreate = createTool({
  name: "ssh-key-create",
  description: "Creates a new SSH key in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the SSH key. Required."),
    privateKey: z.string().describe("The private SSH key content (PEM format). Required."),
    publicKey: z.string().describe("The public SSH key content. Required."),
    organizationId: z.string().describe("The organization ID to associate this key with. Required."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("An optional description for the SSH key."),
  }),
  annotations: {
    title: "Create SSH Key",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/sshKey.create", input);

    return ResponseFormatter.success(
      `SSH key "${input.name}" created successfully`,
      response.data,
    );
  },
});
