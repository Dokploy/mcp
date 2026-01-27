import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Common notification settings shared by all providers (all optional for updates, based on OpenAPI spec)
const commonUpdateSettings = {
  notificationId: z
    .string()
    .min(1)
    .describe("The ID of the notification to update."),
  name: z.string().optional().describe("The name of the notification."),
  appBuildError: z
    .boolean()
    .optional()
    .describe("Notify on application build errors."),
  databaseBackup: z
    .boolean()
    .optional()
    .describe("Notify on database backup events."),
  dokployRestart: z
    .boolean()
    .optional()
    .describe("Notify on Dokploy restart events."),
  appDeploy: z
    .boolean()
    .optional()
    .describe("Notify on application deployment events."),
  dockerCleanup: z
    .boolean()
    .optional()
    .describe("Notify on Docker cleanup events."),
  organizationId: z.string().optional().describe("The organization ID."),
};

// Provider-specific configurations for updates (matching OpenAPI spec exactly)
// Note: slackId has no minLength in OpenAPI spec (can be empty string)
const slackUpdateConfig = z.object({
  provider: z.literal("slack"),
  ...commonUpdateSettings,
  slackId: z.string().describe("The Slack configuration ID."),
  serverThreshold: z
    .boolean()
    .optional()
    .describe("Notify when server thresholds are exceeded."),
  webhookUrl: z
    .string()
    .min(1)
    .optional()
    .describe("The Slack webhook URL for sending notifications."),
  channel: z
    .string()
    .optional()
    .describe("The Slack channel to send notifications to."),
});

const discordUpdateConfig = z.object({
  provider: z.literal("discord"),
  ...commonUpdateSettings,
  discordId: z.string().min(1).describe("The Discord configuration ID."),
  serverThreshold: z
    .boolean()
    .optional()
    .describe("Notify when server thresholds are exceeded."),
  webhookUrl: z
    .string()
    .min(1)
    .optional()
    .describe("The Discord webhook URL for sending notifications."),
  decoration: z
    .boolean()
    .optional()
    .describe("Whether to use rich embed formatting for messages."),
});

const telegramUpdateConfig = z.object({
  provider: z.literal("telegram"),
  ...commonUpdateSettings,
  telegramId: z.string().min(1).describe("The Telegram configuration ID."),
  serverThreshold: z
    .boolean()
    .optional()
    .describe("Notify when server thresholds are exceeded."),
  botToken: z
    .string()
    .min(1)
    .optional()
    .describe("The Telegram bot token for sending notifications."),
  chatId: z
    .string()
    .min(1)
    .optional()
    .describe("The Telegram chat ID to send notifications to."),
  messageThreadId: z
    .string()
    .optional()
    .describe("The message thread ID for topic-based chats."),
});

const emailUpdateConfig = z.object({
  provider: z.literal("email"),
  ...commonUpdateSettings,
  emailId: z.string().min(1).describe("The Email configuration ID."),
  serverThreshold: z
    .boolean()
    .optional()
    .describe("Notify when server thresholds are exceeded."),
  smtpServer: z
    .string()
    .min(1)
    .optional()
    .describe("The SMTP server hostname for sending emails."),
  smtpPort: z
    .number()
    .min(1)
    .optional()
    .describe("The SMTP server port (minimum 1)."),
  username: z
    .string()
    .min(1)
    .optional()
    .describe("The SMTP authentication username."),
  password: z
    .string()
    .min(1)
    .optional()
    .describe("The SMTP authentication password."),
  fromAddress: z
    .string()
    .min(1)
    .optional()
    .describe("The email address to send notifications from."),
  toAddresses: z
    .array(z.string())
    .min(1)
    .optional()
    .describe("The email addresses to send notifications to."),
});

