import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const notificationOne = createTool({
  name: "notification-one",
  description:
    "Gets a specific notification configuration by its ID in Dokploy.",
  schema: z.object({
    notificationId: z
      .string()
      .describe("The ID of the notification to retrieve."),
  }),
  annotations: {
    title: "Get Notification Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const notification = await apiClient.get(
      `/notification.one?notificationId=${input.notificationId}`,
    );

    if (!notification?.data) {
      return ResponseFormatter.error(
        "Failed to fetch notification",
        `Notification with ID "${input.notificationId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched notification "${input.notificationId}"`,
      notification.data,
    );
  },
});
