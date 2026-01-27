import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const registryCreate = createTool({
  name: "registry-create",
  description: "Creates a new container registry in Dokploy.",
  schema: z.object({
    registryName: z.string().min(1).describe("A friendly name for the registry. Required."),
    username: z
      .string()
      .min(1)
      .describe("Username for registry authentication. Required."),
    password: z
      .string()
      .min(1)
      .describe("Password or access token for registry authentication. Required."),
    registryUrl: z.string().describe("URL of the container registry (e.g., 'docker.io', 'ghcr.io', 'registry.example.com'). Required."),
    registryType: z.enum(["cloud"]).describe("Type of the registry. Currently only 'cloud' is supported. Required."),
    imagePrefix: z
      .string()
      .nullable()
      .describe("Prefix for images in this registry (e.g., 'myorg' for 'myorg/image:tag'). Required, can be null."),
    serverId: z
      .string()
      .optional()
      .describe("Server ID to associate the registry with. Optional."),
  }),
  annotations: {
    title: "Create Registry",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/registry.create", input);

    return ResponseFormatter.success(
      `Registry "${input.registryName}" created successfully`,
      response.data,
    );
  },
});
