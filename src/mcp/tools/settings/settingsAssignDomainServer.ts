import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsAssignDomainServer = createTool({
  name: "settings-assign-domain-server",
  description: "Assigns a domain to the Dokploy server.",
  schema: z.object({
    host: z
      .string()
      .nullable()
      .describe(
        "The domain host to assign. Set to null to remove the domain assignment.",
      ),
    certificateType: z
      .enum(["letsencrypt", "none", "custom"])
      .describe(
        "The type of SSL certificate to use: letsencrypt for automatic SSL, none for no SSL, custom for user-provided certificates.",
      ),
    letsEncryptEmail: z
      .string()
      .nullable()
      .optional()
      .describe(
        "Email address for Let's Encrypt certificate notifications. Required when certificateType is letsencrypt.",
      ),
    https: z
      .boolean()
      .optional()
      .describe("Whether to enable HTTPS for the domain."),
  }),
  annotations: {
    title: "Assign Domain to Server",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.assignDomainServer",
      input,
    );

    return ResponseFormatter.success(
      `Domain "${input.host}" assigned successfully`,
      response.data,
    );
  },
});
