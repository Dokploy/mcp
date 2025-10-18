import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const applicationUpdate = createTool({
  name: "application-update",
  description: "Updates an existing application in Dokploy.",
  schema: z.object({
    applicationId: z.string().describe("The ID of the application to update."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("The new name of the application."),
    appName: z
      .string()
      .optional()
      .describe("The new app name of the application."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("The new description for the application."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables for the application."),
    previewEnv: z
      .string()
      .nullable()
      .optional()
      .describe("Preview environment variables."),
    watchPaths: z
      .array(z.string())
      .nullable()
      .optional()
      .describe("Paths to watch for changes."),
    previewBuildArgs: z
      .string()
      .nullable()
      .optional()
      .describe("Preview build arguments."),
    previewLabels: z
      .array(z.string())
      .nullable()
      .optional()
      .describe("Preview labels."),
    previewWildcard: z
      .string()
      .nullable()
      .optional()
      .describe("Preview wildcard configuration."),
    previewPort: z
      .number()
      .nullable()
      .optional()
      .describe("Preview port number."),
    previewHttps: z.boolean().optional().describe("Enable HTTPS for preview."),
    previewPath: z.string().nullable().optional().describe("Preview path."),
    previewCertificateType: z
      .enum(["letsencrypt", "none", "custom"])
      .optional()
      .describe("Preview certificate type."),
    previewCustomCertResolver: z
      .string()
      .nullable()
      .optional()
      .describe("Custom certificate resolver for preview."),
    previewLimit: z
      .number()
      .nullable()
      .optional()
      .describe("Preview deployment limit."),
    isPreviewDeploymentsActive: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether preview deployments are active."),
    previewRequireCollaboratorPermissions: z
      .boolean()
      .nullable()
      .optional()
      .describe(
        "Whether preview deployments require collaborator permissions."
      ),
    rollbackActive: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether rollback is active."),
    buildArgs: z.string().nullable().optional().describe("Build arguments."),
    memoryReservation: z
      .string()
      .nullable()
      .optional()
      .describe("Memory reservation for the application."),
    memoryLimit: z
      .string()
      .nullable()
      .optional()
      .describe("Memory limit for the application."),
    cpuReservation: z
      .string()
      .nullable()
      .optional()
      .describe("CPU reservation for the application."),
    cpuLimit: z
      .string()
      .nullable()
      .optional()
      .describe("CPU limit for the application."),
    title: z.string().nullable().optional().describe("Application title."),
    enabled: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether the application is enabled."),
    subtitle: z
      .string()
      .nullable()
      .optional()
      .describe("Application subtitle."),
    command: z
      .string()
      .nullable()
      .optional()
      .describe("Command to run the application."),
    refreshToken: z
      .string()
      .nullable()
      .optional()
      .describe("Refresh token for the application."),
    sourceType: z
      .enum(["github", "docker", "git", "gitlab", "bitbucket", "gitea", "drop"])
      .optional()
      .describe("Source type for the application."),
    cleanCache: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether to clean cache on build."),
    repository: z.string().nullable().optional().describe("Repository URL."),
    owner: z.string().nullable().optional().describe("Repository owner."),
    branch: z.string().nullable().optional().describe("Repository branch."),
    buildPath: z
      .string()
      .nullable()
      .optional()
      .describe("Build path within repository."),
    triggerType: z
      .enum(["push", "tag"])
      .nullable()
      .optional()
      .describe("Trigger type for deployments."),
    autoDeploy: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether to auto-deploy."),
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
    gitlabBuildPath: z
      .string()
      .nullable()
      .optional()
      .describe("GitLab build path."),
    gitlabPathNamespace: z
      .string()
      .nullable()
      .optional()
      .describe("GitLab path namespace."),
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
    giteaBuildPath: z
      .string()
      .nullable()
      .optional()
      .describe("Gitea build path."),
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
    bitbucketBuildPath: z
      .string()
      .nullable()
      .optional()
      .describe("Bitbucket build path."),
    username: z
      .string()
      .nullable()
      .optional()
      .describe("Username for authentication."),
    password: z
      .string()
      .nullable()
      .optional()
      .describe("Password for authentication."),
    dockerImage: z.string().nullable().optional().describe("Docker image."),
    registryUrl: z
      .string()
      .nullable()
      .optional()
      .describe("Docker registry URL."),
    customGitUrl: z.string().nullable().optional().describe("Custom Git URL."),
    customGitBranch: z
      .string()
      .nullable()
      .optional()
      .describe("Custom Git branch."),
    customGitBuildPath: z
      .string()
      .nullable()
      .optional()
      .describe("Custom Git build path."),
    customGitSSHKeyId: z
      .string()
      .nullable()
      .optional()
      .describe("Custom Git SSH key ID."),
    enableSubmodules: z
      .boolean()
      .optional()
      .describe("Whether to enable Git submodules."),
    dockerfile: z
      .string()
      .nullable()
      .optional()
      .describe("Dockerfile content or path."),
    dockerContextPath: z
      .string()
      .nullable()
      .optional()
      .describe("Docker context path."),
    dockerBuildStage: z
      .string()
      .nullable()
      .optional()
      .describe("Docker build stage."),
    dropBuildPath: z
      .string()
      .nullable()
      .optional()
      .describe("Drop build path."),
    healthCheckSwarm: z
      .object({
        Test: z.array(z.string()).optional(),
        Interval: z.number().optional(),
        Timeout: z.number().optional(),
        StartPeriod: z.number().optional(),
        Retries: z.number().optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm health check configuration."),
    restartPolicySwarm: z
      .object({
        Condition: z.string().optional(),
        Delay: z.number().optional(),
        MaxAttempts: z.number().optional(),
        Window: z.number().optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm restart policy configuration."),
    placementSwarm: z
      .object({
        Constraints: z.array(z.string()).optional(),
        Preferences: z
          .array(
            z.object({
              Spread: z.object({
                SpreadDescriptor: z.string(),
              }),
            })
          )
          .optional(),
        MaxReplicas: z.number().optional(),
        Platforms: z
          .array(
            z.object({
              Architecture: z.string(),
              OS: z.string(),
            })
          )
          .optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm placement configuration."),
    updateConfigSwarm: z
      .object({
        Parallelism: z.number(),
        Delay: z.number().optional(),
        FailureAction: z.string().optional(),
        Monitor: z.number().optional(),
        MaxFailureRatio: z.number().optional(),
        Order: z.string(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm update configuration."),
    rollbackConfigSwarm: z
      .object({
        Parallelism: z.number(),
        Delay: z.number().optional(),
        FailureAction: z.string().optional(),
        Monitor: z.number().optional(),
        MaxFailureRatio: z.number().optional(),
        Order: z.string(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm rollback configuration."),
    modeSwarm: z
      .object({
        Replicated: z
          .object({
            Replicas: z.number().optional(),
          })
          .optional(),
        Global: z.object({}).optional(),
        ReplicatedJob: z
          .object({
            MaxConcurrent: z.number().optional(),
            TotalCompletions: z.number().optional(),
          })
          .optional(),
        GlobalJob: z.object({}).optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm mode configuration."),
    labelsSwarm: z
      .record(z.string())
      .nullable()
      .optional()
      .describe("Docker Swarm labels."),
    networkSwarm: z
      .array(
        z.object({
          Target: z.string().optional(),
          Aliases: z.array(z.string()).optional(),
          DriverOpts: z.object({}).optional(),
        })
      )
      .nullable()
      .optional()
      .describe("Docker Swarm network configuration."),
    stopGracePeriodSwarm: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe("Docker Swarm stop grace period in seconds."),
    replicas: z.number().optional().describe("Number of replicas."),
    applicationStatus: z
      .enum(["idle", "running", "done", "error"])
      .optional()
      .describe("Application status."),
    buildType: z
      .enum([
        "dockerfile",
        "heroku_buildpacks",
        "paketo_buildpacks",
        "nixpacks",
        "static",
        "railpack",
      ])
      .optional()
      .describe("Build type."),
    railpackVersion: z
      .string()
      .nullable()
      .optional()
      .describe("Railpack version."),
    herokuVersion: z.string().nullable().optional().describe("Heroku version."),
    publishDirectory: z
      .string()
      .nullable()
      .optional()
      .describe("Publish directory."),
    isStaticSpa: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether the application is a static SPA."),
    createdAt: z.string().optional().describe("Creation date."),
    registryId: z.string().nullable().optional().describe("Registry ID."),
    environmentId: z.string().optional().describe("Environment ID."),
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
    giteaId: z.string().nullable().optional().describe("Gitea integration ID."),
    bitbucketId: z
      .string()
      .nullable()
      .optional()
      .describe("Bitbucket integration ID."),
  }),
  annotations: {
    title: "Update Application",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/application.update", input);

    return ResponseFormatter.success(
      `Application "${input.applicationId}" updated successfully`,
      response.data
    );
  },
});
