import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Common notification settings shared by all providers (based on OpenAPI spec)
const commonNotificationSettings = {
  name: z.string().describe("The name of the notification."),
  appBuildError: z.boolean().describe("Notify on application build errors."),
  databaseBackup: z.boolean().describe("Notify on database backup events."),
  dokployRestart: z.boolean().describe("Notify on Dokploy restart events."),
  appDeploy: z.boolean().describe("Notify on application deployment events."),
  dockerCleanup: z.boolean().describe("Notify on Docker cleanup events."),
};

// Provider-specific configurations (matching OpenAPI spec exactly)
const slackConfig = z.object({
  provider: z.literal("slack"),
  ...commonNotificationSettings,
  serverThreshold: z
    .boolean()
    .describe("Notify when server thresholds are exceeded."),
  webhookUrl: z
    .string()
    .min(1)
    .describe("The Slack webhook URL for sending notifications."),
  channel: z.string().describe("The Slack channel to send notifications to."),
});

const discordConfig = z.object({
  provider: z.literal("discord"),
  ...commonNotificationSettings,
  serverThreshold: z
    .boolean()
    .describe("Notify when server thresholds are exceeded."),
  webhookUrl: z
    .string()
    .min(1)
    .describe("The Discord webhook URL for sending notifications."),
  decoration: z
    .boolean()
    .describe("Whether to use rich embed formatting for messages."),
});

const telegramConfig = z.object({
  provider: z.literal("telegram"),
  ...commonNotificationSettings,
  serverThreshold: z
    .boolean()
    .describe("Notify when server thresholds are exceeded."),
  botToken: z
    .string()
    .min(1)
    .describe("The Telegram bot token for sending notifications."),
  chatId: z
    .string()
    .min(1)
    .describe("The Telegram chat ID to send notifications to."),
  messageThreadId: z
    .string()
    .describe(
      "The message thread ID for topic-based chats. Required but can be empty string.",
    ),
});

const emailConfig = z.object({
  provider: z.literal("email"),
  ...commonNotificationSettings,
  serverThreshold: z
    .boolean()
    .describe("Notify when server thresholds are exceeded."),
  smtpServer: z
    .string()
    .min(1)
    .describe("The SMTP server hostname for sending emails."),
  smtpPort: z.number().min(1).describe("The SMTP server port."),
  username: z.string().min(1).describe("The SMTP authentication username."),
  password: z.string().min(1).describe("The SMTP authentication password."),
  fromAddress: z
    .string()
    .min(1)
    .describe("The email address to send notifications from."),
  toAddresses: z
    .array(z.string())
    .min(1)
    .describe("The email addresses to send notifications to."),
});

// Note: Gotify does NOT have serverThreshold according to OpenAPI spec
const gotifyConfig = z.object({
  provider: z.literal("gotify"),
  ...commonNotificationSettings,
  serverUrl: z
    .string()
    .min(1)
    .describe("The Gotify server URL for sending notifications."),
  appToken: z
    .string()
    .min(1)
    .describe("The Gotify application token for authentication."),
  priority: z
    .number()
    .min(1)
    .describe("The priority level for Gotify messages (minimum 1)."),
  decoration: z
    .boolean()
    .describe("Whether to use rich formatting for messages."),
});

// Note: Ntfy does NOT have serverThreshold according to OpenAPI spec
const ntfyConfig = z.object({
  provider: z.literal("ntfy"),
  ...commonNotificationSettings,
  serverUrl: z
    .string()
    .min(1)
    .describe("The Ntfy server URL for sending notifications."),
  topic: z.string().min(1).describe("The Ntfy topic to send notifications to."),
  accessToken: z
    .string()
    .min(1)
    .describe("The Ntfy access token for authentication."),
  priority: z
    .number()
    .min(1)
    .describe("The priority level for Ntfy messages (minimum 1)."),
});

const larkConfig = z.object({
  provider: z.literal("lark"),
  ...commonNotificationSettings,
  serverThreshold: z
    .boolean()
    .describe("Notify when server thresholds are exceeded."),
  webhookUrl: z
    .string()
    .min(1)
    .describe("The Lark webhook URL for sending notifications."),
});

// Discriminated union of all provider configs
const notificationCreateSchema = z.discriminatedUnion("provider", [
  slackConfig,
  discordConfig,
  telegramConfig,
  emailConfig,
  gotifyConfig,
  ntfyConfig,
  larkConfig,
]);

type NotificationCreateInput = z.infer<typeof notificationCreateSchema>;

// Map provider to API endpoint suffix
const providerEndpointMap: Record<NotificationCreateInput["provider"], string> =
  {
    slack: "Slack",
    discord: "Discord",
    telegram: "Telegram",
    email: "Email",
    gotify: "Gotify",
    ntfy: "Ntfy",
    lark: "Lark",
  };

