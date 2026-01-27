import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeDelete = createTool({
  name: "compose-delete",
  description: "Deletes a Docker Compose project in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to delete."),
    deleteVolumes: z
      .boolean()
      .describe("Whether to delete associated volumes."),
  }),
  annotations: {
    title: "Delete Compose Project",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.delete", input);

    return ResponseFormatter.success(
      `Compose project "${input.composeId}" deleted successfully`,
      response.data,
    );
  },
});
