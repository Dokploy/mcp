import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeRedeploy = createTool({
  name: "compose-redeploy",
  description: "Redeploys a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to redeploy."),
  }),
  annotations: {
    title: "Redeploy Compose Stack",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.redeploy", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to redeploy compose stack", `Could not redeploy compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully redeployed compose stack "${input.composeId}"`, result.data);
  },
});