export const notificationCreate = createTool({
  name: "notification-create",
  description: `Creates a new notification configuration in Dokploy. Supports multiple providers: slack, discord, telegram, email, gotify, ntfy, lark. Each provider requires different configuration fields.

Common required fields for all providers:
- name, appBuildError, databaseBackup, dokployRestart, appDeploy, dockerCleanup

Provider-specific required fields:
- slack: webhookUrl, channel, serverThreshold
- discord: webhookUrl, decoration, serverThreshold
- telegram: botToken, chatId, messageThreadId (can be empty string), serverThreshold
- email: smtpServer, smtpPort, username, password, fromAddress, toAddresses, serverThreshold
- gotify: serverUrl, appToken, priority, decoration (NO serverThreshold)
- ntfy: serverUrl, topic, accessToken, priority (NO serverThreshold)
- lark: webhookUrl, serverThreshold`,
  schema: z.object({
    provider: z
      .enum(["slack", "discord", "telegram", "email", "gotify", "ntfy", "lark"])
      .describe("The notification provider type."),
    name: z.string().describe("The name of the notification."),
    appBuildError: z.boolean().describe("Notify on application build errors."),
    databaseBackup: z.boolean().describe("Notify on database backup events."),
    dokployRestart: z.boolean().describe("Notify on Dokploy restart events."),
    appDeploy: z
      .boolean()
      .describe("Notify on application deployment events."),
    dockerCleanup: z.boolean().describe("Notify on Docker cleanup events."),
    // Provider-specific fields (all optional at schema level, validated in handler)
    webhookUrl: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Webhook URL (required for slack, discord, lark providers).",
      ),
    channel: z
      .string()
      .optional()
      .describe("Slack channel (required for slack provider)."),
    decoration: z
      .boolean()
      .optional()
      .describe(
        "Rich formatting (required for discord, gotify providers).",
      ),
    serverThreshold: z
      .boolean()
      .optional()
      .describe(
        "Notify on server threshold (required for slack, discord, telegram, email, lark). NOT used by gotify or ntfy.",
      ),
    botToken: z
      .string()
      .min(1)
      .optional()
      .describe("Telegram bot token (required for telegram provider)."),
    chatId: z
      .string()
      .min(1)
      .optional()
      .describe("Telegram chat ID (required for telegram provider)."),
    messageThreadId: z
      .string()
      .optional()
      .describe(
        "Telegram message thread ID (required for telegram provider, can be empty string).",
      ),
    smtpServer: z
      .string()
      .min(1)
      .optional()
      .describe("SMTP server hostname (required for email provider)."),
    smtpPort: z
      .number()
      .min(1)
      .optional()
      .describe("SMTP port (required for email provider, minimum 1)."),
    username: z
      .string()
      .min(1)
      .optional()
      .describe("SMTP username (required for email provider)."),
    password: z
      .string()
      .min(1)
      .optional()
      .describe("SMTP password (required for email provider)."),
    fromAddress: z
      .string()
      .min(1)
      .optional()
      .describe("From email address (required for email provider)."),
    toAddresses: z
      .array(z.string())
      .min(1)
      .optional()
      .describe("To email addresses array (required for email provider)."),
    serverUrl: z
      .string()
      .min(1)
      .optional()
      .describe("Server URL (required for gotify, ntfy providers)."),
    appToken: z
      .string()
      .min(1)
      .optional()
      .describe("Application token (required for gotify provider)."),
    priority: z
      .number()
      .min(1)
      .optional()
      .describe("Priority level, minimum 1 (required for gotify, ntfy providers)."),
    topic: z
      .string()
      .min(1)
      .optional()
      .describe("Ntfy topic (required for ntfy provider)."),
    accessToken: z
      .string()
      .min(1)
      .optional()
      .describe("Access token (required for ntfy provider)."),
  }),
  annotations: {
    title: "Create Notification",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    // Validate with discriminated union schema for better type safety
    const validationResult = notificationCreateSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return ResponseFormatter.error(
        `Invalid input for ${input.provider} notification`,
        `Validation errors: ${errorMessages}`,
      );
    }

    const validatedInput = validationResult.data;
    const endpointSuffix = providerEndpointMap[validatedInput.provider];

    // Remove 'provider' from the payload sent to API
    const { provider, ...apiPayload } = validatedInput;

    const response = await apiClient.post(
      `/notification.create${endpointSuffix}`,
      apiPayload,
    );

    return ResponseFormatter.success(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} notification "${input.name}" created successfully`,
      response.data,
    );
  },
});
