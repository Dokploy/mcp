import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeIsolatedDeployment = createTool({
  name: "compose-isolatedDeployment",
  description: "Creates an isolated deployment of a compose project.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project for isolated deployment."),
    suffix: z
      .string()
      .optional()
      .describe("Optional suffix for the isolated deployment."),
  }),
  annotations: {
    title: "Isolated Compose Deployment",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.isolatedDeployment", input);

    return ResponseFormatter.success(
      `Isolated deployment started for compose project "${input.composeId}"`,
      response.data,
    );
  },
});
