import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const destinationUpdate = createTool({
  name: "destination-update",
  description: "Updates an existing backup destination in Dokploy.",
  schema: z.object({
    destinationId: z
      .string()
      .describe("The ID of the destination to update. Required."),
    name: z
      .string()
      .min(1)
      .describe("Display name for the backup destination. Required."),
    provider: z
      .string()
      .nullable()
      .describe(
        "Cloud provider name (e.g., 'aws', 'minio', 'backblaze', 'cloudflare'). Can be null for generic S3. Required."
      ),
    accessKey: z
      .string()
      .describe("S3-compatible access key ID for authentication. Required."),
    secretAccessKey: z
      .string()
      .describe("S3-compatible secret access key for authentication. Required."),
    bucket: z
      .string()
      .describe("S3 bucket name where backups will be stored. Required."),
    region: z
      .string()
      .describe("S3 region (e.g., 'us-east-1', 'eu-west-1'). Required."),
    endpoint: z
      .string()
      .describe(
        "S3-compatible endpoint URL (e.g., 'https://s3.amazonaws.com' or 'https://minio.example.com'). Required."
      ),
    serverId: z
      .string()
      .optional()
      .describe("Server ID for remote server destinations. Uses local server if not specified."),
  }),
  annotations: {
    title: "Update Destination",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/destination.update", input);

    return ResponseFormatter.success(
      `Destination "${input.destinationId}" updated successfully`,
      response.data,
    );
  },
});
