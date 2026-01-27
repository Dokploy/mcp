import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeFetchSourceType = createTool({
  name: "compose-fetchSourceType",
  description:
    "Fetches and updates the source type for a compose project based on its configuration.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to fetch source type for."),
  }),
  annotations: {
    title: "Fetch Compose Source Type",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.fetchSourceType", input);

    return ResponseFormatter.success(
      `Source type fetched successfully for compose project "${input.composeId}"`,
      response.data,
    );
  },
});
