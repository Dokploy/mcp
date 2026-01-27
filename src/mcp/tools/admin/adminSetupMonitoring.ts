import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const adminSetupMonitoring = createTool({
  name: "admin-setup-monitoring",
  description: "Sets up monitoring configuration for the Dokploy instance.",
  schema: z.object({
    metricsConfig: z
      .object({
        server: z
          .object({
            refreshRate: z
              .number()
              .min(2)
              .describe("Server metrics refresh rate in seconds. Minimum: 2."),
            port: z.number().min(1).describe("Port number for metrics server."),
            token: z.string().describe("Authentication token for metrics."),
            urlCallback: z
              .string()
              .url()
              .describe("Callback URL for metrics notifications."),
            retentionDays: z
              .number()
              .min(1)
              .describe("Number of days to retain metrics data. Minimum: 1."),
            cronJob: z
              .string()
              .min(1)
              .describe("Cron expression for metrics cleanup schedule."),
            thresholds: z
              .object({
                cpu: z
                  .number()
                  .min(0)
                  .describe("CPU usage threshold percentage for alerts."),
                memory: z
                  .number()
                  .min(0)
                  .describe("Memory usage threshold percentage for alerts."),
              })
              .describe("Alert thresholds for server resources."),
          })
          .describe("Server monitoring configuration."),
        containers: z
          .object({
            refreshRate: z
              .number()
              .min(2)
              .describe(
                "Container metrics refresh rate in seconds. Minimum: 2.",
              ),
            services: z
              .object({
                include: z
                  .array(z.string())
                  .optional()
                  .describe("List of service names to include in monitoring."),
                exclude: z
                  .array(z.string())
                  .optional()
                  .describe("List of service names to exclude from monitoring."),
              })
              .describe("Services filter configuration."),
          })
          .describe("Container monitoring configuration."),
      })
      .describe("Metrics configuration for server and container monitoring."),
  }),
  annotations: {
    title: "Setup Monitoring",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/admin.setupMonitoring", input);

    return ResponseFormatter.success(
      "Monitoring setup configured successfully",
      response.data,
    );
  },
});
