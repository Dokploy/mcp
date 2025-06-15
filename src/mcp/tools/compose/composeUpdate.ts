import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeUpdate = createTool({
  name: "compose-update",
  description: "Updates an existing compose service in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose service to update."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("The new name of the compose service."),
    appName: z
      .string()
      .optional()
      .describe("The new app name of the compose service."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("The new description for the compose service."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables for the compose service."),
    composeFile: z
      .string()
      .nullable()
      .optional()
      .describe("The updated docker-compose.yml content."),
    composePath: z
      .string()
      .optional()
      .describe("The path to the compose file."),
    composeStatus: z
      .enum(["idle", "running", "done", "error"])
      .optional()
      .describe("The status of the compose service."),
    projectId: z
      .string()
      .optional()
      .describe("The project ID if moving to different project."),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("The server ID for the compose service."),
  }),
  annotations: {
    title: "Update Compose Service",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.update", input);

    return ResponseFormatter.success(
      `Compose service "${input.composeId}" updated successfully`,
      response.data
    );
  },
});
