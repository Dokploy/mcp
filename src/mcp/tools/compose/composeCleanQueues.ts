import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeCleanQueues = createTool({
  name: "compose-cleanQueues",
  description: "Cleans the queues for a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to clean queues for."),
  }),
  annotations: {
    title: "Clean Compose Queues",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.cleanQueues", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to clean queues", `Could not clean queues for compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully cleaned queues for compose stack "${input.composeId}"`, result.data);
  },
});
