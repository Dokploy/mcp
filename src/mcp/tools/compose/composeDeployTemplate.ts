import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeDeployTemplate = createTool({
  name: "compose-deployTemplate",
  description: "Deploys a compose project from a template.",
  schema: z.object({
    environmentId: z
      .string()
      .describe("The ID of the environment to deploy the template to."),
    id: z.string().describe("The ID of the template to deploy."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to deploy to."),
    baseUrl: z
      .string()
      .optional()
      .describe("Base URL for template repository."),
  }),
  annotations: {
    title: "Deploy Compose Template",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.deployTemplate", input);

    return ResponseFormatter.success(
      `Template "${input.id}" deployed successfully to environment "${input.environmentId}"`,
      response.data,
    );
  },
});
