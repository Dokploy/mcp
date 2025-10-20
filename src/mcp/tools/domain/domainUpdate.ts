import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const domainUpdate = createTool({
  name: "domain-update",
  description:
    "Updates an existing domain configuration in Dokploy. Allows modifying domain settings including host, SSL configuration, routing options, and service associations.",
  schema: z.object({
    host: z
      .string()
      .min(1)
      .describe(
        "The domain host (e.g., example.com or subdomain.example.com)."
      ),
    path: z
      .string()
      .min(1)
      .nullable()
      .optional()
      .describe(
        "Optional path for the domain (e.g., /api). Used for path-based routing."
      ),
    port: z
      .number()
      .min(1)
      .max(65535)
      .nullable()
      .optional()
      .describe(
        "The port number for the service (1-65535). If not specified, defaults will be used."
      ),
    https: z.boolean().describe("Whether to enable HTTPS for this domain."),
    certificateType: z
      .enum(["letsencrypt", "none", "custom"])
      .describe(
        "The type of SSL certificate: 'letsencrypt' for automatic Let's Encrypt certificates, 'none' for no SSL, or 'custom' for custom certificates."
      ),
    customCertResolver: z
      .string()
      .nullable()
      .optional()
      .describe(
        "Custom certificate resolver name. Required when certificateType is 'custom'."
      ),
    serviceName: z
      .string()
      .nullable()
      .optional()
      .describe(
        "The name of the service within the compose stack. Used with composeId."
      ),
    domainType: z
      .enum(["compose", "application", "preview"])
      .nullable()
      .optional()
      .describe(
        "The type of domain: 'application' for app domains, 'compose' for compose services, or 'preview' for preview deployments."
      ),
    internalPath: z
      .string()
      .nullable()
      .optional()
      .describe("Internal path for routing within the container/service."),
    stripPath: z
      .boolean()
      .describe(
        "Whether to strip the path prefix when forwarding requests to the backend service."
      ),
    domainId: z.string().describe("The ID of the domain to update."),
  }),
  annotations: {
    title: "Update Domain",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/domain.update", input);

    return ResponseFormatter.success(
      `Domain "${input.host}" updated successfully`,
      response.data
    );
  },
});
