import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeSaveEnvironment = createTool({
  name: "compose-saveEnvironment",
  description: "Saves environment variables for a compose service in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose service to save environment for."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables to save for the compose service."),
  }),
  annotations: {
    title: "Save Compose Environment Variables",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.saveEnvironment", input);

    return ResponseFormatter.success(
      `Environment variables saved for compose service "${input.composeId}"`,
      response.data
    );
  },
});
