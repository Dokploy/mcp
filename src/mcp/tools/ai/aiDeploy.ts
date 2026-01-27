import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const domainSchema = z.object({
  host: z.string().min(1).describe("The host domain for the service."),
  port: z.number().min(1).describe("The port number for the service."),
  serviceName: z.string().min(1).describe("The name of the service."),
});

const configFileSchema = z.object({
  filePath: z.string().min(1).describe("The path where the config file will be stored."),
  content: z.string().min(1).describe("The content of the config file."),
});

export const aiDeploy = createTool({
  name: "ai-deploy",
  description: "Deploys an AI-generated application configuration in Dokploy.",
  schema: z.object({
    environmentId: z
      .string()
      .min(1)
      .describe("The ID of the environment to deploy to. Required."),
    id: z.string().min(1).describe("The unique ID for the deployment. Required."),
    dockerCompose: z
      .string()
      .min(1)
      .describe("The Docker Compose configuration content. Required."),
    envVariables: z
      .string()
      .describe("Environment variables for the deployment in KEY=value format. Required."),
    serverId: z
      .string()
      .optional()
      .describe("The ID of the server to deploy to. Optional."),
    name: z.string().min(1).describe("The name of the deployment. Required."),
    description: z.string().describe("A description of the deployment. Required."),
    domains: z
      .array(domainSchema)
      .optional()
      .describe("Domain configurations for the deployment. Each domain requires host, port, and serviceName."),
    configFiles: z
      .array(configFileSchema)
      .optional()
      .describe("Configuration files for the deployment. Each file requires filePath and content."),
  }),
  annotations: {
    title: "Deploy AI Configuration",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const body: Record<string, unknown> = {
      environmentId: input.environmentId,
      id: input.id,
      dockerCompose: input.dockerCompose,
      envVariables: input.envVariables,
      name: input.name,
      description: input.description,
    };

    if (input.serverId) {
      body.serverId = input.serverId;
    }
    if (input.domains) {
      body.domains = input.domains;
    }
    if (input.configFiles) {
      body.configFiles = input.configFiles;
    }

    const response = await apiClient.post("/ai.deploy", body);

    return ResponseFormatter.success(
      `Successfully deployed AI configuration "${input.name}"`,
      response.data,
    );
  },
});
