import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeIsolatedDeployment = createTool({
  name: "compose-isolatedDeployment",
  description: "Creates an isolated deployment for a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack."),
    suffix: z.string().optional().describe("An optional suffix for the isolated deployment."),
  }),
  annotations: {
    title: "Create Isolated Deployment",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.isolatedDeployment", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to create isolated deployment", `Could not create isolated deployment for compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully created isolated deployment for compose stack "${input.composeId}"`, result.data);
  },
});
