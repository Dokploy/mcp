import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const environmentByProjectId = createTool({
  name: "environment-by-project-id",
  description: "Gets all environments for a specific project in Dokploy.",
  schema: z.object({
    projectId: z
      .string()
      .describe("The project ID to list environments for. Required."),
  }),
  annotations: {
    title: "List Environments by Project",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const environments = await apiClient.get(
      `/environment.byProjectId?projectId=${input.projectId}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched environments for project "${input.projectId}"`,
      environments.data,
    );
  },
});
