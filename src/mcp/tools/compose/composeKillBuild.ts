import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeKillBuild = createTool({
  name: "compose-killBuild",
  description: "Kills an ongoing build process for a compose project.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to kill build for."),
  }),
  annotations: {
    title: "Kill Compose Build",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.killBuild", input);

    return ResponseFormatter.success(
      `Build killed successfully for compose project "${input.composeId}"`,
      response.data,
    );
  },
});
