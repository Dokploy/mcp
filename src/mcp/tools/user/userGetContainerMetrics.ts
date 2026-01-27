import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGetContainerMetrics = createTool({
  name: "user-get-container-metrics",
  description: "Gets container metrics for a specific application in Dokploy.",
  schema: z.object({
    url: z.string().describe("The metrics URL."),
    token: z.string().describe("The metrics token."),
    appName: z.string().describe("The application name to get metrics for."),
    dataPoints: z.string().describe("The number of data points to retrieve."),
  }),
  annotations: {
    title: "Get Container Metrics",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams({
      url: input.url,
      token: input.token,
      appName: input.appName,
      dataPoints: input.dataPoints,
    });
    const response = await apiClient.get(
      `/user.getContainerMetrics?${params.toString()}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched container metrics for "${input.appName}"`,
      response.data,
    );
  },
});
