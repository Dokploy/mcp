import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const notificationGetEmailProviders = createTool({
  name: "notification-get-email-providers",
  description: "Gets the list of available email providers for notifications.",
  schema: z.object({}),
  annotations: {
    title: "Get Email Providers",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const providers = await apiClient.get("/notification.getEmailProviders");

    return ResponseFormatter.success(
      "Successfully fetched email providers",
      providers.data,
    );
  },
});
