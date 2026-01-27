import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsHaveActivateRequests = createTool({
  name: "settings-have-activate-requests",
  description: "Checks if activate requests feature is enabled in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Check Activate Requests",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.haveActivateRequests");

    return ResponseFormatter.success(
      "Successfully checked activate requests status",
      response.data,
    );
  },
});
