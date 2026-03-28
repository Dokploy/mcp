import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeStop = createTool({
  name: "compose-stop",
  description: "Stops a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to stop."),
  }),
  annotations: {
    title: "Stop Compose Stack",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.stop", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to stop compose stack", `Could not stop compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully stopped compose stack "${input.composeId}"`, result.data);
  },
});
