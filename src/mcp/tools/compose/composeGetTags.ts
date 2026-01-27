import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeGetTags = createTool({
  name: "compose-getTags",
  description: "Gets the list of available tags for compose templates.",
  schema: z.object({
    baseUrl: z
      .string()
      .optional()
      .describe("Optional base URL for template repository."),
  }),
  annotations: {
    title: "Get Compose Template Tags",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    if (input.baseUrl) {
      params.append("baseUrl", input.baseUrl);
    }

    const queryString = params.toString();
    const url = queryString
      ? `/compose.getTags?${queryString}`
      : "/compose.getTags";

    const tags = await apiClient.get(url);

    if (!tags?.data) {
      return ResponseFormatter.error(
        "Failed to fetch tags",
        "Could not retrieve compose template tags",
      );
    }

    return ResponseFormatter.success(
      "Successfully retrieved compose template tags",
      tags.data,
    );
  },
});
