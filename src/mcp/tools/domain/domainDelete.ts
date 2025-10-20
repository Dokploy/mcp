import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const domainDelete = createTool({
  name: "domain-delete",
  description: "Deletes an existing domain configuration in Dokploy by its ID.",
  schema: z.object({
    domainId: z.string().min(1).describe("The ID of the domain to delete."),
  }),
  annotations: {
    title: "Delete Domain",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/domain.delete", {
      domainId: input.domainId,
    });

    return ResponseFormatter.success(
      `Domain ${input.domainId} deleted successfully`,
      response.data
    );
  },
});
