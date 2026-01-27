import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationSetDefault = createTool({
  name: "organization-set-default",
  description: "Sets the default organization for the current user in Dokploy.",
  schema: z.object({
    organizationId: z
      .string()
      .min(1)
      .describe("The ID of the organization to set as default."),
  }),
  annotations: {
    title: "Set Default Organization",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/organization.setDefault", input);

    return ResponseFormatter.success(
      `Organization "${input.organizationId}" set as default successfully`,
      response.data,
    );
  },
});
