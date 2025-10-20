import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const domainByApplicationId = createTool({
  name: "domain-byApplicationId",
  description:
    "Retrieves all domains associated with a specific application in Dokploy. Returns a list of domain configurations including SSL settings, paths, and routing information.",
  schema: z.object({
    applicationId: z
      .string()
      .min(1)
      .describe("The ID of the application to retrieve domains for."),
  }),
  annotations: {
    title: "Get Domains by Application ID",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.get("/domain.byApplicationId", {
      params: {
        applicationId: input.applicationId,
      },
    });

    return ResponseFormatter.success(
      `Successfully retrieved domains for application ${input.applicationId}`,
      response.data
    );
  },
});
