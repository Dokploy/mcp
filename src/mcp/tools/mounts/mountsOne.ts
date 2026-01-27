import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mountsOne = createTool({
  name: "mounts-one",
  description:
    "Retrieves detailed information about a specific mount by its ID. Returns the mount type, paths, content (for file mounts), and associated service information.",
  schema: z.object({
    mountId: z
      .string()
      .describe("The unique identifier of the mount to retrieve. Required."),
  }),
  annotations: {
    title: "Get Mount",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/mounts.one?mountId=${input.mountId}`
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch mount",
        `Mount with ID "${input.mountId}" not found`
      );
    }

    return ResponseFormatter.success(
      `Successfully retrieved mount ${input.mountId}`,
      response.data
    );
  },
});
