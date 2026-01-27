import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationOne = createTool({
  name: "organization-one",
  description: "Gets a specific organization by its ID in Dokploy.",
  schema: z.object({
    organizationId: z
      .string()
      .describe("The ID of the organization to retrieve."),
  }),
  annotations: {
    title: "Get Organization Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/organization.one?organizationId=${input.organizationId}`,
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch organization",
        `Organization with ID "${input.organizationId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched organization "${input.organizationId}"`,
      response.data,
    );
  },
});