// Note: Gotify does NOT have serverThreshold according to OpenAPI spec
const gotifyUpdateConfig = z.object({
  provider: z.literal("gotify"),
  ...commonUpdateSettings,
  gotifyId: z.string().min(1).describe("The Gotify configuration ID."),
  serverUrl: z
    .string()
    .min(1)
    .optional()
    .describe("The Gotify server URL for sending notifications."),
  appToken: z
    .string()
    .min(1)
    .optional()
    .describe("The Gotify application token for authentication."),
  priority: z
    .number()
    .min(1)
    .optional()
    .describe("The priority level for Gotify messages (minimum 1)."),
  decoration: z
    .boolean()
    .optional()
    .describe("Whether to use rich formatting for messages."),
});

// Note: Ntfy does NOT have serverThreshold according to OpenAPI spec
const ntfyUpdateConfig = z.object({
  provider: z.literal("ntfy"),
  ...commonUpdateSettings,
  ntfyId: z.string().min(1).describe("The Ntfy configuration ID."),
  serverUrl: z
    .string()
    .min(1)
    .optional()
    .describe("The Ntfy server URL for sending notifications."),
  topic: z
    .string()
    .min(1)
    .optional()
    .describe("The Ntfy topic to send notifications to."),
  accessToken: z
    .string()
    .min(1)
    .optional()
    .describe("The Ntfy access token for authentication."),
  priority: z
    .number()
    .min(1)
    .optional()
    .describe("The priority level for Ntfy messages (minimum 1)."),
});

const larkUpdateConfig = z.object({
  provider: z.literal("lark"),
  ...commonUpdateSettings,
  larkId: z.string().min(1).describe("The Lark configuration ID."),
  serverThreshold: z
    .boolean()
    .optional()
    .describe("Notify when server thresholds are exceeded."),
  webhookUrl: z
    .string()
    .min(1)
    .optional()
    .describe("The Lark webhook URL for sending notifications."),
});

// Discriminated union of all provider update configs
const notificationUpdateSchema = z.discriminatedUnion("provider", [
  slackUpdateConfig,
  discordUpdateConfig,
  telegramUpdateConfig,
  emailUpdateConfig,
  gotifyUpdateConfig,
  ntfyUpdateConfig,
  larkUpdateConfig,
]);

type NotificationUpdateInput = z.infer<typeof notificationUpdateSchema>;

// Map provider to API endpoint suffix
const providerEndpointMap: Record<NotificationUpdateInput["provider"], string> =
  {
    slack: "Slack",
    discord: "Discord",
    telegram: "Telegram",
    email: "Email",
    gotify: "Gotify",
    ntfy: "Ntfy",
    lark: "Lark",
  };

