import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationCreate = createTool({
  name: "organization-create",
  description: "Creates a new organization in Dokploy.",
  schema: z.object({
    name: z.string().describe("The name of the organization. Required field."),
    logo: z
      .string()
      .optional()
      .describe("Optional logo URL or base64-encoded image for the organization."),
  }),
  annotations: {
    title: "Create Organization",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/organization.create", input);

    return ResponseFormatter.success(
      `Organization "${input.name}" created successfully`,
      response.data,
    );
  },
});
