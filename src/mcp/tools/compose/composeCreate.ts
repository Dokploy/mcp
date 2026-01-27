import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeCreate = createTool({
  name: "compose-create",
  description: "Creates a new Docker Compose project in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the compose project."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("An optional description for the compose project."),
    environmentId: z
      .string()
      .describe(
        "The ID of the environment where the compose project will be created.",
      ),
    composeType: z
      .enum(["docker-compose", "stack"])
      .optional()
      .describe("The type of compose deployment (docker-compose or stack)."),
    appName: z
      .string()
      .optional()
      .describe("The app name for the compose project."),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("The ID of the server where the compose will be deployed."),
    composeFile: z
      .string()
      .optional()
      .describe("The initial compose file content."),
  }),
  annotations: {
    title: "Create Compose Project",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.create", input);

    return ResponseFormatter.success(
      `Compose project "${input.name}" created successfully in environment "${input.environmentId}"`,
      response.data,
    );
  },
});
