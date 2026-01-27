import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationUpdate = createTool({
  name: "organization-update",
  description: "Updates an existing organization in Dokploy.",
  schema: z.object({
    organizationId: z
      .string()
      .describe("The ID of the organization to update. Required field."),
    name: z
      .string()
      .describe("The new name for the organization. Required field."),
    logo: z
      .string()
      .optional()
      .describe(
        "Optional new logo URL or base64-encoded image for the organization.",
      ),
  }),
  annotations: {
    title: "Update Organization",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/organization.update", input);

    return ResponseFormatter.success(
      `Organization "${input.organizationId}" updated successfully`,
      response.data,
    );
  },
});
