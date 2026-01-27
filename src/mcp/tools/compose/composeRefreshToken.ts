import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeRefreshToken = createTool({
  name: "compose-refreshToken",
  description: "Refreshes the token for a compose project.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to refresh token for."),
  }),
  annotations: {
    title: "Refresh Compose Token",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.refreshToken", input);

    return ResponseFormatter.success(
      `Token refreshed successfully for compose project "${input.composeId}"`,
      response.data,
    );
  },
});
