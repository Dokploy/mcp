import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeUpdate = createTool({
  name: "compose-update",
  description: "Updates an existing compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to update."),
    name: z.string().optional().describe("The new name of the compose stack."),
    appName: z.string().optional().describe("The new app name of the compose stack."),
    description: z.string().optional().describe("An optional description for the compose stack."),
    env: z.string().optional().describe("Environment variables for the compose stack."),
    composeFile: z.string().optional().describe("The compose file content."),
    refreshToken: z.string().optional().describe("Refresh token for the compose stack."),
    sourceType: z.string().optional().describe("Source type for the compose stack."),
    composeType: z.string().optional().describe("The type of compose stack."),
    repository: z.string().optional().describe("Repository URL."),
    owner: z.string().optional().describe("Repository owner."),
    branch: z.string().optional().describe("Repository branch."),
    autoDeploy: z.boolean().optional().describe("Whether to auto-deploy."),
    composePath: z.string().optional().describe("Path to the compose file in the repository."),
    command: z.string().optional().describe("Custom command to run."),
  }),
  annotations: {
    title: "Update Compose Stack",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.update", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to update compose stack", `Could not update compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully updated compose stack "${input.composeId}"`, result.data);
  },
});
