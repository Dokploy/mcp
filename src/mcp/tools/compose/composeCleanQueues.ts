import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeCleanQueues = createTool({
  name: "compose-cleanQueues",
  description:
    "Cleans the deployment queues for a compose stack in Dokploy. Use this to unstick a stuck deployment.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose stack to clean queues for."),
  }),
  annotations: {
    title: "Clean Compose Queues",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.cleanQueues", input);

    return ResponseFormatter.success(
      `Compose stack "${input.composeId}" queues cleaned successfully`,
      response.data
    );
  },
});
