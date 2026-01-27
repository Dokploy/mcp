import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const securityUpdate = createTool({
  name: "security-update",
  description:
    "Updates an existing security entry (HTTP basic auth configuration) in Dokploy.",
  schema: z.object({
    securityId: z
      .string()
      .min(1)
      .describe(
        "The ID of the security entry to update. Must be at least 1 character.",
      ),
    username: z
      .string()
      .min(1)
      .describe(
        "The new username for HTTP basic auth. Must be at least 1 character.",
      ),
    password: z
      .string()
      .min(1)
      .describe(
        "The new password for HTTP basic auth. Must be at least 1 character.",
      ),
  }),
  annotations: {
    title: "Update Security Entry",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/security.update", input);

    return ResponseFormatter.success(
      `Security entry "${input.securityId}" updated successfully`,
      response.data,
    );
  },
});
