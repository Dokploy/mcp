import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userCreateApiKey = createTool({
  name: "user-create-api-key",
  description: "Creates a new API key for the current user in Dokploy.",
  schema: z.object({
    name: z
      .string()
      .min(1)
      .describe("The name for the API key. Required field."),
    prefix: z.string().optional().describe("Optional prefix for the API key."),
    expiresIn: z
      .number()
      .optional()
      .describe("Expiration time in seconds from now."),
    metadata: z
      .object({
        organizationId: z
          .string()
          .describe("Organization ID to associate with the key. Required."),
      })
      .describe("Metadata for the API key. Must include organizationId."),
    rateLimitEnabled: z
      .boolean()
      .optional()
      .describe("Whether rate limiting is enabled for this key."),
    rateLimitTimeWindow: z
      .number()
      .optional()
      .describe("Rate limit time window in milliseconds."),
    rateLimitMax: z
      .number()
      .optional()
      .describe("Maximum requests allowed within the time window."),
    remaining: z
      .number()
      .optional()
      .describe("Remaining request count for the current window."),
    refillAmount: z
      .number()
      .optional()
      .describe("Amount to refill the rate limit bucket."),
    refillInterval: z
      .number()
      .optional()
      .describe("Refill interval in milliseconds."),
  }),
  annotations: {
    title: "Create API Key",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/user.createApiKey", input);

    return ResponseFormatter.success(
      `API key "${input.name}" created successfully`,
      response.data,
    );
  },
});
