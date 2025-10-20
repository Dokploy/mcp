import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const domainByComposeId = createTool({
  name: "domain-byComposeId",
  description:
    "Retrieves all domains associated with a specific compose stack/service in Dokploy. Returns a list of domain configurations including SSL settings, paths, and routing information.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose service to retrieve domains for."),
  }),
  annotations: {
    title: "Get Domains by Compose ID",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.get("/domain.byComposeId", {
      params: {
        composeId: input.composeId,
      },
    });

    return ResponseFormatter.success(
      `Successfully retrieved domains for compose ${input.composeId}`,
      response.data
    );
  },
});
