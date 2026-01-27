import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGetInvitations = createTool({
  name: "user-get-invitations",
  description: "Gets pending invitations for the current user in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get User Invitations",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/user.getInvitations");

    return ResponseFormatter.success(
      "Successfully fetched user invitations",
      response.data,
    );
  },
});
