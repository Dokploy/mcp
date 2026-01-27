import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const environmentUpdate = createTool({
  name: "environment-update",
  description: "Updates an existing environment in Dokploy.",
  schema: z.object({
    environmentId: z
      .string()
      .min(1)
      .describe("The ID of the environment to update. Required."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("New name for the environment."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("New description for the environment."),
    createdAt: z
      .string()
      .optional()
      .describe("Creation timestamp (ISO 8601 format)."),
    env: z
      .string()
      .optional()
      .describe("Environment variables in KEY=value format, one per line."),
    projectId: z
      .string()
      .optional()
      .describe("Project ID to move the environment to."),
  }),
  annotations: {
    title: "Update Environment",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/environment.update", input);

    return ResponseFormatter.success(
      `Environment "${input.environmentId}" updated successfully`,
      response.data,
    );
  },
});
