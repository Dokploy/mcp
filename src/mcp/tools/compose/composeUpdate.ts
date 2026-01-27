import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeUpdate = createTool({
  name: "compose-update",
  description: "Updates an existing Docker Compose project in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose project to update."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("The new name of the compose project."),
    appName: z
      .string()
      .optional()
      .describe("The new app name of the compose project."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("The new description for the compose project."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables for the compose project."),
    composeFile: z.string().optional().describe("The compose file content."),
    refreshToken: z
      .string()
      .nullable()
      .optional()
      .describe("Refresh token for the compose project."),
    sourceType: z
      .enum(["git", "github", "gitlab", "bitbucket", "gitea", "raw"])
      .optional()
      .describe("Source type for the compose project."),
    composeType: z
      .enum(["docker-compose", "stack"])
      .optional()
      .describe("The type of compose deployment."),
    repository: z.string().nullable().optional().describe("Repository URL."),
    owner: z.string().nullable().optional().describe("Repository owner."),
    branch: z.string().nullable().optional().describe("Repository branch."),
    autoDeploy: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether to auto-deploy on changes."),
    gitlabProjectId: z
      .number()
      .nullable()
      .optional()
      .describe("GitLab project ID."),
    gitlabRepository: z
      .string()
      .nullable()
      .optional()
      .describe("GitLab repository."),
    gitlabOwner: z
      .string()
      .nullable()
      .optional()
      .describe("GitLab repository owner."),
    gitlabBranch: z.string().nullable().optional().describe("GitLab branch."),
    gitlabPathNamespace: z
      .string()
      .nullable()
      .optional()
      .describe("GitLab path namespace."),
    bitbucketRepository: z
      .string()
      .nullable()
      .optional()
      .describe("Bitbucket repository."),
    bitbucketOwner: z
      .string()
      .nullable()
      .optional()
      .describe("Bitbucket repository owner."),
    bitbucketBranch: z
      .string()
      .nullable()
      .optional()
      .describe("Bitbucket branch."),
    giteaRepository: z
      .string()
      .nullable()
      .optional()
      .describe("Gitea repository."),
    giteaOwner: z
      .string()
      .nullable()
      .optional()
      .describe("Gitea repository owner."),
    giteaBranch: z.string().nullable().optional().describe("Gitea branch."),
    customGitUrl: z.string().nullable().optional().describe("Custom Git URL."),
    customGitBranch: z
      .string()
      .nullable()
      .optional()
      .describe("Custom Git branch."),
    customGitSSHKeyId: z
      .string()
      .nullable()
      .optional()
      .describe("Custom Git SSH key ID."),
    command: z.string().optional().describe("Command to run."),
    enableSubmodules: z
      .boolean()
      .optional()
      .describe("Whether to enable Git submodules."),
    composePath: z
      .string()
      .min(1)
      .optional()
      .describe("Path to the compose file."),
    suffix: z.string().optional().describe("Suffix for the compose project."),
    randomize: z
      .boolean()
      .optional()
      .describe("Whether to randomize the compose project names."),
    isolatedDeployment: z
      .boolean()
      .optional()
      .describe("Whether to use isolated deployment."),
    isolatedDeploymentsVolume: z
      .boolean()
      .optional()
      .describe("Whether to isolate deployment volumes."),
    triggerType: z
      .enum(["push", "tag"])
      .nullable()
      .optional()
      .describe("Trigger type for deployments."),
    composeStatus: z
      .enum(["idle", "running", "done", "error"])
      .optional()
      .describe("Compose project status."),
    environmentId: z.string().optional().describe("Environment ID."),
    createdAt: z.string().optional().describe("Creation date."),
    watchPaths: z
      .array(z.string())
      .nullable()
      .optional()
      .describe("Paths to watch for changes."),
    githubId: z
      .string()
      .nullable()
      .optional()
      .describe("GitHub integration ID."),
    gitlabId: z
      .string()
      .nullable()
      .optional()
      .describe("GitLab integration ID."),
    bitbucketId: z
      .string()
      .nullable()
      .optional()
      .describe("Bitbucket integration ID."),
    giteaId: z.string().nullable().optional().describe("Gitea integration ID."),
  }),
  annotations: {
    title: "Update Compose Project",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.update", input);

    return ResponseFormatter.success(
      `Compose project "${input.composeId}" updated successfully`,
      response.data,
    );
  },
});
