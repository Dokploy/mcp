import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeRandomizeCompose = createTool({
  name: "compose-randomizeCompose",
  description:
    "Randomizes the compose project names and identifiers to avoid conflicts.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to randomize."),
    suffix: z
      .string()
      .optional()
      .describe("Optional suffix to append to randomized names."),
  }),
  annotations: {
    title: "Randomize Compose Names",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.randomizeCompose", input);

    return ResponseFormatter.success(
      `Compose project "${input.composeId}" names randomized successfully`,
      response.data,
    );
  },
});
