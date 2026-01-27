import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userOne = createTool({
  name: "user-one",
  description: "Gets a specific user by their ID in Dokploy.",
  schema: z.object({
    userId: z.string().describe("The ID of the user to retrieve."),
  }),
  annotations: {
    title: "Get User Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(`/user.one?userId=${input.userId}`);

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch user",
        `User with ID "${input.userId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched user "${input.userId}"`,
      response.data,
    );
  },
});
