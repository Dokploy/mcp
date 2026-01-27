import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const environmentCreate = createTool({
  name: "environment-create",
  description: "Creates a new environment within a project in Dokploy.",
  schema: z.object({
    name: z
      .string()
      .min(1)
      .describe("Name for the environment (e.g., 'production', 'staging', 'development'). Required."),
    projectId: z
      .string()
      .describe("The ID of the project to create the environment in. Required."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("Description of the environment's purpose or configuration."),
  }),
  annotations: {
    title: "Create Environment",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/environment.create", input);

    return ResponseFormatter.success(
      `Environment "${input.name}" created successfully`,
      response.data,
    );
  },
});
