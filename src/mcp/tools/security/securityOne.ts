import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const securityOne = createTool({
  name: "security-one",
  description:
    "Gets a specific security entry (HTTP basic auth configuration) by its ID in Dokploy.",
  schema: z.object({
    securityId: z
      .string()
      .min(1)
      .describe(
        "The ID of the security entry to retrieve. Must be at least 1 character.",
      ),
  }),
  annotations: {
    title: "Get Security Entry Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/security.one?securityId=${input.securityId}`,
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch security entry",
        `Security entry with ID "${input.securityId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched security entry "${input.securityId}"`,
      response.data,
    );
  },
});
