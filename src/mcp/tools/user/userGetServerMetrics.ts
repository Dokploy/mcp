import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGetServerMetrics = createTool({
  name: "user-get-server-metrics",
  description: "Gets server metrics for the current user in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Server Metrics",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/user.getServerMetrics");

    return ResponseFormatter.success(
      "Successfully fetched server metrics",
      response.data,
    );
  },
});
