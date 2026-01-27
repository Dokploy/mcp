import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const environmentDuplicate = createTool({
  name: "environment-duplicate",
  description: "Duplicates an existing environment in Dokploy.",
  schema: z.object({
    environmentId: z
      .string()
      .min(1)
      .describe("The ID of the source environment to duplicate. Required."),
    name: z
      .string()
      .min(1)
      .describe("Name for the new duplicated environment. Required."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("Description for the new duplicated environment. Inherited from source if not specified."),
  }),
  annotations: {
    title: "Duplicate Environment",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/environment.duplicate", input);

    return ResponseFormatter.success(
      `Environment "${input.environmentId}" duplicated successfully as "${input.name}"`,
      response.data,
    );
  },
});
