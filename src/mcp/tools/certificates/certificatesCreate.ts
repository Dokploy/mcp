import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const certificatesCreate = createTool({
  name: "certificates-create",
  description: "Creates a new SSL/TLS certificate in Dokploy.",
  schema: z.object({
    name: z
      .string()
      .min(1)
      .describe("Display name for the certificate. Required."),
    certificateData: z
      .string()
      .min(1)
      .describe(
        "The SSL/TLS certificate in PEM format. Include the full chain if applicable. Required."
      ),
    privateKey: z
      .string()
      .min(1)
      .describe("The private key in PEM format. Must match the certificate. Required."),
    organizationId: z
      .string()
      .describe("The organization ID to associate this certificate with. Required."),
    certificateId: z
      .string()
      .optional()
      .describe("Custom ID for the certificate. Auto-generated if not provided."),
    certificatePath: z
      .string()
      .optional()
      .describe("File path where the certificate will be stored on the server."),
    autoRenew: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether to enable automatic certificate renewal."),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("Server ID to deploy this certificate to. Deploys to all servers if not specified."),
  }),
  annotations: {
    title: "Create Certificate",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/certificates.create", input);

    return ResponseFormatter.success(
      `Certificate "${input.name}" created successfully`,
      response.data,
    );
  },
});
