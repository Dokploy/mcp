import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationDelete = createTool({
  name: "organization-delete",
  description: "Deletes an organization from Dokploy.",
  schema: z.object({
    organizationId: z
      .string()
      .describe("The ID of the organization to delete."),
  }),
  annotations: {
    title: "Delete Organization",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/organization.delete", input);

    return ResponseFormatter.success(
      `Organization "${input.organizationId}" deleted successfully`,
      response.data,
    );
  },
});
