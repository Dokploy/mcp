import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const notificationReceiveNotification = createTool({
  name: "notification-receive-notification",
  description:
    "Receives and processes a notification event (typically from server monitoring).",
  schema: z.object({
    ServerType: z
      .enum(["Dokploy", "Remote"])
      .default("Dokploy")
      .optional()
      .describe("The type of server sending the notification."),
    Type: z
      .enum(["Memory", "CPU"])
      .describe("The type of threshold notification."),
    Value: z.number().describe("The current value that triggered the alert."),
    Threshold: z.number().describe("The threshold that was exceeded."),
    Message: z.string().describe("The notification message."),
    Timestamp: z.string().describe("The timestamp of the event."),
    Token: z
      .string()
      .describe("The authentication token for the notification."),
  }),
  annotations: {
    title: "Receive Notification",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/notification.receiveNotification",
      input,
    );

    return ResponseFormatter.success(
      "Notification received and processed successfully",
      response.data,
    );
  },
});
