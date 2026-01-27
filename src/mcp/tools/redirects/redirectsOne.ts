import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const redirectsOne = createTool({
  name: "redirects-one",
  description: "Gets a specific redirect rule by its ID in Dokploy.",
  schema: z.object({
    redirectId: z
      .string()
      .min(1)
      .describe("The unique identifier of the redirect rule to retrieve. Required."),
  }),
  annotations: {
    title: "Get Redirect Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const redirect = await apiClient.get(
      `/redirects.one?redirectId=${input.redirectId}`,
    );

    if (!redirect?.data) {
      return ResponseFormatter.error(
        "Failed to fetch redirect",
        `Redirect with ID "${input.redirectId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched redirect "${input.redirectId}"`,
      redirect.data,
    );
  },
});
