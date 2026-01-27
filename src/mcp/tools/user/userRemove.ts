import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userRemove = createTool({
  name: "user-remove",
  description: "Removes a user from Dokploy.",
  schema: z.object({
    userId: z.string().describe("The ID of the user to remove."),
  }),
  annotations: {
    title: "Remove User",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/user.remove", input);

    return ResponseFormatter.success(
      `User "${input.userId}" removed successfully`,
      response.data,
    );
  },
});
