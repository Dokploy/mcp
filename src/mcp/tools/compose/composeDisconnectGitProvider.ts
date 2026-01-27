import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeDisconnectGitProvider = createTool({
  name: "compose-disconnectGitProvider",
  description: "Disconnects the Git provider from a compose project.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe(
        "The ID of the compose project to disconnect Git provider from.",
      ),
  }),
  annotations: {
    title: "Disconnect Compose Git Provider",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/compose.disconnectGitProvider",
      input,
    );

    return ResponseFormatter.success(
      `Git provider disconnected successfully for compose project "${input.composeId}"`,
      response.data,
    );
  },
});
