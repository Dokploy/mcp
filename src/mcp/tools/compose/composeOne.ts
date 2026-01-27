import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeOne = createTool({
  name: "compose-one",
  description: "Gets a specific Docker Compose project by its ID in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to retrieve."),
  }),
  annotations: {
    title: "Get Compose Project Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const compose = await apiClient.get(
      `/compose.one?composeId=${input.composeId}`,
    );

    if (!compose?.data) {
      return ResponseFormatter.error(
        "Failed to fetch compose project",
        `Compose project with ID "${input.composeId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched compose project "${input.composeId}"`,
      compose.data,
    );
  },
});
