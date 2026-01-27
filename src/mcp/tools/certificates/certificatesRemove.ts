import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const certificatesRemove = createTool({
  name: "certificates-remove",
  description: "Removes/deletes an SSL/TLS certificate from Dokploy.",
  schema: z.object({
    certificateId: z
      .string()
      .min(1)
      .describe("The unique identifier of the certificate to remove. Required."),
  }),
  annotations: {
    title: "Remove Certificate",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/certificates.remove", input);

    return ResponseFormatter.success(
      `Certificate "${input.certificateId}" removed successfully`,
      response.data,
    );
  },
});
