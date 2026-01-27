import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationAllInvitations = createTool({
  name: "organization-all-invitations",
  description: "Gets all invitations for organizations in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get All Organization Invitations",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/organization.allInvitations");

    return ResponseFormatter.success(
      "Successfully fetched all organization invitations",
      response.data,
    );
  },
});
