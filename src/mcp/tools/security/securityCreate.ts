import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const securityCreate = createTool({
  name: "security-create",
  description:
    "Creates a new security entry (HTTP basic auth) for an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .describe(
        "The ID of the application to add HTTP basic authentication to.",
      ),
    username: z
      .string()
      .min(1)
      .describe(
        "The username for HTTP basic auth. Must be at least 1 character.",
      ),
    password: z
      .string()
      .min(1)
      .describe(
        "The password for HTTP basic auth. Must be at least 1 character.",
      ),
  }),
  annotations: {
    title: "Create Security Entry",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/security.create", input);

    return ResponseFormatter.success(
      `Security entry created for application "${input.applicationId}"`,
      response.data,
    );
  },
});
