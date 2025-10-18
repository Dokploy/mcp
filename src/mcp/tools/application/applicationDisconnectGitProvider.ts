import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const applicationDisconnectGitProvider = createTool({
  name: "application-disconnectGitProvider",
  description:
    "Disconnects Git provider configuration from an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .describe("The ID of the application to disconnect Git provider from."),
  }),
  annotations: {
    title: "Disconnect Application Git Provider",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/application.disconnectGitProvider",
      input
    );

    return ResponseFormatter.success(
      `Git provider for application "${input.applicationId}" disconnected successfully`,
      response.data
    );
  },
});
