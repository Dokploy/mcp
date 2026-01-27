import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userSendInvitation = createTool({
  name: "user-send-invitation",
  description: "Sends an invitation to a user in Dokploy.",
  schema: z.object({
    invitationId: z.string().min(1).describe("The ID of the invitation."),
    notificationId: z
      .string()
      .min(1)
      .describe("The ID of the notification to use for sending."),
  }),
  annotations: {
    title: "Send Invitation",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/user.sendInvitation", input);

    return ResponseFormatter.success(
      "Invitation sent successfully",
      response.data,
    );
  },
});
