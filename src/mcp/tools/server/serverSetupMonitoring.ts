import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const thresholdsSchema = z.object({
  cpu: z.number().min(0).describe("CPU threshold percentage (minimum 0)."),
  memory: z.number().min(0).describe("Memory threshold percentage (minimum 0)."),
});

const servicesSchema = z.object({
  include: z.array(z.string()).optional().describe("List of services to include in monitoring."),
  exclude: z.array(z.string()).optional().describe("List of services to exclude from monitoring."),
});

const serverMetricsSchema = z.object({
  refreshRate: z.number().min(2).describe("Refresh rate in seconds (minimum 2)."),
  port: z.number().min(1).describe("Port for metrics collection (minimum 1)."),
  token: z.string().describe("Token for authentication."),
  urlCallback: z.string().url().describe("Callback URL for metrics data."),
  retentionDays: z.number().min(1).describe("Number of days to retain metrics data (minimum 1)."),
  cronJob: z.string().min(1).describe("Cron job schedule expression."),
  thresholds: thresholdsSchema.describe("Threshold configuration for alerts."),
});

const containersMetricsSchema = z.object({
  refreshRate: z.number().min(2).describe("Refresh rate in seconds for container metrics (minimum 2)."),
  services: servicesSchema.describe("Services configuration for container monitoring."),
});

const metricsConfigSchema = z.object({
  server: serverMetricsSchema.describe("Server metrics configuration."),
  containers: containersMetricsSchema.describe("Containers metrics configuration."),
});

export const serverSetupMonitoring = createTool({
  name: "server-setup-monitoring",
  description: "Sets up monitoring for a server in Dokploy.",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to set up monitoring for."),
    metricsConfig: metricsConfigSchema.describe("The metrics configuration object."),
  }),
  annotations: {
    title: "Setup Server Monitoring",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/server.setupMonitoring", input);

    return ResponseFormatter.success(
      `Monitoring setup initiated for server "${input.serverId}"`,
      response.data
    );
  },
});
