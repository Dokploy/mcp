import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const rollbackRollback = createTool({
  name: "rollback-rollback",
  description: "Performs a rollback to a previous deployment in Dokploy.",
  schema: z.object({
    rollbackId: z
      .string()
      .min(1)
      .describe("The unique identifier of the rollback to execute. This will restore the application to the state captured in this rollback. Required."),
  }),
  annotations: {
    title: "Execute Rollback",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/rollback.rollback", {
      rollbackId: input.rollbackId,
    });

    return ResponseFormatter.success(
      `Successfully executed rollback "${input.rollbackId}"`,
      response.data,
    );
  },
});
