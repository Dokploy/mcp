import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverGetServerMetrics = createTool({
  name: "server-get-server-metrics",
  description: "Gets server metrics from the Dokploy monitoring endpoint.",
  schema: z.object({
    url: z.string().describe("The URL of the metrics endpoint."),
    token: z.string().describe("The authentication token for the metrics endpoint."),
    dataPoints: z.string().describe("The number of data points to retrieve."),
  }),
  annotations: {
    title: "Get Server Metrics",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/server.getServerMetrics?url=${encodeURIComponent(input.url)}&token=${encodeURIComponent(input.token)}&dataPoints=${encodeURIComponent(input.dataPoints)}`
    );

    return ResponseFormatter.success(
      "Successfully fetched server metrics",
      response.data
    );
  },
});
