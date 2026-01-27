import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const sshKeyUpdate = createTool({
  name: "ssh-key-update",
  description: "Updates an existing SSH key in Dokploy.",
  schema: z.object({
    sshKeyId: z.string().describe("The unique identifier of the SSH key to update. Required."),
    name: z.string().min(1).optional().describe("The new name of the SSH key. Optional."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("The new description for the SSH key. Optional, can be set to null to remove."),
    lastUsedAt: z
      .string()
      .nullable()
      .optional()
      .describe("The last used timestamp in ISO format. Optional, can be set to null."),
  }),
  annotations: {
    title: "Update SSH Key",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/sshKey.update", input);

    return ResponseFormatter.success(
      `SSH key "${input.sshKeyId}" updated successfully`,
      response.data,
    );
  },
});
