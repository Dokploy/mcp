import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const redirectsUpdate = createTool({
  name: "redirects-update",
  description: "Updates an existing redirect rule in Dokploy.",
  schema: z.object({
    redirectId: z
      .string()
      .min(1)
      .describe("The ID of the redirect to update. Required."),
    regex: z
      .string()
      .min(1)
      .describe(
        "Regex pattern to match incoming request URLs. Uses Traefik regex syntax. Required."
      ),
    replacement: z
      .string()
      .min(1)
      .describe(
        "Replacement URL or path for matched requests. Can use capture groups from regex (e.g., $1). Required."
      ),
    permanent: z
      .boolean()
      .describe(
        "Whether this is a permanent redirect (HTTP 301) or temporary (HTTP 302). Required."
      ),
  }),
  annotations: {
    title: "Update Redirect",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/redirects.update", input);

    return ResponseFormatter.success(
      `Redirect "${input.redirectId}" updated successfully`,
      response.data,
    );
  },
});
