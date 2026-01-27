import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeMove = createTool({
  name: "compose-move",
  description: "Moves a compose project to a different environment.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose project to move."),
    targetEnvironmentId: z
      .string()
      .describe("The ID of the destination environment."),
  }),
  annotations: {
    title: "Move Compose Project",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.move", input);

    return ResponseFormatter.success(
      `Compose project "${input.composeId}" moved to environment "${input.targetEnvironmentId}" successfully`,
      response.data,
    );
  },
});
