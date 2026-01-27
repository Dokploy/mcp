import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationRemoveInvitation = createTool({
  name: "organization-remove-invitation",
  description: "Removes an invitation from an organization in Dokploy.",
  schema: z.object({
    invitationId: z.string().describe("The ID of the invitation to remove."),
  }),
  annotations: {
    title: "Remove Organization Invitation",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/organization.removeInvitation",
      input,
    );

    return ResponseFormatter.success(
      `Invitation "${input.invitationId}" removed successfully`,
      response.data,
    );
  },
});
