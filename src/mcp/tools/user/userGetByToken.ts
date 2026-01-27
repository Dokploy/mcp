import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGetByToken = createTool({
  name: "user-get-by-token",
  description: "Gets a user by their token in Dokploy.",
  schema: z.object({
    token: z.string().min(1).describe("The token to look up the user."),
  }),
  annotations: {
    title: "Get User By Token",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/user.getUserByToken?token=${input.token}`,
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch user",
        "User with the provided token not found",
      );
    }

    return ResponseFormatter.success(
      "Successfully fetched user by token",
      response.data,
    );
  },
});
