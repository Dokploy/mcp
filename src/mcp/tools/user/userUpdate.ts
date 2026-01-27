import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userUpdate = createTool({
  name: "user-update",
  description: "Updates user information in Dokploy.",
  schema: z.object({
    id: z.string().min(1).optional().describe("The ID of the user to update."),
    name: z.string().optional().describe("Display name of the user."),
    isRegistered: z
      .boolean()
      .optional()
      .describe("Whether the user is registered."),
    expirationDate: z.string().optional().describe("User expiration date."),
    createdAt2: z.string().optional().describe("Alternative creation timestamp."),
    createdAt: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .describe("Creation timestamp in ISO 8601 format."),
    twoFactorEnabled: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether two-factor authentication is enabled."),
    email: z
      .string()
      .email()
      .min(1)
      .optional()
      .describe("User email address."),
    emailVerified: z
      .boolean()
      .optional()
      .describe("Whether email is verified."),
    image: z.string().nullable().optional().describe("User profile image URL."),
    banned: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether the user is banned."),
    banReason: z
      .string()
      .nullable()
      .optional()
      .describe("Reason for ban if banned."),
    banExpires: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .describe("Ban expiration timestamp in ISO 8601 format."),
    updatedAt: z
      .string()
      .datetime()
      .optional()
      .describe("Update timestamp in ISO 8601 format."),
    serverIp: z
      .string()
      .nullable()
      .optional()
      .describe("Server IP address associated with the user."),
    certificateType: z
      .enum(["letsencrypt", "none", "custom"])
      .optional()
      .describe("Type of SSL certificate to use."),
    https: z.boolean().optional().describe("Whether HTTPS is enabled."),
    host: z.string().nullable().optional().describe("Host domain."),
    letsEncryptEmail: z
      .string()
      .nullable()
      .optional()
      .describe("Email for Let's Encrypt certificate."),
    sshPrivateKey: z
      .string()
      .nullable()
      .optional()
      .describe("SSH private key for server access."),
    enableDockerCleanup: z
      .boolean()
      .optional()
      .describe("Whether automatic Docker cleanup is enabled."),
    logCleanupCron: z
      .string()
      .nullable()
      .optional()
      .describe("Cron expression for log cleanup schedule."),
    enablePaidFeatures: z
      .boolean()
      .optional()
      .describe("Whether paid features are enabled."),
    allowImpersonation: z
      .boolean()
      .optional()
      .describe("Whether impersonation is allowed."),
    metricsConfig: z
      .object({
        server: z
          .object({
            type: z
              .enum(["Dokploy", "Remote"])
              .describe("Metrics server type."),
            refreshRate: z.number().describe("Refresh rate in seconds."),
            port: z.number().describe("Port number."),
            token: z.string().describe("Authentication token."),
            urlCallback: z.string().describe("Callback URL."),
            retentionDays: z.number().describe("Data retention in days."),
            cronJob: z.string().describe("Cron expression for cleanup."),
            thresholds: z
              .object({
                cpu: z.number().describe("CPU threshold percentage."),
                memory: z.number().describe("Memory threshold percentage."),
              })
              .describe("Alert thresholds."),
          })
          .describe("Server metrics configuration."),
        containers: z
          .object({
            refreshRate: z.number().describe("Refresh rate in seconds."),
            services: z
              .object({
                include: z
                  .array(z.string())
                  .describe("Services to include."),
                exclude: z
                  .array(z.string())
                  .describe("Services to exclude."),
              })
              .describe("Service filters."),
          })
          .describe("Container metrics configuration."),
      })
      .optional()
      .describe("Metrics configuration for monitoring."),
    cleanupCacheApplications: z
      .boolean()
      .optional()
      .describe("Whether to cleanup cache for applications."),
    cleanupCacheOnPreviews: z
      .boolean()
      .optional()
      .describe("Whether to cleanup cache on previews."),
    cleanupCacheOnCompose: z
      .boolean()
      .optional()
      .describe("Whether to cleanup cache on compose deployments."),
    stripeCustomerId: z
      .string()
      .nullable()
      .optional()
      .describe("Stripe customer ID."),
    stripeSubscriptionId: z
      .string()
      .nullable()
      .optional()
      .describe("Stripe subscription ID."),
    serversQuantity: z.number().optional().describe("Number of servers."),
    password: z.string().optional().describe("New password."),
    currentPassword: z
      .string()
      .optional()
      .describe("Current password for verification."),
  }),
  annotations: {
    title: "Update User",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/user.update", input);

    return ResponseFormatter.success(
      "User updated successfully",
      response.data,
    );
  },
});
