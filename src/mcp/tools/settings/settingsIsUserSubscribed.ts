import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsIsUserSubscribed = createTool({
  name: "settings-is-user-subscribed",
  description: "Checks if the user is subscribed to Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Check User Subscription",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.isUserSubscribed");

    return ResponseFormatter.success(
      "Successfully checked subscription status",
      response.data,
    );
  },
});
