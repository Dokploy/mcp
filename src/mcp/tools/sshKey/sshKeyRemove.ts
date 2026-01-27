import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const sshKeyRemove = createTool({
  name: "ssh-key-remove",
  description: "Removes/deletes an SSH key from Dokploy.",
  schema: z.object({
    sshKeyId: z.string().describe("The unique identifier of the SSH key to remove. Required."),
  }),
  annotations: {
    title: "Remove SSH Key",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/sshKey.remove", input);

    return ResponseFormatter.success(
      `SSH key "${input.sshKeyId}" removed successfully`,
      response.data,
    );
  },
});
