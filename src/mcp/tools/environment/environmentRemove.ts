import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const environmentRemove = createTool({
  name: "environment-remove",
  description: "Removes/deletes an environment from Dokploy.",
  schema: z.object({
    environmentId: z
      .string()
      .min(1)
      .describe("The unique identifier of the environment to remove. Required."),
  }),
  annotations: {
    title: "Remove Environment",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/environment.remove", input);

    return ResponseFormatter.success(
      `Environment "${input.environmentId}" removed successfully`,
      response.data,
    );
  },
});
