import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const securityDelete = createTool({
  name: "security-delete",
  description:
    "Deletes a security entry (HTTP basic auth configuration) from Dokploy.",
  schema: z.object({
    securityId: z
      .string()
      .min(1)
      .describe(
        "The ID of the security entry to delete. Must be at least 1 character.",
      ),
  }),
  annotations: {
    title: "Delete Security Entry",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/security.delete", input);

    return ResponseFormatter.success(
      `Security entry "${input.securityId}" deleted successfully`,
      response.data,
    );
  },
});
