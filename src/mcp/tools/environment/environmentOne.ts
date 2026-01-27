import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const environmentOne = createTool({
  name: "environment-one",
  description: "Gets a specific environment by its ID in Dokploy.",
  schema: z.object({
    environmentId: z
      .string()
      .min(1)
      .describe("The unique identifier of the environment to retrieve. Required."),
  }),
  annotations: {
    title: "Get Environment Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const environment = await apiClient.get(
      `/environment.one?environmentId=${input.environmentId}`,
    );

    if (!environment?.data) {
      return ResponseFormatter.error(
        "Failed to fetch environment",
        `Environment with ID "${input.environmentId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched environment "${input.environmentId}"`,
      environment.data,
    );
  },
});
