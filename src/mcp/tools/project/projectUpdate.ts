import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const projectUpdate = createTool({
  name: "project-update",
  description:
    "Updates an existing project in Dokploy. Only provide the fields you want to update. System fields like createdAt and organizationId are typically not modified.",
  schema: z.object({
    projectId: z.string().min(1).describe("The ID of the project to update."),
    name: z.string().min(1).optional().describe("The new name of the project."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("The new description for the project."),
    createdAt: z
      .string()
      .optional()
      .describe("The creation date of the project."),
    organizationId: z
      .string()
      .optional()
      .describe("The organization ID of the project."),
    env: z
      .string()
      .optional()
      .describe("Environment variables for the project."),
  }),
  annotations: {
    title: "Update Project",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/project.update", input);

    return ResponseFormatter.success(
      `Project "${input.projectId}" updated successfully`,
      response.data
    );
  },
});
