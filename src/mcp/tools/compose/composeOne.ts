import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeOne = createTool({
  name: "compose-one",
  description: "Gets a specific compose service by its ID in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose service to retrieve."),
  }),
  annotations: {
    title: "Get Compose Service Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const compose = await apiClient.get(
      `/compose.one?composeId=${input.composeId}`
    );

    if (!compose?.data) {
      return ResponseFormatter.error(
        "Failed to fetch compose service",
        `Compose service with ID "${input.composeId}" not found`
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched compose service "${input.composeId}"`,
      compose.data
    );
  },
});
