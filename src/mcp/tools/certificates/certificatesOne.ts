import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const certificatesOne = createTool({
  name: "certificates-one",
  description: "Gets a specific SSL/TLS certificate by its ID in Dokploy.",
  schema: z.object({
    certificateId: z
      .string()
      .min(1)
      .describe("The unique identifier of the certificate to retrieve. Required."),
  }),
  annotations: {
    title: "Get Certificate Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const certificate = await apiClient.get(
      `/certificates.one?certificateId=${encodeURIComponent(input.certificateId)}`,
    );

    if (!certificate?.data) {
      return ResponseFormatter.error(
        "Failed to fetch certificate",
        `Certificate with ID "${input.certificateId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched certificate "${input.certificateId}"`,
      certificate.data,
    );
  },
});
