import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const applicationSaveGitProvider = createTool({
  name: "application-saveGitProvider",
  description:
    "Saves Git provider configuration for an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .describe("The ID of the application to save Git provider for."),
    customGitUrl: z
      .string()
      .nullable()
      .optional()
      .describe("The custom Git repository URL."),
    customGitBranch: z
      .string()
      .nullable()
      .optional()
      .describe("The branch to use from the repository."),
    customGitBuildPath: z
      .string()
      .nullable()
      .optional()
      .describe("The path within the repository to build from."),
    customGitSSHKeyId: z
      .string()
      .nullable()
      .optional()
      .describe("The SSH key ID for Git authentication."),
    watchPaths: z
      .array(z.string())
      .nullable()
      .optional()
      .describe("Array of paths to watch for changes."),
    enableSubmodules: z.boolean().describe("Whether to enable submodules."),
  }),
  annotations: {
    title: "Save Application Git Provider",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/application.saveGitProvider",
      input
    );

    return ResponseFormatter.success(
      `Git provider for application "${input.applicationId}" saved successfully`,
      response.data
    );
  },
});
