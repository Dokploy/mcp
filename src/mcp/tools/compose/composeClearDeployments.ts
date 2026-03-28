import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeClearDeployments = createTool({
  name: "compose-clearDeployments",
  description: "Clears deployments for a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to clear deployments for."),
  }),
  annotations: {
    title: "Clear Compose Deployments",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
    destructiveHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.clearDeployments", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to clear deployments", `Could not clear deployments for compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully cleared deployments for compose stack "${input.composeId}"`, result.data);
  },
});
