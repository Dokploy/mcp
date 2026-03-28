import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeDelete = createTool({
  name: "compose-delete",
  description: "Deletes an existing compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to delete."),
    deleteVolumes: z.boolean().describe("Whether to delete associated volumes."),
  }),
  annotations: {
    title: "Delete Compose Stack",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
    destructiveHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.delete", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to delete compose stack", `Could not delete compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully deleted compose stack "${input.composeId}"`, result.data);
  },
});
