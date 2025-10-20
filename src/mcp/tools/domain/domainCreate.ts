import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const domainCreate = createTool({
  name: "domain-create",
  description:
    "Creates a new domain configuration in Dokploy. Domains can be configured for applications, compose services, or preview deployments with SSL/TLS certificate options.",
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
    applicationId: z
      .string()
      .nullable()
      .optional()
      .describe(
        "The ID of the application to associate this domain with. Required if domainType is 'application'."
      ),
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
    composeId: z
      .string()
      .nullable()
      .optional()
      .describe(
        "The ID of the compose service to associate this domain with. Required if domainType is 'compose'."
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
    previewDeploymentId: z
      .string()
      .nullable()
      .optional()
      .describe(
        "The ID of the preview deployment. Required if domainType is 'preview'."
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
  }),
  annotations: {
    title: "Create Domain",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/domain.create", input);

    return ResponseFormatter.success(
      `Domain "${input.host}" created successfully with ${input.certificateType} certificate type`,
      response.data
    );
  },
});
