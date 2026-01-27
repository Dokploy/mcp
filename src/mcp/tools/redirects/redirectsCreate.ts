import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const redirectsCreate = createTool({
  name: "redirects-create",
  description: "Creates a new redirect rule for an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .describe("The ID of the application to add the redirect to. Required."),
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
    title: "Create Redirect",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/redirects.create", input);

    return ResponseFormatter.success(
      `Redirect rule created successfully`,
      response.data,
    );
  },
});
