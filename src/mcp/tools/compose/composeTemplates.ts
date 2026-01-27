import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeTemplates = createTool({
  name: "compose-templates",
  description: "Gets the list of available compose templates.",
  schema: z.object({
    baseUrl: z
      .string()
      .optional()
      .describe("Optional base URL for template repository."),
  }),
  annotations: {
    title: "List Compose Templates",
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
      ? `/compose.templates?${queryString}`
      : "/compose.templates";

    const templates = await apiClient.get(url);

    if (!templates?.data) {
      return ResponseFormatter.error(
        "Failed to fetch templates",
        "Could not retrieve compose templates",
      );
    }

    return ResponseFormatter.success(
      "Successfully retrieved compose templates",
      templates.data,
    );
  },
});
