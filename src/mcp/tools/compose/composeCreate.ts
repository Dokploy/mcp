import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeCreate = createTool({
  name: "compose-create",
  description: "Creates a new compose stack in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the compose stack."),
    environmentId: z.string().min(1).describe("The ID of the environment where the compose stack will be created."),
    description: z.string().optional().describe("An optional description for the compose stack."),
    composeType: z.string().optional().describe("The type of compose stack."),
    appName: z.string().optional().describe("The app name for the compose stack."),
    serverId: z.string().optional().describe("The ID of the server where the compose stack will be deployed."),
    composeFile: z.string().optional().describe("The compose file content."),
  }),
  annotations: {
    title: "Create Compose Stack",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.create", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to create compose stack", `Could not create compose stack "${input.name}"`);
    }
    return ResponseFormatter.success(`Successfully created compose stack "${input.name}"`, result.data);
  },
});
