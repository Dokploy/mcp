import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeCreate = createTool({
  name: "compose-create",
  description: "Creates a new compose service in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the compose service."),
    appName: z
      .string()
      .optional()
      .describe("The app name for the compose service."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("An optional description for the compose service."),
    projectId: z
      .string()
      .min(1)
      .describe("The ID of the project where the compose service will be created."),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("The ID of the server where the compose service will be deployed."),
    composeFile: z
      .string()
      .optional()
      .describe("The docker-compose.yml content."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables for the compose service."),
    composeType: z
      .enum(["docker-compose", "stack"])
      .optional()
      .default("docker-compose")
      .describe("The type of compose deployment."),
  }),
  annotations: {
    title: "Create Compose Service",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.create", input);

    return ResponseFormatter.success(
      `Compose service "${input.name}" created successfully in project "${input.projectId}"`,
      response.data
    );
  },
});
