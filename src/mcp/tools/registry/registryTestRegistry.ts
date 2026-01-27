import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const registryTestRegistry = createTool({
  name: "registry-test",
  description: "Tests connection to a container registry in Dokploy.",
  schema: z.object({
    registryName: z.string().optional().describe("Name for the registry. Optional."),
    username: z
      .string()
      .min(1)
      .describe("Username for registry authentication. Required."),
    password: z
      .string()
      .min(1)
      .describe("Password or access token for registry authentication. Required."),
    registryUrl: z.string().describe("URL of the container registry to test (e.g., 'docker.io', 'ghcr.io'). Required."),
    registryType: z.enum(["cloud"]).describe("Type of the registry. Currently only 'cloud' is supported. Required."),
    imagePrefix: z
      .string()
      .nullable()
      .optional()
      .describe("Prefix for images in this registry. Optional."),
    serverId: z
      .string()
      .optional()
      .describe("Server ID to run the test from. Optional."),
  }),
  annotations: {
    title: "Test Registry Connection",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/registry.testRegistry", input);

    return ResponseFormatter.success(
      `Registry connection test completed successfully`,
      response.data,
    );
  },
});
