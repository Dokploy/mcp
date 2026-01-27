import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGetMetricsToken = createTool({
  name: "user-get-metrics-token",
  description: "Gets the metrics token for the current user in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Metrics Token",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/user.getMetricsToken");

    return ResponseFormatter.success(
      "Successfully fetched metrics token",
      response.data,
    );
  },
});
