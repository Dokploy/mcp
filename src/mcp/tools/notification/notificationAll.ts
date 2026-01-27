import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const notificationAll = createTool({
  name: "notification-all",
  description: "Gets all notification configurations in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List All Notifications",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const notifications = await apiClient.get("/notification.all");

    return ResponseFormatter.success(
      "Successfully fetched all notifications",
      notifications.data,
    );
  },
});
