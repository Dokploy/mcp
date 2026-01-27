import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const destinationRemove = createTool({
  name: "destination-remove",
  description: "Removes/deletes a backup destination from Dokploy.",
  schema: z.object({
    destinationId: z
      .string()
      .describe("The unique identifier of the backup destination to remove. Required."),
  }),
  annotations: {
    title: "Remove Destination",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/destination.remove", input);

    return ResponseFormatter.success(
      `Destination "${input.destinationId}" removed successfully`,
      response.data,
    );
  },
});
