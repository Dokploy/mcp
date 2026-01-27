import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const sshKeyOne = createTool({
  name: "ssh-key-one",
  description: "Gets a specific SSH key by its ID in Dokploy.",
  schema: z.object({
    sshKeyId: z.string().describe("The unique identifier of the SSH key to retrieve. Required."),
  }),
  annotations: {
    title: "Get SSH Key Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const sshKey = await apiClient.get(
      `/sshKey.one?sshKeyId=${input.sshKeyId}`,
    );

    if (!sshKey?.data) {
      return ResponseFormatter.error(
        "Failed to fetch SSH key",
        `SSH key with ID "${input.sshKeyId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched SSH key "${input.sshKeyId}"`,
      sshKey.data,
    );
  },
});
