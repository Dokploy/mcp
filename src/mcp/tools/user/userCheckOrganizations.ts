import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userCheckOrganizations = createTool({
  name: "user-check-organizations",
  description: "Checks the organizations a user belongs to in Dokploy.",
  schema: z.object({
    userId: z
      .string()
      .describe("The ID of the user to check organizations for."),
  }),
  annotations: {
    title: "Check User Organizations",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/user.checkUserOrganizations?userId=${input.userId}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched organizations for user "${input.userId}"`,
      response.data,
    );
  },
});
