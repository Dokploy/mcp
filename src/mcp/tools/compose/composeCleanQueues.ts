import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeCleanQueues = createTool({
  name: "compose-cleanQueues",
  description: "Cleans the deployment queues for a compose project.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to clean queues for."),
  }),
  annotations: {
    title: "Clean Compose Queues",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.cleanQueues", input);

    return ResponseFormatter.success(
      `Queues cleaned successfully for compose project "${input.composeId}"`,
      response.data,
    );
  },
});
