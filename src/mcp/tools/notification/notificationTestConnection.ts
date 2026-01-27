import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Provider-specific test connection configurations (matching OpenAPI spec exactly)
const slackTestConfig = z.object({
  provider: z.literal("slack"),
  webhookUrl: z.string().min(1).describe("The Slack webhook URL to test."),
  channel: z.string().describe("The Slack channel to test sending to."),
});

const discordTestConfig = z.object({
  provider: z.literal("discord"),
  webhookUrl: z.string().min(1).describe("The Discord webhook URL to test."),
  decoration: z
    .boolean()
    .optional()
    .describe("Whether to use rich embed formatting for the test message."),
});

const telegramTestConfig = z.object({
  provider: z.literal("telegram"),
  botToken: z.string().min(1).describe("The Telegram bot token to test."),
  chatId: z
    .string()
    .min(1)
    .describe("The Telegram chat ID to test sending to."),
  messageThreadId: z
    .string()
    .describe(
      "The message thread ID for topic-based chats. Required but can be empty string.",
    ),
});

const emailTestConfig = z.object({
  provider: z.literal("email"),
  smtpServer: z.string().min(1).describe("The SMTP server hostname to test."),
  smtpPort: z.number().min(1).describe("The SMTP server port (minimum 1)."),
  username: z.string().min(1).describe("The SMTP authentication username."),
  password: z.string().min(1).describe("The SMTP authentication password."),
  toAddresses: z
    .array(z.string())
    .min(1)
    .describe("The email addresses to send the test to."),
  fromAddress: z
    .string()
    .min(1)
    .describe("The email address to send the test from."),
});

const gotifyTestConfig = z.object({
  provider: z.literal("gotify"),
  serverUrl: z.string().min(1).describe("The Gotify server URL to test."),
  appToken: z
    .string()
    .min(1)
    .describe("The Gotify application token to test."),
  priority: z
    .number()
    .min(1)
    .describe("The priority level for the test message (minimum 1)."),
  decoration: z
    .boolean()
    .optional()
    .describe("Whether to use rich formatting for the test message."),
});

const ntfyTestConfig = z.object({
  provider: z.literal("ntfy"),
  serverUrl: z.string().min(1).describe("The Ntfy server URL to test."),
  topic: z.string().min(1).describe("The Ntfy topic to test sending to."),
  accessToken: z
    .string()
    .min(1)
    .describe("The Ntfy access token for authentication."),
  priority: z
    .number()
    .min(1)
    .describe("The priority level for the test message (minimum 1)."),
});

const larkTestConfig = z.object({
  provider: z.literal("lark"),
  webhookUrl: z.string().min(1).describe("The Lark webhook URL to test."),
});

// Discriminated union of all provider test configs
const notificationTestConnectionSchema = z.discriminatedUnion("provider", [
  slackTestConfig,
  discordTestConfig,
  telegramTestConfig,
  emailTestConfig,
  gotifyTestConfig,
  ntfyTestConfig,
  larkTestConfig,
]);

type NotificationTestConnectionInput = z.infer<
  typeof notificationTestConnectionSchema
>;

// Map provider to API endpoint suffix
const providerEndpointMap: Record<
  NotificationTestConnectionInput["provider"],
  string
> = {
  slack: "Slack",
  discord: "Discord",
  telegram: "Telegram",
  email: "Email",
  gotify: "Gotify",
  ntfy: "Ntfy",
  lark: "Lark",
};

export const notificationTestConnection = createTool({
  name: "notification-test-connection",
  description: `Tests a notification provider connection in Dokploy by sending a test message. Supports multiple providers: slack, discord, telegram, email, gotify, ntfy, lark. Each provider requires different configuration fields.

Provider-specific required fields:
- slack: webhookUrl, channel
- discord: webhookUrl (decoration optional)
- telegram: botToken, chatId, messageThreadId (can be empty string)
- email: smtpServer, smtpPort, username, password, fromAddress, toAddresses
- gotify: serverUrl, appToken, priority (decoration optional)
- ntfy: serverUrl, topic, accessToken, priority
- lark: webhookUrl`,
  schema: z.object({
    provider: z
      .enum(["slack", "discord", "telegram", "email", "gotify", "ntfy", "lark"])
      .describe("The notification provider type."),
    // Provider-specific fields (all optional at schema level, validated in handler)
    webhookUrl: z
      .string()
      .min(1)
      .optional()
      .describe("Webhook URL (required for slack, discord, lark providers)."),
    channel: z
      .string()
      .optional()
      .describe("Slack channel (required for slack provider)."),
    decoration: z
      .boolean()
      .optional()
      .describe("Rich formatting (optional for discord, gotify providers)."),
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
      .describe("SMTP port, minimum 1 (required for email provider)."),
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
    title: "Test Notification Connection",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    // Validate with discriminated union schema for better type safety
    const validationResult = notificationTestConnectionSchema.safeParse(input);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return ResponseFormatter.error(
        `Invalid input for ${input.provider} connection test`,
        `Validation errors: ${errorMessages}`,
      );
    }

    const validatedInput = validationResult.data;
    const endpointSuffix = providerEndpointMap[validatedInput.provider];

    // Remove 'provider' from the payload sent to API
    const { provider, ...apiPayload } = validatedInput;

    const response = await apiClient.post(
      `/notification.test${endpointSuffix}Connection`,
      apiPayload,
    );

    return ResponseFormatter.success(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} connection test completed successfully`,
      response.data,
    );
  },
});
