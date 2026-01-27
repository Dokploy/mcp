import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const destinationOne = createTool({
  name: "destination-one",
  description: "Gets a specific backup destination by its ID in Dokploy.",
  schema: z.object({
    destinationId: z
      .string()
      .describe("The unique identifier of the backup destination to retrieve. Required."),
  }),
  annotations: {
    title: "Get Destination Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const destination = await apiClient.get(
      `/destination.one?destinationId=${input.destinationId}`,
    );

    if (!destination?.data) {
      return ResponseFormatter.error(
        "Failed to fetch destination",
        `Destination with ID "${input.destinationId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched destination "${input.destinationId}"`,
      destination.data,
    );
  },
});
