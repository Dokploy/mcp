import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const rollbackDelete = createTool({
  name: "rollback-delete",
  description: "Deletes a rollback entry in Dokploy.",
  schema: z.object({
    rollbackId: z.string().min(1).describe("The unique identifier of the rollback entry to delete. Required."),
  }),
  annotations: {
    title: "Delete Rollback",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/rollback.delete", {
      rollbackId: input.rollbackId,
    });

    return ResponseFormatter.success(
      `Successfully deleted rollback "${input.rollbackId}"`,
      response.data,
    );
  },
});
