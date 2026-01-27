import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const certificatesAll = createTool({
  name: "certificates-all",
  description: "Lists all SSL/TLS certificates in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List All Certificates",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const certificates = await apiClient.get("/certificates.all");

    if (!certificates?.data) {
      return ResponseFormatter.error(
        "Failed to fetch certificates",
        "No certificates found",
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched all certificates`,
      certificates.data,
    );
  },
});
