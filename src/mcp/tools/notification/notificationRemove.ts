import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const notificationRemove = createTool({
  name: "notification-remove",
  description: "Removes/deletes a notification configuration from Dokploy.",
  schema: z.object({
    notificationId: z
      .string()
      .describe("The ID of the notification to remove."),
  }),
  annotations: {
    title: "Remove Notification",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/notification.remove", input);

    return ResponseFormatter.success(
      `Notification "${input.notificationId}" removed successfully`,
      response.data,
    );
  },
});