export const notificationUpdate = createTool({
  name: "notification-update",
  description: `Updates an existing notification configuration in Dokploy. Supports multiple providers: slack, discord, telegram, email, gotify, ntfy, lark. Each provider requires notificationId and a provider-specific ID field.

Required fields for all providers:
- notificationId: The notification ID to update
- provider-specific ID (slackId, discordId, telegramId, emailId, gotifyId, ntfyId, larkId)

Note: serverThreshold is available for slack, discord, telegram, email, lark but NOT for gotify or ntfy.

All other fields are optional and only the provided fields will be updated.`,
  schema: z.object({
    provider: z
      .enum(["slack", "discord", "telegram", "email", "gotify", "ntfy", "lark"])
      .describe("The notification provider type."),
    notificationId: z
      .string()
      .min(1)
      .describe("The ID of the notification to update."),
    // Provider-specific ID fields (all optional at schema level, validated in handler)
    // Note: slackId has no minLength in OpenAPI spec
    slackId: z
      .string()
      .optional()
      .describe("The Slack configuration ID (required for slack provider)."),
    discordId: z
      .string()
      .min(1)
      .optional()
      .describe(
        "The Discord configuration ID (required for discord provider).",
      ),
    telegramId: z
      .string()
      .min(1)
      .optional()
      .describe(
        "The Telegram configuration ID (required for telegram provider).",
      ),
    emailId: z
      .string()
      .min(1)
      .optional()
      .describe("The Email configuration ID (required for email provider)."),
    gotifyId: z
      .string()
      .min(1)
      .optional()
      .describe("The Gotify configuration ID (required for gotify provider)."),
    ntfyId: z
      .string()
      .min(1)
      .optional()
      .describe("The Ntfy configuration ID (required for ntfy provider)."),
    larkId: z
      .string()
      .min(1)
      .optional()
      .describe("The Lark configuration ID (required for lark provider)."),
    // Common optional fields
    name: z.string().optional().describe("The name of the notification."),
    appBuildError: z
      .boolean()
      .optional()
      .describe("Notify on application build errors."),
    databaseBackup: z
      .boolean()
      .optional()
      .describe("Notify on database backup events."),
    dokployRestart: z
      .boolean()
      .optional()
      .describe("Notify on Dokploy restart events."),
    appDeploy: z
      .boolean()
      .optional()
      .describe("Notify on application deployment events."),
    dockerCleanup: z
      .boolean()
      .optional()
      .describe("Notify on Docker cleanup events."),
    organizationId: z.string().optional().describe("The organization ID."),
    // Provider-specific optional fields
    webhookUrl: z
      .string()
      .min(1)
      .optional()
      .describe("Webhook URL (for slack, discord, lark providers)."),
    channel: z.string().optional().describe("Slack channel (for slack)."),
    decoration: z
      .boolean()
      .optional()
      .describe("Rich formatting (for discord, gotify)."),
    serverThreshold: z
      .boolean()
      .optional()
      .describe(
        "Notify on server threshold (for slack, discord, telegram, email, lark). NOT available for gotify or ntfy.",
      ),
    botToken: z
      .string()
      .min(1)
      .optional()
      .describe("Telegram bot token (for telegram)."),
    chatId: z
      .string()
      .min(1)
      .optional()
      .describe("Telegram chat ID (for telegram)."),
    messageThreadId: z
      .string()
      .optional()
      .describe("Telegram message thread ID (for telegram)."),
    smtpServer: z
      .string()
      .min(1)
      .optional()
      .describe("SMTP server hostname (for email)."),
    smtpPort: z
      .number()
      .min(1)
      .optional()
      .describe("SMTP port, minimum 1 (for email)."),
    username: z
      .string()
      .min(1)
      .optional()
      .describe("SMTP username (for email)."),
    password: z
      .string()
      .min(1)
      .optional()
      .describe("SMTP password (for email)."),
    fromAddress: z
      .string()
      .min(1)
      .optional()
      .describe("From email address (for email)."),
    toAddresses: z
      .array(z.string())
      .min(1)
      .optional()
      .describe("To email addresses array (for email)."),
    serverUrl: z
      .string()
      .min(1)
      .optional()
      .describe("Server URL (for gotify, ntfy)."),
    appToken: z
      .string()
      .min(1)
      .optional()
      .describe("Application token (for gotify)."),
    priority: z
      .number()
      .min(1)
      .optional()
      .describe("Priority level, minimum 1 (for gotify, ntfy)."),
    topic: z.string().min(1).optional().describe("Ntfy topic (for ntfy)."),
    accessToken: z
      .string()
      .min(1)
      .optional()
      .describe("Access token (for ntfy)."),
  }),
  annotations: {
    title: "Update Notification",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    // Validate with discriminated union schema for better type safety
    const validationResult = notificationUpdateSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return ResponseFormatter.error(
        `Invalid input for ${input.provider} notification update`,
        `Validation errors: ${errorMessages}`,
      );
    }

    const validatedInput = validationResult.data;
    const endpointSuffix = providerEndpointMap[validatedInput.provider];

    // Remove 'provider' from the payload sent to API
    const { provider, ...apiPayload } = validatedInput;

    const response = await apiClient.post(
      `/notification.update${endpointSuffix}`,
      apiPayload,
    );

    return ResponseFormatter.success(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} notification "${input.notificationId}" updated successfully`,
      response.data,
    );
  },
});
