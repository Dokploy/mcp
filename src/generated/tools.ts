// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Generated from openapi.json on 2026-04-09
// Run `pnpm generate` to regenerate

import { z } from "zod";
import type { ToolDefinition } from "../types.js";

export const generatedTools: ToolDefinition[] = [
  {
    name: "admin-setupMonitoring",
    description: "POST /admin.setupMonitoring",
    tag: "admin",
    method: "POST",
    path: "/admin.setupMonitoring",
    schema: z.object({
      metricsConfig: z.object({
        server: z.object({
          refreshRate: z.number().gte(2),
          port: z.number().gte(1),
          token: z.string(),
          urlCallback: z.string().url(),
          retentionDays: z.number().gte(1),
          cronJob: z.string().min(1),
          thresholds: z.object({ cpu: z.number().gte(0), memory: z.number().gte(0) }),
        }),
        containers: z.object({
          refreshRate: z.number().gte(2),
          services: z.object({
            include: z.array(z.string()).optional(),
            exclude: z.array(z.string()).optional(),
          }),
        }),
      }),
    }),
    annotations: {
      title: "Admin SetupMonitoring",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-create",
    description: "POST /application.create",
    tag: "application",
    method: "POST",
    path: "/application.create",
    schema: z.object({
      name: z.string().min(1),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      environmentId: z.string(),
      serverId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Application Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "application-one",
    description: "GET /application.one",
    tag: "application",
    method: "GET",
    path: "/application.one",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-reload",
    description: "POST /application.reload",
    tag: "application",
    method: "POST",
    path: "/application.reload",
    schema: z.object({
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63),
      applicationId: z.string(),
    }),
    annotations: {
      title: "Application Reload",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-delete",
    description: "POST /application.delete",
    tag: "application",
    method: "POST",
    path: "/application.delete",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-stop",
    description: "POST /application.stop",
    tag: "application",
    method: "POST",
    path: "/application.stop",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-start",
    description: "POST /application.start",
    tag: "application",
    method: "POST",
    path: "/application.start",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-redeploy",
    description: "POST /application.redeploy",
    tag: "application",
    method: "POST",
    path: "/application.redeploy",
    schema: z.object({
      applicationId: z.string().min(1),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    annotations: {
      title: "Application Redeploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveEnvironment",
    description: "POST /application.saveEnvironment",
    tag: "application",
    method: "POST",
    path: "/application.saveEnvironment",
    schema: z.object({
      applicationId: z.string(),
      env: z.union([z.string(), z.null()]),
      buildArgs: z.union([z.string(), z.null()]),
      buildSecrets: z.union([z.string(), z.null()]),
      createEnvFile: z.boolean(),
    }),
    annotations: {
      title: "Application SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveBuildType",
    description: "POST /application.saveBuildType",
    tag: "application",
    method: "POST",
    path: "/application.saveBuildType",
    schema: z.object({
      applicationId: z.string(),
      buildType: z.enum([
        "dockerfile",
        "heroku_buildpacks",
        "paketo_buildpacks",
        "nixpacks",
        "static",
        "railpack",
      ]),
      dockerfile: z.union([z.string(), z.null()]),
      dockerContextPath: z.union([z.string(), z.null()]),
      dockerBuildStage: z.union([z.string(), z.null()]),
      herokuVersion: z.union([z.string(), z.null()]),
      railpackVersion: z.union([z.string(), z.null()]),
      publishDirectory: z.union([z.string(), z.null()]).optional(),
      isStaticSpa: z.union([z.boolean(), z.null()]).optional(),
    }),
    annotations: {
      title: "Application SaveBuildType",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveGithubProvider",
    description: "POST /application.saveGithubProvider",
    tag: "application",
    method: "POST",
    path: "/application.saveGithubProvider",
    schema: z.object({
      applicationId: z.string(),
      repository: z.union([z.string(), z.null()]),
      branch: z.union([z.string(), z.null()]),
      owner: z.union([z.string(), z.null()]),
      buildPath: z.union([z.string(), z.null()]),
      githubId: z.union([z.string(), z.null()]),
      triggerType: z.enum(["push", "tag"]).default("push"),
      enableSubmodules: z.boolean().optional(),
      watchPaths: z.union([z.array(z.string()), z.null()]).optional(),
    }),
    annotations: {
      title: "Application SaveGithubProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveGitlabProvider",
    description: "POST /application.saveGitlabProvider",
    tag: "application",
    method: "POST",
    path: "/application.saveGitlabProvider",
    schema: z.object({
      applicationId: z.string(),
      gitlabBranch: z.union([z.string(), z.null()]),
      gitlabBuildPath: z.union([z.string(), z.null()]),
      gitlabOwner: z.union([z.string(), z.null()]),
      gitlabRepository: z.union([z.string(), z.null()]),
      gitlabId: z.union([z.string(), z.null()]),
      gitlabProjectId: z.union([z.number(), z.null()]),
      gitlabPathNamespace: z.union([z.string(), z.null()]),
      enableSubmodules: z.boolean().optional(),
      watchPaths: z.union([z.array(z.string()), z.null()]).optional(),
    }),
    annotations: {
      title: "Application SaveGitlabProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveBitbucketProvider",
    description: "POST /application.saveBitbucketProvider",
    tag: "application",
    method: "POST",
    path: "/application.saveBitbucketProvider",
    schema: z.object({
      bitbucketBranch: z.union([z.string(), z.null()]),
      bitbucketBuildPath: z.union([z.string(), z.null()]),
      bitbucketOwner: z.union([z.string(), z.null()]),
      bitbucketRepository: z.union([z.string(), z.null()]),
      bitbucketRepositorySlug: z.union([z.string(), z.null()]),
      bitbucketId: z.union([z.string(), z.null()]),
      applicationId: z.string(),
      enableSubmodules: z.boolean().optional(),
      watchPaths: z.union([z.array(z.string()), z.null()]).optional(),
    }),
    annotations: {
      title: "Application SaveBitbucketProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveGiteaProvider",
    description: "POST /application.saveGiteaProvider",
    tag: "application",
    method: "POST",
    path: "/application.saveGiteaProvider",
    schema: z.object({
      applicationId: z.string(),
      giteaBranch: z.union([z.string(), z.null()]),
      giteaBuildPath: z.union([z.string(), z.null()]),
      giteaOwner: z.union([z.string(), z.null()]),
      giteaRepository: z.union([z.string(), z.null()]),
      giteaId: z.union([z.string(), z.null()]),
      enableSubmodules: z.boolean().optional(),
      watchPaths: z.union([z.array(z.string()), z.null()]).optional(),
    }),
    annotations: {
      title: "Application SaveGiteaProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveDockerProvider",
    description: "POST /application.saveDockerProvider",
    tag: "application",
    method: "POST",
    path: "/application.saveDockerProvider",
    schema: z.object({
      dockerImage: z.union([z.string(), z.null()]),
      applicationId: z.string(),
      username: z.union([z.string(), z.null()]),
      password: z.union([z.string(), z.null()]),
      registryUrl: z.union([z.string(), z.null()]),
    }),
    annotations: {
      title: "Application SaveDockerProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-saveGitProvider",
    description: "POST /application.saveGitProvider",
    tag: "application",
    method: "POST",
    path: "/application.saveGitProvider",
    schema: z.object({
      customGitBranch: z.union([z.string(), z.null()]),
      applicationId: z.string(),
      customGitBuildPath: z.union([z.string(), z.null()]),
      customGitUrl: z.union([z.string(), z.null()]),
      watchPaths: z.union([z.array(z.string()), z.null()]),
      enableSubmodules: z.boolean().optional(),
      customGitSSHKeyId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Application SaveGitProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-disconnectGitProvider",
    description: "POST /application.disconnectGitProvider",
    tag: "application",
    method: "POST",
    path: "/application.disconnectGitProvider",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application DisconnectGitProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-markRunning",
    description: "POST /application.markRunning",
    tag: "application",
    method: "POST",
    path: "/application.markRunning",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application MarkRunning",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-update",
    description: "POST /application.update",
    tag: "application",
    method: "POST",
    path: "/application.update",
    schema: z.object({
      applicationId: z.string().min(1),
      name: z.string().min(1).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      previewEnv: z.union([z.string(), z.null()]).optional(),
      watchPaths: z.union([z.array(z.string()), z.null()]).optional(),
      previewBuildArgs: z.union([z.string(), z.null()]).optional(),
      previewBuildSecrets: z.union([z.string(), z.null()]).optional(),
      previewLabels: z.union([z.array(z.string()), z.null()]).optional(),
      previewWildcard: z.union([z.string(), z.null()]).optional(),
      previewPort: z.union([z.number(), z.null()]).optional(),
      previewHttps: z.boolean().optional(),
      previewPath: z.union([z.string(), z.null()]).optional(),
      previewCertificateType: z.enum(["letsencrypt", "none", "custom"]).optional(),
      previewCustomCertResolver: z.union([z.string(), z.null()]).optional(),
      previewLimit: z.union([z.number(), z.null()]).optional(),
      isPreviewDeploymentsActive: z.union([z.boolean(), z.null()]).optional(),
      previewRequireCollaboratorPermissions: z.union([z.boolean(), z.null()]).optional(),
      rollbackActive: z.union([z.boolean(), z.null()]).optional(),
      buildArgs: z.union([z.string(), z.null()]).optional(),
      buildSecrets: z.union([z.string(), z.null()]).optional(),
      memoryReservation: z.union([z.string(), z.null()]).optional(),
      memoryLimit: z.union([z.string(), z.null()]).optional(),
      cpuReservation: z.union([z.string(), z.null()]).optional(),
      cpuLimit: z.union([z.string(), z.null()]).optional(),
      title: z.union([z.string(), z.null()]).optional(),
      enabled: z.union([z.boolean(), z.null()]).optional(),
      subtitle: z.union([z.string(), z.null()]).optional(),
      command: z.union([z.string(), z.null()]).optional(),
      args: z.union([z.array(z.string()), z.null()]).optional(),
      icon: z.union([z.union([z.string().max(2097152), z.null()]), z.null()]).optional(),
      refreshToken: z.union([z.string(), z.null()]).optional(),
      sourceType: z
        .enum(["github", "docker", "git", "gitlab", "bitbucket", "gitea", "drop"])
        .optional(),
      cleanCache: z.union([z.boolean(), z.null()]).optional(),
      repository: z.union([z.string(), z.null()]).optional(),
      owner: z.union([z.string(), z.null()]).optional(),
      branch: z.union([z.string(), z.null()]).optional(),
      buildPath: z.union([z.string(), z.null()]).optional(),
      triggerType: z.union([z.enum(["push", "tag"]), z.null()]).optional(),
      autoDeploy: z.union([z.boolean(), z.null()]).optional(),
      gitlabProjectId: z.union([z.number(), z.null()]).optional(),
      gitlabRepository: z.union([z.string(), z.null()]).optional(),
      gitlabOwner: z.union([z.string(), z.null()]).optional(),
      gitlabBranch: z.union([z.string(), z.null()]).optional(),
      gitlabBuildPath: z.union([z.string(), z.null()]).optional(),
      gitlabPathNamespace: z.union([z.string(), z.null()]).optional(),
      giteaRepository: z.union([z.string(), z.null()]).optional(),
      giteaOwner: z.union([z.string(), z.null()]).optional(),
      giteaBranch: z.union([z.string(), z.null()]).optional(),
      giteaBuildPath: z.union([z.string(), z.null()]).optional(),
      bitbucketRepository: z.union([z.string(), z.null()]).optional(),
      bitbucketRepositorySlug: z.union([z.string(), z.null()]).optional(),
      bitbucketOwner: z.union([z.string(), z.null()]).optional(),
      bitbucketBranch: z.union([z.string(), z.null()]).optional(),
      bitbucketBuildPath: z.union([z.string(), z.null()]).optional(),
      username: z.union([z.string(), z.null()]).optional(),
      password: z.union([z.string(), z.null()]).optional(),
      dockerImage: z.union([z.string(), z.null()]).optional(),
      registryUrl: z.union([z.string(), z.null()]).optional(),
      customGitUrl: z.union([z.string(), z.null()]).optional(),
      customGitBranch: z.union([z.string(), z.null()]).optional(),
      customGitBuildPath: z.union([z.string(), z.null()]).optional(),
      customGitSSHKeyId: z.union([z.string(), z.null()]).optional(),
      enableSubmodules: z.boolean().optional(),
      dockerfile: z.union([z.string(), z.null()]).optional(),
      dockerContextPath: z.union([z.string(), z.null()]).optional(),
      dockerBuildStage: z.union([z.string(), z.null()]).optional(),
      dropBuildPath: z.union([z.string(), z.null()]).optional(),
      healthCheckSwarm: z
        .union([
          z.union([
            z
              .object({
                Test: z.array(z.string()).optional(),
                Interval: z.number().optional(),
                Timeout: z.number().optional(),
                StartPeriod: z.number().optional(),
                Retries: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      restartPolicySwarm: z
        .union([
          z.union([
            z
              .object({
                Condition: z.string().optional(),
                Delay: z.number().optional(),
                MaxAttempts: z.number().optional(),
                Window: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      placementSwarm: z
        .union([
          z.union([
            z
              .object({
                Constraints: z.array(z.string()).optional(),
                Preferences: z
                  .array(z.object({ Spread: z.object({ SpreadDescriptor: z.string() }) }).strict())
                  .optional(),
                MaxReplicas: z.number().optional(),
                Platforms: z
                  .array(z.object({ Architecture: z.string(), OS: z.string() }).strict())
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      updateConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      rollbackConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      modeSwarm: z
        .union([
          z.union([
            z
              .object({
                Replicated: z.object({ Replicas: z.number().optional() }).strict().optional(),
                Global: z.object({}).optional(),
                ReplicatedJob: z
                  .object({
                    MaxConcurrent: z.number().optional(),
                    TotalCompletions: z.number().optional(),
                  })
                  .strict()
                  .optional(),
                GlobalJob: z.object({}).optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      labelsSwarm: z
        .union([z.union([z.record(z.string(), z.string()), z.null()]), z.null()])
        .optional(),
      networkSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Target: z.string().optional(),
                  Aliases: z.array(z.string()).optional(),
                  DriverOpts: z.record(z.string(), z.string()).optional(),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      stopGracePeriodSwarm: z.union([z.union([z.number(), z.null()]), z.null()]).optional(),
      endpointSpecSwarm: z
        .union([
          z.union([
            z
              .object({
                Mode: z.string().optional(),
                Ports: z
                  .array(
                    z
                      .object({
                        Protocol: z.string().optional(),
                        TargetPort: z.number().optional(),
                        PublishedPort: z.number().optional(),
                        PublishMode: z.string().optional(),
                      })
                      .strict(),
                  )
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      ulimitsSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Name: z.string().min(1),
                  Soft: z.number().int().gte(-1).lte(9007199254740991),
                  Hard: z.number().int().gte(-1).lte(9007199254740991),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      replicas: z.number().optional(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      buildType: z
        .enum([
          "dockerfile",
          "heroku_buildpacks",
          "paketo_buildpacks",
          "nixpacks",
          "static",
          "railpack",
        ])
        .optional(),
      railpackVersion: z.union([z.string(), z.null()]).optional(),
      herokuVersion: z.union([z.string(), z.null()]).optional(),
      publishDirectory: z.union([z.string(), z.null()]).optional(),
      isStaticSpa: z.union([z.boolean(), z.null()]).optional(),
      createEnvFile: z.boolean().optional(),
      createdAt: z.string().optional(),
      registryId: z.union([z.string(), z.null()]).optional(),
      rollbackRegistryId: z.union([z.string(), z.null()]).optional(),
      environmentId: z.string().optional(),
      githubId: z.union([z.string(), z.null()]).optional(),
      gitlabId: z.union([z.string(), z.null()]).optional(),
      giteaId: z.union([z.string(), z.null()]).optional(),
      bitbucketId: z.union([z.string(), z.null()]).optional(),
      buildServerId: z.union([z.string(), z.null()]).optional(),
      buildRegistryId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Application Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-refreshToken",
    description: "POST /application.refreshToken",
    tag: "application",
    method: "POST",
    path: "/application.refreshToken",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application RefreshToken",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-deploy",
    description: "POST /application.deploy",
    tag: "application",
    method: "POST",
    path: "/application.deploy",
    schema: z.object({
      applicationId: z.string().min(1),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    annotations: {
      title: "Application Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-cleanQueues",
    description: "POST /application.cleanQueues",
    tag: "application",
    method: "POST",
    path: "/application.cleanQueues",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application CleanQueues",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-clearDeployments",
    description: "POST /application.clearDeployments",
    tag: "application",
    method: "POST",
    path: "/application.clearDeployments",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application ClearDeployments",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-killBuild",
    description: "POST /application.killBuild",
    tag: "application",
    method: "POST",
    path: "/application.killBuild",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application KillBuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-readTraefikConfig",
    description: "GET /application.readTraefikConfig",
    tag: "application",
    method: "GET",
    path: "/application.readTraefikConfig",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application ReadTraefikConfig",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-dropDeployment",
    description: "POST /application.dropDeployment",
    tag: "application",
    method: "POST",
    path: "/application.dropDeployment",
    schema: z.object({}),
    annotations: {
      title: "Application DropDeployment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-updateTraefikConfig",
    description: "POST /application.updateTraefikConfig",
    tag: "application",
    method: "POST",
    path: "/application.updateTraefikConfig",
    schema: z.object({ applicationId: z.string(), traefikConfig: z.string() }),
    annotations: {
      title: "Application UpdateTraefikConfig",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-readAppMonitoring",
    description: "GET /application.readAppMonitoring",
    tag: "application",
    method: "GET",
    path: "/application.readAppMonitoring",
    schema: z.object({ appName: z.string().min(1) }),
    annotations: {
      title: "Application ReadAppMonitoring",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-move",
    description: "POST /application.move",
    tag: "application",
    method: "POST",
    path: "/application.move",
    schema: z.object({ applicationId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Application Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-cancelDeployment",
    description: "POST /application.cancelDeployment",
    tag: "application",
    method: "POST",
    path: "/application.cancelDeployment",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Application CancelDeployment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "application-search",
    description: "GET /application.search",
    tag: "application",
    method: "GET",
    path: "/application.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      appName: z.string().optional(),
      description: z.string().optional(),
      repository: z.string().optional(),
      owner: z.string().optional(),
      dockerImage: z.string().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Application Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-create",
    description: "POST /backup.create",
    tag: "backup",
    method: "POST",
    path: "/backup.create",
    schema: z.object({
      schedule: z.string(),
      enabled: z.union([z.boolean(), z.null()]).optional(),
      prefix: z.string().min(1),
      destinationId: z.string(),
      keepLatestCount: z.union([z.number(), z.null()]).optional(),
      database: z.string().min(1),
      mariadbId: z.union([z.string(), z.null()]).optional(),
      mysqlId: z.union([z.string(), z.null()]).optional(),
      postgresId: z.union([z.string(), z.null()]).optional(),
      mongoId: z.union([z.string(), z.null()]).optional(),
      libsqlId: z.union([z.string(), z.null()]).optional(),
      databaseType: z.enum(["postgres", "mariadb", "mysql", "mongo", "web-server", "libsql"]),
      userId: z.union([z.string(), z.null()]).optional(),
      backupType: z.enum(["database", "compose"]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
      serviceName: z.union([z.string(), z.null()]).optional(),
      metadata: z.union([z.any(), z.null()]).optional(),
    }),
    annotations: {
      title: "Backup Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "backup-one",
    description: "GET /backup.one",
    tag: "backup",
    method: "GET",
    path: "/backup.one",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-update",
    description: "POST /backup.update",
    tag: "backup",
    method: "POST",
    path: "/backup.update",
    schema: z.object({
      schedule: z.string(),
      enabled: z.union([z.boolean(), z.null()]),
      prefix: z.string().min(1),
      backupId: z.string(),
      destinationId: z.string(),
      database: z.string().min(1),
      keepLatestCount: z.union([z.number(), z.null()]),
      serviceName: z.union([z.string(), z.null()]),
      metadata: z.union([z.any(), z.null()]),
      databaseType: z.enum(["postgres", "mariadb", "mysql", "mongo", "web-server", "libsql"]),
    }),
    annotations: {
      title: "Backup Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-remove",
    description: "POST /backup.remove",
    tag: "backup",
    method: "POST",
    path: "/backup.remove",
    schema: z.object({ backupId: z.string() }),
    annotations: {
      title: "Backup Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-manualBackupPostgres",
    description: "POST /backup.manualBackupPostgres",
    tag: "backup",
    method: "POST",
    path: "/backup.manualBackupPostgres",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup ManualBackupPostgres",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-manualBackupMySql",
    description: "POST /backup.manualBackupMySql",
    tag: "backup",
    method: "POST",
    path: "/backup.manualBackupMySql",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup ManualBackupMySql",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-manualBackupMariadb",
    description: "POST /backup.manualBackupMariadb",
    tag: "backup",
    method: "POST",
    path: "/backup.manualBackupMariadb",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup ManualBackupMariadb",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-manualBackupCompose",
    description: "POST /backup.manualBackupCompose",
    tag: "backup",
    method: "POST",
    path: "/backup.manualBackupCompose",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup ManualBackupCompose",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-manualBackupMongo",
    description: "POST /backup.manualBackupMongo",
    tag: "backup",
    method: "POST",
    path: "/backup.manualBackupMongo",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup ManualBackupMongo",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-manualBackupLibsql",
    description: "POST /backup.manualBackupLibsql",
    tag: "backup",
    method: "POST",
    path: "/backup.manualBackupLibsql",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup ManualBackupLibsql",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-manualBackupWebServer",
    description: "POST /backup.manualBackupWebServer",
    tag: "backup",
    method: "POST",
    path: "/backup.manualBackupWebServer",
    schema: z.object({ backupId: z.string().min(1) }),
    annotations: {
      title: "Backup ManualBackupWebServer",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "backup-listBackupFiles",
    description: "GET /backup.listBackupFiles",
    tag: "backup",
    method: "GET",
    path: "/backup.listBackupFiles",
    schema: z.object({
      destinationId: z.string(),
      search: z.string(),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Backup ListBackupFiles",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "bitbucket-create",
    description: "POST /bitbucket.create",
    tag: "bitbucket",
    method: "POST",
    path: "/bitbucket.create",
    schema: z.object({
      bitbucketId: z.string().optional(),
      bitbucketUsername: z.string().optional(),
      bitbucketEmail: z
        .string()
        .email()
        .regex(
          new RegExp(
            "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
          ),
        )
        .optional(),
      appPassword: z.string().optional(),
      apiToken: z.string().optional(),
      bitbucketWorkspaceName: z.string().optional(),
      gitProviderId: z.string().optional(),
      authId: z.string().min(1),
      name: z.string().min(1),
    }),
    annotations: {
      title: "Bitbucket Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "bitbucket-one",
    description: "GET /bitbucket.one",
    tag: "bitbucket",
    method: "GET",
    path: "/bitbucket.one",
    schema: z.object({ bitbucketId: z.string().min(1) }),
    annotations: {
      title: "Bitbucket One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "bitbucket-bitbucketProviders",
    description: "GET /bitbucket.bitbucketProviders",
    tag: "bitbucket",
    method: "GET",
    path: "/bitbucket.bitbucketProviders",
    schema: z.object({}),
    annotations: {
      title: "Bitbucket BitbucketProviders",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "bitbucket-getBitbucketRepositories",
    description: "GET /bitbucket.getBitbucketRepositories",
    tag: "bitbucket",
    method: "GET",
    path: "/bitbucket.getBitbucketRepositories",
    schema: z.object({ bitbucketId: z.string().min(1) }),
    annotations: {
      title: "Bitbucket GetBitbucketRepositories",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "bitbucket-getBitbucketBranches",
    description: "GET /bitbucket.getBitbucketBranches",
    tag: "bitbucket",
    method: "GET",
    path: "/bitbucket.getBitbucketBranches",
    schema: z.object({ owner: z.string(), repo: z.string(), bitbucketId: z.string().optional() }),
    annotations: {
      title: "Bitbucket GetBitbucketBranches",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "bitbucket-testConnection",
    description: "POST /bitbucket.testConnection",
    tag: "bitbucket",
    method: "POST",
    path: "/bitbucket.testConnection",
    schema: z.object({
      bitbucketId: z.string().min(1),
      bitbucketUsername: z.string().optional(),
      bitbucketEmail: z
        .string()
        .email()
        .regex(
          new RegExp(
            "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
          ),
        )
        .optional(),
      workspaceName: z.string().optional(),
      apiToken: z.string().optional(),
      appPassword: z.string().optional(),
    }),
    annotations: {
      title: "Bitbucket TestConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "bitbucket-update",
    description: "POST /bitbucket.update",
    tag: "bitbucket",
    method: "POST",
    path: "/bitbucket.update",
    schema: z.object({
      bitbucketId: z.string().min(1),
      bitbucketUsername: z.string().optional(),
      bitbucketEmail: z
        .string()
        .email()
        .regex(
          new RegExp(
            "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
          ),
        )
        .optional(),
      appPassword: z.string().optional(),
      apiToken: z.string().optional(),
      bitbucketWorkspaceName: z.string().optional(),
      gitProviderId: z.string(),
      name: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Bitbucket Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "certificates-create",
    description: "POST /certificates.create",
    tag: "certificates",
    method: "POST",
    path: "/certificates.create",
    schema: z.object({
      certificateId: z.string().optional(),
      name: z.string().min(1),
      certificateData: z.string().min(1),
      privateKey: z.string().min(1),
      certificatePath: z.string().optional(),
      autoRenew: z.union([z.boolean(), z.null()]).optional(),
      organizationId: z.string(),
      serverId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Certificates Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "certificates-one",
    description: "GET /certificates.one",
    tag: "certificates",
    method: "GET",
    path: "/certificates.one",
    schema: z.object({ certificateId: z.string().min(1) }),
    annotations: {
      title: "Certificates One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "certificates-remove",
    description: "POST /certificates.remove",
    tag: "certificates",
    method: "POST",
    path: "/certificates.remove",
    schema: z.object({ certificateId: z.string().min(1) }),
    annotations: {
      title: "Certificates Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "certificates-all",
    description: "GET /certificates.all",
    tag: "certificates",
    method: "GET",
    path: "/certificates.all",
    schema: z.object({}),
    annotations: {
      title: "Certificates All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "certificates-update",
    description: "POST /certificates.update",
    tag: "certificates",
    method: "POST",
    path: "/certificates.update",
    schema: z.object({
      certificateId: z.string().min(1),
      name: z.string().min(1).optional(),
      certificateData: z.string().min(1).optional(),
      privateKey: z.string().min(1).optional(),
    }),
    annotations: {
      title: "Certificates Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "cluster-getNodes",
    description: "GET /cluster.getNodes",
    tag: "cluster",
    method: "GET",
    path: "/cluster.getNodes",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Cluster GetNodes",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "cluster-removeWorker",
    description: "POST /cluster.removeWorker",
    tag: "cluster",
    method: "POST",
    path: "/cluster.removeWorker",
    schema: z.object({ nodeId: z.string(), serverId: z.string().optional() }),
    annotations: {
      title: "Cluster RemoveWorker",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "cluster-addWorker",
    description: "GET /cluster.addWorker",
    tag: "cluster",
    method: "GET",
    path: "/cluster.addWorker",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Cluster AddWorker",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "cluster-addManager",
    description: "GET /cluster.addManager",
    tag: "cluster",
    method: "GET",
    path: "/cluster.addManager",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Cluster AddManager",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-create",
    description: "POST /compose.create",
    tag: "compose",
    method: "POST",
    path: "/compose.create",
    schema: z.object({
      name: z.string().min(1),
      description: z.union([z.string(), z.null()]).optional(),
      environmentId: z.string(),
      composeType: z.enum(["docker-compose", "stack"]).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      serverId: z.union([z.string(), z.null()]).optional(),
      composeFile: z.string().optional(),
    }),
    annotations: {
      title: "Compose Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "compose-one",
    description: "GET /compose.one",
    tag: "compose",
    method: "GET",
    path: "/compose.one",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-update",
    description: "POST /compose.update",
    tag: "compose",
    method: "POST",
    path: "/compose.update",
    schema: z.object({
      composeId: z.string(),
      name: z.string().min(1).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      composeFile: z.string().optional(),
      refreshToken: z.union([z.string(), z.null()]).optional(),
      sourceType: z.enum(["git", "github", "gitlab", "bitbucket", "gitea", "raw"]).optional(),
      composeType: z.enum(["docker-compose", "stack"]).optional(),
      repository: z.union([z.string(), z.null()]).optional(),
      owner: z.union([z.string(), z.null()]).optional(),
      branch: z.union([z.string(), z.null()]).optional(),
      autoDeploy: z.union([z.boolean(), z.null()]).optional(),
      gitlabProjectId: z.union([z.number(), z.null()]).optional(),
      gitlabRepository: z.union([z.string(), z.null()]).optional(),
      gitlabOwner: z.union([z.string(), z.null()]).optional(),
      gitlabBranch: z.union([z.string(), z.null()]).optional(),
      gitlabPathNamespace: z.union([z.string(), z.null()]).optional(),
      bitbucketRepository: z.union([z.string(), z.null()]).optional(),
      bitbucketRepositorySlug: z.union([z.string(), z.null()]).optional(),
      bitbucketOwner: z.union([z.string(), z.null()]).optional(),
      bitbucketBranch: z.union([z.string(), z.null()]).optional(),
      giteaRepository: z.union([z.string(), z.null()]).optional(),
      giteaOwner: z.union([z.string(), z.null()]).optional(),
      giteaBranch: z.union([z.string(), z.null()]).optional(),
      customGitUrl: z.union([z.string(), z.null()]).optional(),
      customGitBranch: z.union([z.string(), z.null()]).optional(),
      customGitSSHKeyId: z.union([z.string(), z.null()]).optional(),
      command: z.string().optional(),
      enableSubmodules: z.boolean().optional(),
      composePath: z.string().min(1).optional(),
      suffix: z.string().optional(),
      randomize: z.boolean().optional(),
      isolatedDeployment: z.boolean().optional(),
      isolatedDeploymentsVolume: z.boolean().optional(),
      triggerType: z.union([z.enum(["push", "tag"]), z.null()]).optional(),
      composeStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      environmentId: z.string().optional(),
      createdAt: z.string().optional(),
      watchPaths: z.union([z.array(z.string()), z.null()]).optional(),
      githubId: z.union([z.string(), z.null()]).optional(),
      gitlabId: z.union([z.string(), z.null()]).optional(),
      bitbucketId: z.union([z.string(), z.null()]).optional(),
      giteaId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Compose Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-saveEnvironment",
    description: "POST /compose.saveEnvironment",
    tag: "compose",
    method: "POST",
    path: "/compose.saveEnvironment",
    schema: z.object({ composeId: z.string(), env: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Compose SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-delete",
    description: "POST /compose.delete",
    tag: "compose",
    method: "POST",
    path: "/compose.delete",
    schema: z.object({ composeId: z.string().min(1), deleteVolumes: z.boolean() }),
    annotations: {
      title: "Compose Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-cleanQueues",
    description: "POST /compose.cleanQueues",
    tag: "compose",
    method: "POST",
    path: "/compose.cleanQueues",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose CleanQueues",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-clearDeployments",
    description: "POST /compose.clearDeployments",
    tag: "compose",
    method: "POST",
    path: "/compose.clearDeployments",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose ClearDeployments",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-killBuild",
    description: "POST /compose.killBuild",
    tag: "compose",
    method: "POST",
    path: "/compose.killBuild",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose KillBuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-loadServices",
    description: "GET /compose.loadServices",
    tag: "compose",
    method: "GET",
    path: "/compose.loadServices",
    schema: z.object({
      composeId: z.string().min(1),
      type: z.enum(["fetch", "cache"]).default("cache"),
    }),
    annotations: {
      title: "Compose LoadServices",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-loadMountsByService",
    description: "GET /compose.loadMountsByService",
    tag: "compose",
    method: "GET",
    path: "/compose.loadMountsByService",
    schema: z.object({ composeId: z.string().min(1), serviceName: z.string().min(1) }),
    annotations: {
      title: "Compose LoadMountsByService",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-fetchSourceType",
    description: "POST /compose.fetchSourceType",
    tag: "compose",
    method: "POST",
    path: "/compose.fetchSourceType",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose FetchSourceType",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-randomizeCompose",
    description: "POST /compose.randomizeCompose",
    tag: "compose",
    method: "POST",
    path: "/compose.randomizeCompose",
    schema: z.object({ composeId: z.string().min(1), suffix: z.string().optional() }),
    annotations: {
      title: "Compose RandomizeCompose",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-isolatedDeployment",
    description: "POST /compose.isolatedDeployment",
    tag: "compose",
    method: "POST",
    path: "/compose.isolatedDeployment",
    schema: z.object({ composeId: z.string().min(1), suffix: z.string().optional() }),
    annotations: {
      title: "Compose IsolatedDeployment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-getConvertedCompose",
    description: "GET /compose.getConvertedCompose",
    tag: "compose",
    method: "GET",
    path: "/compose.getConvertedCompose",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose GetConvertedCompose",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-deploy",
    description: "POST /compose.deploy",
    tag: "compose",
    method: "POST",
    path: "/compose.deploy",
    schema: z.object({
      composeId: z.string().min(1),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    annotations: {
      title: "Compose Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-redeploy",
    description: "POST /compose.redeploy",
    tag: "compose",
    method: "POST",
    path: "/compose.redeploy",
    schema: z.object({
      composeId: z.string().min(1),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    annotations: {
      title: "Compose Redeploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-stop",
    description: "POST /compose.stop",
    tag: "compose",
    method: "POST",
    path: "/compose.stop",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-start",
    description: "POST /compose.start",
    tag: "compose",
    method: "POST",
    path: "/compose.start",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-getDefaultCommand",
    description: "GET /compose.getDefaultCommand",
    tag: "compose",
    method: "GET",
    path: "/compose.getDefaultCommand",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose GetDefaultCommand",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-refreshToken",
    description: "POST /compose.refreshToken",
    tag: "compose",
    method: "POST",
    path: "/compose.refreshToken",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose RefreshToken",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-deployTemplate",
    description: "POST /compose.deployTemplate",
    tag: "compose",
    method: "POST",
    path: "/compose.deployTemplate",
    schema: z.object({
      environmentId: z.string(),
      serverId: z.string().optional(),
      id: z.string(),
      baseUrl: z.string().optional(),
    }),
    annotations: {
      title: "Compose DeployTemplate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-templates",
    description: "GET /compose.templates",
    tag: "compose",
    method: "GET",
    path: "/compose.templates",
    schema: z.object({ baseUrl: z.string().optional() }),
    annotations: {
      title: "Compose Templates",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-getTags",
    description: "GET /compose.getTags",
    tag: "compose",
    method: "GET",
    path: "/compose.getTags",
    schema: z.object({ baseUrl: z.string().optional() }),
    annotations: {
      title: "Compose GetTags",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-disconnectGitProvider",
    description: "POST /compose.disconnectGitProvider",
    tag: "compose",
    method: "POST",
    path: "/compose.disconnectGitProvider",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose DisconnectGitProvider",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-move",
    description: "POST /compose.move",
    tag: "compose",
    method: "POST",
    path: "/compose.move",
    schema: z.object({ composeId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Compose Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-processTemplate",
    description: "POST /compose.processTemplate",
    tag: "compose",
    method: "POST",
    path: "/compose.processTemplate",
    schema: z.object({ base64: z.string(), composeId: z.string().min(1) }),
    annotations: {
      title: "Compose ProcessTemplate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-import",
    description: "POST /compose.import",
    tag: "compose",
    method: "POST",
    path: "/compose.import",
    schema: z.object({ base64: z.string(), composeId: z.string().min(1) }),
    annotations: {
      title: "Compose Import",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-cancelDeployment",
    description: "POST /compose.cancelDeployment",
    tag: "compose",
    method: "POST",
    path: "/compose.cancelDeployment",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Compose CancelDeployment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "compose-search",
    description: "GET /compose.search",
    tag: "compose",
    method: "GET",
    path: "/compose.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      appName: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Compose Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-all",
    description: "GET /deployment.all",
    tag: "deployment",
    method: "GET",
    path: "/deployment.all",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Deployment All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-allByCompose",
    description: "GET /deployment.allByCompose",
    tag: "deployment",
    method: "GET",
    path: "/deployment.allByCompose",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Deployment AllByCompose",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-allByServer",
    description: "GET /deployment.allByServer",
    tag: "deployment",
    method: "GET",
    path: "/deployment.allByServer",
    schema: z.object({ serverId: z.string().min(1) }),
    annotations: {
      title: "Deployment AllByServer",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-allCentralized",
    description: "GET /deployment.allCentralized",
    tag: "deployment",
    method: "GET",
    path: "/deployment.allCentralized",
    schema: z.object({}),
    annotations: {
      title: "Deployment AllCentralized",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-queueList",
    description: "GET /deployment.queueList",
    tag: "deployment",
    method: "GET",
    path: "/deployment.queueList",
    schema: z.object({}),
    annotations: {
      title: "Deployment QueueList",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-allByType",
    description: "GET /deployment.allByType",
    tag: "deployment",
    method: "GET",
    path: "/deployment.allByType",
    schema: z.object({
      id: z.string().min(1),
      type: z.enum([
        "application",
        "compose",
        "server",
        "schedule",
        "previewDeployment",
        "backup",
        "volumeBackup",
      ]),
    }),
    annotations: {
      title: "Deployment AllByType",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-killProcess",
    description: "POST /deployment.killProcess",
    tag: "deployment",
    method: "POST",
    path: "/deployment.killProcess",
    schema: z.object({ deploymentId: z.string().min(1) }),
    annotations: {
      title: "Deployment KillProcess",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "deployment-removeDeployment",
    description: "POST /deployment.removeDeployment",
    tag: "deployment",
    method: "POST",
    path: "/deployment.removeDeployment",
    schema: z.object({ deploymentId: z.string().min(1) }),
    annotations: {
      title: "Deployment RemoveDeployment",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "destination-create",
    description: "POST /destination.create",
    tag: "destination",
    method: "POST",
    path: "/destination.create",
    schema: z.object({
      name: z.string().min(1),
      provider: z.union([z.string(), z.null()]),
      accessKey: z.string(),
      bucket: z.string(),
      region: z.string(),
      endpoint: z.string(),
      secretAccessKey: z.string(),
      additionalFlags: z.union([
        z
          .array(z.string().regex(new RegExp("^--[a-zA-Z0-9-]+(=[a-zA-Z0-9._:/@-]+)?$")))
          .default([]),
        z.null(),
      ]),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Destination Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "destination-testConnection",
    description: "POST /destination.testConnection",
    tag: "destination",
    method: "POST",
    path: "/destination.testConnection",
    schema: z.object({
      name: z.string().min(1),
      provider: z.union([z.string(), z.null()]),
      accessKey: z.string(),
      bucket: z.string(),
      region: z.string(),
      endpoint: z.string(),
      secretAccessKey: z.string(),
      additionalFlags: z.union([
        z
          .array(z.string().regex(new RegExp("^--[a-zA-Z0-9-]+(=[a-zA-Z0-9._:/@-]+)?$")))
          .default([]),
        z.null(),
      ]),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Destination TestConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "destination-one",
    description: "GET /destination.one",
    tag: "destination",
    method: "GET",
    path: "/destination.one",
    schema: z.object({ destinationId: z.string().min(1) }),
    annotations: {
      title: "Destination One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "destination-all",
    description: "GET /destination.all",
    tag: "destination",
    method: "GET",
    path: "/destination.all",
    schema: z.object({}),
    annotations: {
      title: "Destination All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "destination-remove",
    description: "POST /destination.remove",
    tag: "destination",
    method: "POST",
    path: "/destination.remove",
    schema: z.object({ destinationId: z.string() }),
    annotations: {
      title: "Destination Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "destination-update",
    description: "POST /destination.update",
    tag: "destination",
    method: "POST",
    path: "/destination.update",
    schema: z.object({
      name: z.string().min(1),
      accessKey: z.string(),
      bucket: z.string(),
      region: z.string(),
      endpoint: z.string(),
      secretAccessKey: z.string(),
      destinationId: z.string(),
      provider: z.union([z.string(), z.null()]),
      additionalFlags: z.union([
        z
          .array(z.string().regex(new RegExp("^--[a-zA-Z0-9-]+(=[a-zA-Z0-9._:/@-]+)?$")))
          .default([]),
        z.null(),
      ]),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Destination Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-getContainers",
    description: "GET /docker.getContainers",
    tag: "docker",
    method: "GET",
    path: "/docker.getContainers",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Docker GetContainers",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-restartContainer",
    description: "POST /docker.restartContainer",
    tag: "docker",
    method: "POST",
    path: "/docker.restartContainer",
    schema: z.object({ containerId: z.string().regex(new RegExp("^[a-zA-Z0-9.\\-_]+$")).min(1) }),
    annotations: {
      title: "Docker RestartContainer",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-removeContainer",
    description: "POST /docker.removeContainer",
    tag: "docker",
    method: "POST",
    path: "/docker.removeContainer",
    schema: z.object({
      containerId: z.string().regex(new RegExp("^[a-zA-Z0-9.\\-_]+$")).min(1),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Docker RemoveContainer",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-getConfig",
    description: "GET /docker.getConfig",
    tag: "docker",
    method: "GET",
    path: "/docker.getConfig",
    schema: z.object({
      containerId: z.string().regex(new RegExp("^[a-zA-Z0-9.\\-_]+$")).min(1),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Docker GetConfig",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-getContainersByAppNameMatch",
    description: "GET /docker.getContainersByAppNameMatch",
    tag: "docker",
    method: "GET",
    path: "/docker.getContainersByAppNameMatch",
    schema: z.object({
      appType: z.enum(["stack", "docker-compose"]).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9.\\-_]+$")).min(1),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Docker GetContainersByAppNameMatch",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-getContainersByAppLabel",
    description: "GET /docker.getContainersByAppLabel",
    tag: "docker",
    method: "GET",
    path: "/docker.getContainersByAppLabel",
    schema: z.object({
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9.\\-_]+$")).min(1),
      serverId: z.string().optional(),
      type: z.enum(["standalone", "swarm"]),
    }),
    annotations: {
      title: "Docker GetContainersByAppLabel",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-getStackContainersByAppName",
    description: "GET /docker.getStackContainersByAppName",
    tag: "docker",
    method: "GET",
    path: "/docker.getStackContainersByAppName",
    schema: z.object({
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9.\\-_]+$")).min(1),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Docker GetStackContainersByAppName",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-getServiceContainersByAppName",
    description: "GET /docker.getServiceContainersByAppName",
    tag: "docker",
    method: "GET",
    path: "/docker.getServiceContainersByAppName",
    schema: z.object({
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9.\\-_]+$")).min(1),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Docker GetServiceContainersByAppName",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "docker-uploadFileToContainer",
    description: "POST /docker.uploadFileToContainer",
    tag: "docker",
    method: "POST",
    path: "/docker.uploadFileToContainer",
    schema: z.object({}),
    annotations: {
      title: "Docker UploadFileToContainer",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-create",
    description: "POST /domain.create",
    tag: "domain",
    method: "POST",
    path: "/domain.create",
    schema: z.object({
      host: z.string().min(1),
      path: z.union([z.string().min(1), z.null()]).optional(),
      port: z.union([z.number().gte(1).lte(65535), z.null()]).optional(),
      customEntrypoint: z.union([z.string(), z.null()]).optional(),
      https: z.boolean().optional(),
      applicationId: z.union([z.string(), z.null()]).optional(),
      certificateType: z.enum(["letsencrypt", "none", "custom"]).optional(),
      customCertResolver: z.union([z.string(), z.null()]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
      serviceName: z.union([z.string(), z.null()]).optional(),
      domainType: z.union([z.enum(["compose", "application", "preview"]), z.null()]).optional(),
      previewDeploymentId: z.union([z.string(), z.null()]).optional(),
      internalPath: z.union([z.string(), z.null()]).optional(),
      stripPath: z.boolean().optional(),
      middlewares: z.union([z.array(z.string()), z.null()]).optional(),
    }),
    annotations: {
      title: "Domain Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "domain-byApplicationId",
    description: "GET /domain.byApplicationId",
    tag: "domain",
    method: "GET",
    path: "/domain.byApplicationId",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Domain ByApplicationId",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-byComposeId",
    description: "GET /domain.byComposeId",
    tag: "domain",
    method: "GET",
    path: "/domain.byComposeId",
    schema: z.object({ composeId: z.string().min(1) }),
    annotations: {
      title: "Domain ByComposeId",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-generateDomain",
    description: "POST /domain.generateDomain",
    tag: "domain",
    method: "POST",
    path: "/domain.generateDomain",
    schema: z.object({ appName: z.string(), serverId: z.string().optional() }),
    annotations: {
      title: "Domain GenerateDomain",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-canGenerateTraefikMeDomains",
    description: "GET /domain.canGenerateTraefikMeDomains",
    tag: "domain",
    method: "GET",
    path: "/domain.canGenerateTraefikMeDomains",
    schema: z.object({ serverId: z.string() }),
    annotations: {
      title: "Domain CanGenerateTraefikMeDomains",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-update",
    description: "POST /domain.update",
    tag: "domain",
    method: "POST",
    path: "/domain.update",
    schema: z.object({
      host: z.string().min(1),
      path: z.union([z.string().min(1), z.null()]).optional(),
      port: z.union([z.number().gte(1).lte(65535), z.null()]).optional(),
      customEntrypoint: z.union([z.string(), z.null()]).optional(),
      https: z.boolean().optional(),
      certificateType: z.enum(["letsencrypt", "none", "custom"]).optional(),
      customCertResolver: z.union([z.string(), z.null()]).optional(),
      serviceName: z.union([z.string(), z.null()]).optional(),
      domainType: z.union([z.enum(["compose", "application", "preview"]), z.null()]).optional(),
      internalPath: z.union([z.string(), z.null()]).optional(),
      stripPath: z.boolean().optional(),
      middlewares: z.union([z.array(z.string()), z.null()]).optional(),
      domainId: z.string(),
    }),
    annotations: {
      title: "Domain Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-one",
    description: "GET /domain.one",
    tag: "domain",
    method: "GET",
    path: "/domain.one",
    schema: z.object({ domainId: z.string().min(1) }),
    annotations: {
      title: "Domain One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-delete",
    description: "POST /domain.delete",
    tag: "domain",
    method: "POST",
    path: "/domain.delete",
    schema: z.object({ domainId: z.string().min(1) }),
    annotations: {
      title: "Domain Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "domain-validateDomain",
    description: "POST /domain.validateDomain",
    tag: "domain",
    method: "POST",
    path: "/domain.validateDomain",
    schema: z.object({ domain: z.string(), serverIp: z.string().optional() }),
    annotations: {
      title: "Domain ValidateDomain",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitea-create",
    description: "POST /gitea.create",
    tag: "gitea",
    method: "POST",
    path: "/gitea.create",
    schema: z.object({
      giteaId: z.string().optional(),
      giteaUrl: z.string().min(1),
      giteaInternalUrl: z.union([z.string(), z.null()]).optional(),
      redirectUri: z.string().optional(),
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      gitProviderId: z.string().optional(),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      expiresAt: z.number().optional(),
      scopes: z.string().optional(),
      lastAuthenticatedAt: z.number().optional(),
      name: z.string().min(1),
      giteaUsername: z.string().optional(),
      organizationName: z.string().optional(),
    }),
    annotations: {
      title: "Gitea Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "gitea-one",
    description: "GET /gitea.one",
    tag: "gitea",
    method: "GET",
    path: "/gitea.one",
    schema: z.object({ giteaId: z.string().min(1) }),
    annotations: {
      title: "Gitea One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitea-giteaProviders",
    description: "GET /gitea.giteaProviders",
    tag: "gitea",
    method: "GET",
    path: "/gitea.giteaProviders",
    schema: z.object({}),
    annotations: {
      title: "Gitea GiteaProviders",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitea-getGiteaRepositories",
    description: "GET /gitea.getGiteaRepositories",
    tag: "gitea",
    method: "GET",
    path: "/gitea.getGiteaRepositories",
    schema: z.object({ giteaId: z.string().min(1) }),
    annotations: {
      title: "Gitea GetGiteaRepositories",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitea-getGiteaBranches",
    description: "GET /gitea.getGiteaBranches",
    tag: "gitea",
    method: "GET",
    path: "/gitea.getGiteaBranches",
    schema: z.object({
      owner: z.string().min(1),
      repositoryName: z.string().min(1),
      giteaId: z.string().optional(),
    }),
    annotations: {
      title: "Gitea GetGiteaBranches",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitea-testConnection",
    description: "POST /gitea.testConnection",
    tag: "gitea",
    method: "POST",
    path: "/gitea.testConnection",
    schema: z.object({ giteaId: z.string().optional(), organizationName: z.string().optional() }),
    annotations: {
      title: "Gitea TestConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitea-update",
    description: "POST /gitea.update",
    tag: "gitea",
    method: "POST",
    path: "/gitea.update",
    schema: z.object({
      giteaId: z.string().min(1),
      giteaUrl: z.string().min(1),
      giteaInternalUrl: z.union([z.string(), z.null()]).optional(),
      redirectUri: z.string().optional(),
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      gitProviderId: z.string(),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      expiresAt: z.number().optional(),
      scopes: z.string().optional(),
      lastAuthenticatedAt: z.number().optional(),
      name: z.string().min(1),
      giteaUsername: z.string().optional(),
      organizationName: z.string().optional(),
    }),
    annotations: {
      title: "Gitea Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitea-getGiteaUrl",
    description: "GET /gitea.getGiteaUrl",
    tag: "gitea",
    method: "GET",
    path: "/gitea.getGiteaUrl",
    schema: z.object({ giteaId: z.string().min(1) }),
    annotations: {
      title: "Gitea GetGiteaUrl",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitProvider-getAll",
    description: "GET /gitProvider.getAll",
    tag: "gitProvider",
    method: "GET",
    path: "/gitProvider.getAll",
    schema: z.object({}),
    annotations: {
      title: "GitProvider GetAll",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitProvider-toggleShare",
    description: "POST /gitProvider.toggleShare",
    tag: "gitProvider",
    method: "POST",
    path: "/gitProvider.toggleShare",
    schema: z.object({ gitProviderId: z.string().min(1), sharedWithOrganization: z.boolean() }),
    annotations: {
      title: "GitProvider ToggleShare",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitProvider-allForPermissions",
    description: "GET /gitProvider.allForPermissions",
    tag: "gitProvider",
    method: "GET",
    path: "/gitProvider.allForPermissions",
    schema: z.object({}),
    annotations: {
      title: "GitProvider AllForPermissions",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitProvider-remove",
    description: "POST /gitProvider.remove",
    tag: "gitProvider",
    method: "POST",
    path: "/gitProvider.remove",
    schema: z.object({ gitProviderId: z.string().min(1) }),
    annotations: {
      title: "GitProvider Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "github-one",
    description: "GET /github.one",
    tag: "github",
    method: "GET",
    path: "/github.one",
    schema: z.object({ githubId: z.string().min(1) }),
    annotations: {
      title: "Github One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "github-getGithubRepositories",
    description: "GET /github.getGithubRepositories",
    tag: "github",
    method: "GET",
    path: "/github.getGithubRepositories",
    schema: z.object({ githubId: z.string().min(1) }),
    annotations: {
      title: "Github GetGithubRepositories",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "github-getGithubBranches",
    description: "GET /github.getGithubBranches",
    tag: "github",
    method: "GET",
    path: "/github.getGithubBranches",
    schema: z.object({
      repo: z.string().min(1),
      owner: z.string().min(1),
      githubId: z.string().optional(),
    }),
    annotations: {
      title: "Github GetGithubBranches",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "github-githubProviders",
    description: "GET /github.githubProviders",
    tag: "github",
    method: "GET",
    path: "/github.githubProviders",
    schema: z.object({}),
    annotations: {
      title: "Github GithubProviders",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "github-testConnection",
    description: "POST /github.testConnection",
    tag: "github",
    method: "POST",
    path: "/github.testConnection",
    schema: z.object({ githubId: z.string().min(1) }),
    annotations: {
      title: "Github TestConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "github-update",
    description: "POST /github.update",
    tag: "github",
    method: "POST",
    path: "/github.update",
    schema: z.object({
      githubId: z.string().min(1),
      name: z.string().min(1),
      gitProviderId: z.string().min(1),
      githubAppName: z.string().min(1),
    }),
    annotations: {
      title: "Github Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitlab-create",
    description: "POST /gitlab.create",
    tag: "gitlab",
    method: "POST",
    path: "/gitlab.create",
    schema: z.object({
      applicationId: z.string().optional(),
      secret: z.string().optional(),
      groupName: z.string().optional(),
      gitProviderId: z.string().optional(),
      redirectUri: z.string().optional(),
      authId: z.string().min(1),
      name: z.string().min(1),
      gitlabUrl: z.string().min(1),
      gitlabInternalUrl: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Gitlab Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "gitlab-one",
    description: "GET /gitlab.one",
    tag: "gitlab",
    method: "GET",
    path: "/gitlab.one",
    schema: z.object({ gitlabId: z.string().min(1) }),
    annotations: {
      title: "Gitlab One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitlab-gitlabProviders",
    description: "GET /gitlab.gitlabProviders",
    tag: "gitlab",
    method: "GET",
    path: "/gitlab.gitlabProviders",
    schema: z.object({}),
    annotations: {
      title: "Gitlab GitlabProviders",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitlab-getGitlabRepositories",
    description: "GET /gitlab.getGitlabRepositories",
    tag: "gitlab",
    method: "GET",
    path: "/gitlab.getGitlabRepositories",
    schema: z.object({ gitlabId: z.string().min(1) }),
    annotations: {
      title: "Gitlab GetGitlabRepositories",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitlab-getGitlabBranches",
    description: "GET /gitlab.getGitlabBranches",
    tag: "gitlab",
    method: "GET",
    path: "/gitlab.getGitlabBranches",
    schema: z.object({
      id: z.number().optional(),
      owner: z.string(),
      repo: z.string(),
      gitlabId: z.string().optional(),
    }),
    annotations: {
      title: "Gitlab GetGitlabBranches",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitlab-testConnection",
    description: "POST /gitlab.testConnection",
    tag: "gitlab",
    method: "POST",
    path: "/gitlab.testConnection",
    schema: z.object({ gitlabId: z.string().min(1), groupName: z.string().optional() }),
    annotations: {
      title: "Gitlab TestConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "gitlab-update",
    description: "POST /gitlab.update",
    tag: "gitlab",
    method: "POST",
    path: "/gitlab.update",
    schema: z.object({
      applicationId: z.string().optional(),
      secret: z.string().optional(),
      groupName: z.string().optional(),
      redirectUri: z.string().optional(),
      name: z.string().min(1),
      gitlabId: z.string().min(1),
      gitlabUrl: z.string().min(1),
      gitProviderId: z.string().min(1),
      gitlabInternalUrl: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Gitlab Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-create",
    description: "POST /libsql.create",
    tag: "libsql",
    method: "POST",
    path: "/libsql.create",
    schema: z.object({
      name: z.string().min(1),
      appName: z.string().min(1),
      dockerImage: z.string().default("ghcr.io/tursodatabase/libsql-server:v0.24.32"),
      environmentId: z.string(),
      description: z.union([z.string(), z.null()]),
      databaseUser: z.string().min(1),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")),
      sqldNode: z.enum(["primary", "replica"]),
      sqldPrimaryUrl: z.union([z.union([z.string(), z.null()]), z.null()]),
      enableNamespaces: z.boolean().default(false),
      serverId: z.union([z.string(), z.null()]),
    }),
    annotations: {
      title: "Libsql Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "libsql-one",
    description: "GET /libsql.one",
    tag: "libsql",
    method: "GET",
    path: "/libsql.one",
    schema: z.object({ libsqlId: z.string().min(1) }),
    annotations: {
      title: "Libsql One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-start",
    description: "POST /libsql.start",
    tag: "libsql",
    method: "POST",
    path: "/libsql.start",
    schema: z.object({ libsqlId: z.string().min(1) }),
    annotations: {
      title: "Libsql Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-stop",
    description: "POST /libsql.stop",
    tag: "libsql",
    method: "POST",
    path: "/libsql.stop",
    schema: z.object({ libsqlId: z.string().min(1) }),
    annotations: {
      title: "Libsql Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-saveExternalPorts",
    description: "POST /libsql.saveExternalPorts",
    tag: "libsql",
    method: "POST",
    path: "/libsql.saveExternalPorts",
    schema: z.object({
      libsqlId: z.string(),
      externalPort: z.union([z.number(), z.null()]).optional(),
      externalGRPCPort: z.union([z.number(), z.null()]).optional(),
      externalAdminPort: z.union([z.number(), z.null()]).optional(),
    }),
    annotations: {
      title: "Libsql SaveExternalPorts",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-deploy",
    description: "POST /libsql.deploy",
    tag: "libsql",
    method: "POST",
    path: "/libsql.deploy",
    schema: z.object({ libsqlId: z.string() }),
    annotations: {
      title: "Libsql Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-changeStatus",
    description: "POST /libsql.changeStatus",
    tag: "libsql",
    method: "POST",
    path: "/libsql.changeStatus",
    schema: z.object({
      libsqlId: z.string(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]),
    }),
    annotations: {
      title: "Libsql ChangeStatus",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-remove",
    description: "POST /libsql.remove",
    tag: "libsql",
    method: "POST",
    path: "/libsql.remove",
    schema: z.object({ libsqlId: z.string().min(1) }),
    annotations: {
      title: "Libsql Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-saveEnvironment",
    description: "POST /libsql.saveEnvironment",
    tag: "libsql",
    method: "POST",
    path: "/libsql.saveEnvironment",
    schema: z.object({ libsqlId: z.string(), env: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Libsql SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-reload",
    description: "POST /libsql.reload",
    tag: "libsql",
    method: "POST",
    path: "/libsql.reload",
    schema: z.object({ libsqlId: z.string(), appName: z.string().min(1) }),
    annotations: {
      title: "Libsql Reload",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-update",
    description: "POST /libsql.update",
    tag: "libsql",
    method: "POST",
    path: "/libsql.update",
    schema: z.object({
      libsqlId: z.string().min(1),
      name: z.string().min(1).optional(),
      appName: z.string().min(1).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      databaseUser: z.string().min(1).optional(),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      sqldNode: z.enum(["primary", "replica"]).optional(),
      sqldPrimaryUrl: z.union([z.union([z.string(), z.null()]), z.null()]).optional(),
      enableNamespaces: z.boolean().default(false),
      dockerImage: z.string().default("ghcr.io/tursodatabase/libsql-server:v0.24.32"),
      command: z.union([z.string(), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      memoryReservation: z.union([z.string(), z.null()]).optional(),
      memoryLimit: z.union([z.string(), z.null()]).optional(),
      cpuReservation: z.union([z.string(), z.null()]).optional(),
      cpuLimit: z.union([z.string(), z.null()]).optional(),
      externalPort: z.union([z.number(), z.null()]).optional(),
      externalGRPCPort: z.union([z.number(), z.null()]).optional(),
      externalAdminPort: z.union([z.number(), z.null()]).optional(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      healthCheckSwarm: z
        .union([
          z.union([
            z
              .object({
                Test: z.array(z.string()).optional(),
                Interval: z.number().optional(),
                Timeout: z.number().optional(),
                StartPeriod: z.number().optional(),
                Retries: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      restartPolicySwarm: z
        .union([
          z.union([
            z
              .object({
                Condition: z.string().optional(),
                Delay: z.number().optional(),
                MaxAttempts: z.number().optional(),
                Window: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      placementSwarm: z
        .union([
          z.union([
            z
              .object({
                Constraints: z.array(z.string()).optional(),
                Preferences: z
                  .array(z.object({ Spread: z.object({ SpreadDescriptor: z.string() }) }).strict())
                  .optional(),
                MaxReplicas: z.number().optional(),
                Platforms: z
                  .array(z.object({ Architecture: z.string(), OS: z.string() }).strict())
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      updateConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      rollbackConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      modeSwarm: z
        .union([
          z.union([
            z
              .object({
                Replicated: z.object({ Replicas: z.number().optional() }).strict().optional(),
                Global: z.object({}).optional(),
                ReplicatedJob: z
                  .object({
                    MaxConcurrent: z.number().optional(),
                    TotalCompletions: z.number().optional(),
                  })
                  .strict()
                  .optional(),
                GlobalJob: z.object({}).optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      labelsSwarm: z
        .union([z.union([z.record(z.string(), z.string()), z.null()]), z.null()])
        .optional(),
      networkSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Target: z.string().optional(),
                  Aliases: z.array(z.string()).optional(),
                  DriverOpts: z.record(z.string(), z.string()).optional(),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      stopGracePeriodSwarm: z.union([z.union([z.number(), z.null()]), z.null()]).optional(),
      endpointSpecSwarm: z
        .union([
          z.union([
            z
              .object({
                Mode: z.string().optional(),
                Ports: z
                  .array(
                    z
                      .object({
                        Protocol: z.string().optional(),
                        TargetPort: z.number().optional(),
                        PublishedPort: z.number().optional(),
                        PublishMode: z.string().optional(),
                      })
                      .strict(),
                  )
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      replicas: z.number().optional(),
      createdAt: z.string().optional(),
      environmentId: z.string().optional(),
    }),
    annotations: {
      title: "Libsql Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-move",
    description: "POST /libsql.move",
    tag: "libsql",
    method: "POST",
    path: "/libsql.move",
    schema: z.object({ libsqlId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Libsql Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "libsql-rebuild",
    description: "POST /libsql.rebuild",
    tag: "libsql",
    method: "POST",
    path: "/libsql.rebuild",
    schema: z.object({ libsqlId: z.string() }),
    annotations: {
      title: "Libsql Rebuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-create",
    description: "POST /mariadb.create",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.create",
    schema: z.object({
      name: z.string().min(1),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      dockerImage: z.string().default("mariadb:6"),
      databaseRootPassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      environmentId: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      databaseName: z.string().min(1),
      databaseUser: z.string().min(1),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")),
      serverId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Mariadb Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "mariadb-one",
    description: "GET /mariadb.one",
    tag: "mariadb",
    method: "GET",
    path: "/mariadb.one",
    schema: z.object({ mariadbId: z.string().min(1) }),
    annotations: {
      title: "Mariadb One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-start",
    description: "POST /mariadb.start",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.start",
    schema: z.object({ mariadbId: z.string().min(1) }),
    annotations: {
      title: "Mariadb Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-stop",
    description: "POST /mariadb.stop",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.stop",
    schema: z.object({ mariadbId: z.string().min(1) }),
    annotations: {
      title: "Mariadb Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-saveExternalPort",
    description: "POST /mariadb.saveExternalPort",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.saveExternalPort",
    schema: z.object({ mariadbId: z.string(), externalPort: z.union([z.number(), z.null()]) }),
    annotations: {
      title: "Mariadb SaveExternalPort",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-deploy",
    description: "POST /mariadb.deploy",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.deploy",
    schema: z.object({ mariadbId: z.string() }),
    annotations: {
      title: "Mariadb Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-changeStatus",
    description: "POST /mariadb.changeStatus",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.changeStatus",
    schema: z.object({
      mariadbId: z.string(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]),
    }),
    annotations: {
      title: "Mariadb ChangeStatus",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-remove",
    description: "POST /mariadb.remove",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.remove",
    schema: z.object({ mariadbId: z.string().min(1) }),
    annotations: {
      title: "Mariadb Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-saveEnvironment",
    description: "POST /mariadb.saveEnvironment",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.saveEnvironment",
    schema: z.object({ mariadbId: z.string(), env: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Mariadb SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-reload",
    description: "POST /mariadb.reload",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.reload",
    schema: z.object({
      mariadbId: z.string(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63),
    }),
    annotations: {
      title: "Mariadb Reload",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-update",
    description: "POST /mariadb.update",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.update",
    schema: z.object({
      mariadbId: z.string().min(1),
      name: z.string().min(1).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      databaseName: z.string().min(1).optional(),
      databaseUser: z.string().min(1).optional(),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      databaseRootPassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      dockerImage: z.string().optional(),
      command: z.union([z.string(), z.null()]).optional(),
      args: z.union([z.array(z.string()), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      memoryReservation: z.union([z.string(), z.null()]).optional(),
      memoryLimit: z.union([z.string(), z.null()]).optional(),
      cpuReservation: z.union([z.string(), z.null()]).optional(),
      cpuLimit: z.union([z.string(), z.null()]).optional(),
      externalPort: z.union([z.number(), z.null()]).optional(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      healthCheckSwarm: z
        .union([
          z.union([
            z
              .object({
                Test: z.array(z.string()).optional(),
                Interval: z.number().optional(),
                Timeout: z.number().optional(),
                StartPeriod: z.number().optional(),
                Retries: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      restartPolicySwarm: z
        .union([
          z.union([
            z
              .object({
                Condition: z.string().optional(),
                Delay: z.number().optional(),
                MaxAttempts: z.number().optional(),
                Window: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      placementSwarm: z
        .union([
          z.union([
            z
              .object({
                Constraints: z.array(z.string()).optional(),
                Preferences: z
                  .array(z.object({ Spread: z.object({ SpreadDescriptor: z.string() }) }).strict())
                  .optional(),
                MaxReplicas: z.number().optional(),
                Platforms: z
                  .array(z.object({ Architecture: z.string(), OS: z.string() }).strict())
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      updateConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      rollbackConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      modeSwarm: z
        .union([
          z.union([
            z
              .object({
                Replicated: z.object({ Replicas: z.number().optional() }).strict().optional(),
                Global: z.object({}).optional(),
                ReplicatedJob: z
                  .object({
                    MaxConcurrent: z.number().optional(),
                    TotalCompletions: z.number().optional(),
                  })
                  .strict()
                  .optional(),
                GlobalJob: z.object({}).optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      labelsSwarm: z
        .union([z.union([z.record(z.string(), z.string()), z.null()]), z.null()])
        .optional(),
      networkSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Target: z.string().optional(),
                  Aliases: z.array(z.string()).optional(),
                  DriverOpts: z.record(z.string(), z.string()).optional(),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      stopGracePeriodSwarm: z.union([z.union([z.number(), z.null()]), z.null()]).optional(),
      endpointSpecSwarm: z
        .union([
          z.union([
            z
              .object({
                Mode: z.string().optional(),
                Ports: z
                  .array(
                    z
                      .object({
                        Protocol: z.string().optional(),
                        TargetPort: z.number().optional(),
                        PublishedPort: z.number().optional(),
                        PublishMode: z.string().optional(),
                      })
                      .strict(),
                  )
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      ulimitsSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Name: z.string().min(1),
                  Soft: z.number().int().gte(-1).lte(9007199254740991),
                  Hard: z.number().int().gte(-1).lte(9007199254740991),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      replicas: z.number().optional(),
      createdAt: z.string().optional(),
      environmentId: z.string().optional(),
    }),
    annotations: {
      title: "Mariadb Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-changePassword",
    description: "POST /mariadb.changePassword",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.changePassword",
    schema: z.object({
      mariadbId: z.string().min(1),
      password: z.string().regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")).min(1),
      type: z.enum(["user", "root"]).default("user"),
    }),
    annotations: {
      title: "Mariadb ChangePassword",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-move",
    description: "POST /mariadb.move",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.move",
    schema: z.object({ mariadbId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Mariadb Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-rebuild",
    description: "POST /mariadb.rebuild",
    tag: "mariadb",
    method: "POST",
    path: "/mariadb.rebuild",
    schema: z.object({ mariadbId: z.string() }),
    annotations: {
      title: "Mariadb Rebuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mariadb-search",
    description: "GET /mariadb.search",
    tag: "mariadb",
    method: "GET",
    path: "/mariadb.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      appName: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Mariadb Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-create",
    description: "POST /mongo.create",
    tag: "mongo",
    method: "POST",
    path: "/mongo.create",
    schema: z.object({
      name: z.string().min(1),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      dockerImage: z.string().default("mongo:15"),
      environmentId: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      databaseUser: z.string().min(1),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")),
      serverId: z.union([z.string(), z.null()]).optional(),
      replicaSets: z.union([z.boolean().default(false), z.null()]).optional(),
    }),
    annotations: {
      title: "Mongo Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "mongo-one",
    description: "GET /mongo.one",
    tag: "mongo",
    method: "GET",
    path: "/mongo.one",
    schema: z.object({ mongoId: z.string().min(1) }),
    annotations: {
      title: "Mongo One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-start",
    description: "POST /mongo.start",
    tag: "mongo",
    method: "POST",
    path: "/mongo.start",
    schema: z.object({ mongoId: z.string().min(1) }),
    annotations: {
      title: "Mongo Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-stop",
    description: "POST /mongo.stop",
    tag: "mongo",
    method: "POST",
    path: "/mongo.stop",
    schema: z.object({ mongoId: z.string().min(1) }),
    annotations: {
      title: "Mongo Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-saveExternalPort",
    description: "POST /mongo.saveExternalPort",
    tag: "mongo",
    method: "POST",
    path: "/mongo.saveExternalPort",
    schema: z.object({ mongoId: z.string(), externalPort: z.union([z.number(), z.null()]) }),
    annotations: {
      title: "Mongo SaveExternalPort",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-deploy",
    description: "POST /mongo.deploy",
    tag: "mongo",
    method: "POST",
    path: "/mongo.deploy",
    schema: z.object({ mongoId: z.string() }),
    annotations: {
      title: "Mongo Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-changeStatus",
    description: "POST /mongo.changeStatus",
    tag: "mongo",
    method: "POST",
    path: "/mongo.changeStatus",
    schema: z.object({
      mongoId: z.string(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]),
    }),
    annotations: {
      title: "Mongo ChangeStatus",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-reload",
    description: "POST /mongo.reload",
    tag: "mongo",
    method: "POST",
    path: "/mongo.reload",
    schema: z.object({
      mongoId: z.string(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63),
    }),
    annotations: {
      title: "Mongo Reload",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-remove",
    description: "POST /mongo.remove",
    tag: "mongo",
    method: "POST",
    path: "/mongo.remove",
    schema: z.object({ mongoId: z.string().min(1) }),
    annotations: {
      title: "Mongo Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-saveEnvironment",
    description: "POST /mongo.saveEnvironment",
    tag: "mongo",
    method: "POST",
    path: "/mongo.saveEnvironment",
    schema: z.object({ mongoId: z.string(), env: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Mongo SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-update",
    description: "POST /mongo.update",
    tag: "mongo",
    method: "POST",
    path: "/mongo.update",
    schema: z.object({
      mongoId: z.string().min(1),
      name: z.string().min(1).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      databaseUser: z.string().min(1).optional(),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      dockerImage: z.string().optional(),
      command: z.union([z.string(), z.null()]).optional(),
      args: z.union([z.array(z.string()), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      memoryReservation: z.union([z.string(), z.null()]).optional(),
      memoryLimit: z.union([z.string(), z.null()]).optional(),
      cpuReservation: z.union([z.string(), z.null()]).optional(),
      cpuLimit: z.union([z.string(), z.null()]).optional(),
      externalPort: z.union([z.number(), z.null()]).optional(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      healthCheckSwarm: z
        .union([
          z.union([
            z
              .object({
                Test: z.array(z.string()).optional(),
                Interval: z.number().optional(),
                Timeout: z.number().optional(),
                StartPeriod: z.number().optional(),
                Retries: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      restartPolicySwarm: z
        .union([
          z.union([
            z
              .object({
                Condition: z.string().optional(),
                Delay: z.number().optional(),
                MaxAttempts: z.number().optional(),
                Window: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      placementSwarm: z
        .union([
          z.union([
            z
              .object({
                Constraints: z.array(z.string()).optional(),
                Preferences: z
                  .array(z.object({ Spread: z.object({ SpreadDescriptor: z.string() }) }).strict())
                  .optional(),
                MaxReplicas: z.number().optional(),
                Platforms: z
                  .array(z.object({ Architecture: z.string(), OS: z.string() }).strict())
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      updateConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      rollbackConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      modeSwarm: z
        .union([
          z.union([
            z
              .object({
                Replicated: z.object({ Replicas: z.number().optional() }).strict().optional(),
                Global: z.object({}).optional(),
                ReplicatedJob: z
                  .object({
                    MaxConcurrent: z.number().optional(),
                    TotalCompletions: z.number().optional(),
                  })
                  .strict()
                  .optional(),
                GlobalJob: z.object({}).optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      labelsSwarm: z
        .union([z.union([z.record(z.string(), z.string()), z.null()]), z.null()])
        .optional(),
      networkSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Target: z.string().optional(),
                  Aliases: z.array(z.string()).optional(),
                  DriverOpts: z.record(z.string(), z.string()).optional(),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      stopGracePeriodSwarm: z.union([z.union([z.number(), z.null()]), z.null()]).optional(),
      endpointSpecSwarm: z
        .union([
          z.union([
            z
              .object({
                Mode: z.string().optional(),
                Ports: z
                  .array(
                    z
                      .object({
                        Protocol: z.string().optional(),
                        TargetPort: z.number().optional(),
                        PublishedPort: z.number().optional(),
                        PublishMode: z.string().optional(),
                      })
                      .strict(),
                  )
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      ulimitsSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Name: z.string().min(1),
                  Soft: z.number().int().gte(-1).lte(9007199254740991),
                  Hard: z.number().int().gte(-1).lte(9007199254740991),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      replicas: z.number().optional(),
      createdAt: z.string().optional(),
      environmentId: z.string().optional(),
      replicaSets: z.union([z.boolean().default(false), z.null()]).optional(),
    }),
    annotations: {
      title: "Mongo Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-changePassword",
    description: "POST /mongo.changePassword",
    tag: "mongo",
    method: "POST",
    path: "/mongo.changePassword",
    schema: z.object({
      mongoId: z.string().min(1),
      password: z.string().regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")).min(1),
    }),
    annotations: {
      title: "Mongo ChangePassword",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-move",
    description: "POST /mongo.move",
    tag: "mongo",
    method: "POST",
    path: "/mongo.move",
    schema: z.object({ mongoId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Mongo Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-rebuild",
    description: "POST /mongo.rebuild",
    tag: "mongo",
    method: "POST",
    path: "/mongo.rebuild",
    schema: z.object({ mongoId: z.string() }),
    annotations: {
      title: "Mongo Rebuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mongo-search",
    description: "GET /mongo.search",
    tag: "mongo",
    method: "GET",
    path: "/mongo.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      appName: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Mongo Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mounts-create",
    description: "POST /mounts.create",
    tag: "mounts",
    method: "POST",
    path: "/mounts.create",
    schema: z.object({
      type: z.enum(["bind", "volume", "file"]),
      hostPath: z.union([z.string(), z.null()]).optional(),
      volumeName: z.union([z.string(), z.null()]).optional(),
      content: z.union([z.string(), z.null()]).optional(),
      mountPath: z.string().min(1),
      filePath: z.union([z.string(), z.null()]).optional(),
      serviceType: z
        .enum([
          "application",
          "postgres",
          "mysql",
          "mariadb",
          "mongo",
          "redis",
          "compose",
          "libsql",
        ])
        .optional(),
      serviceId: z.string().min(1),
    }),
    annotations: {
      title: "Mounts Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "mounts-remove",
    description: "POST /mounts.remove",
    tag: "mounts",
    method: "POST",
    path: "/mounts.remove",
    schema: z.object({ mountId: z.string() }),
    annotations: {
      title: "Mounts Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "mounts-one",
    description: "GET /mounts.one",
    tag: "mounts",
    method: "GET",
    path: "/mounts.one",
    schema: z.object({ mountId: z.string().min(1) }),
    annotations: {
      title: "Mounts One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mounts-update",
    description: "POST /mounts.update",
    tag: "mounts",
    method: "POST",
    path: "/mounts.update",
    schema: z.object({
      mountId: z.string().min(1),
      type: z.enum(["bind", "volume", "file"]).optional(),
      hostPath: z.union([z.string(), z.null()]).optional(),
      volumeName: z.union([z.string(), z.null()]).optional(),
      filePath: z.union([z.string(), z.null()]).optional(),
      content: z.union([z.string(), z.null()]).optional(),
      serviceType: z
        .enum([
          "application",
          "postgres",
          "mysql",
          "mariadb",
          "mongo",
          "redis",
          "compose",
          "libsql",
        ])
        .optional(),
      mountPath: z.string().min(1).optional(),
      applicationId: z.union([z.string(), z.null()]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
      libsqlId: z.union([z.string(), z.null()]).optional(),
      mariadbId: z.union([z.string(), z.null()]).optional(),
      mongoId: z.union([z.string(), z.null()]).optional(),
      mysqlId: z.union([z.string(), z.null()]).optional(),
      postgresId: z.union([z.string(), z.null()]).optional(),
      redisId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Mounts Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mounts-allNamedByApplicationId",
    description: "GET /mounts.allNamedByApplicationId",
    tag: "mounts",
    method: "GET",
    path: "/mounts.allNamedByApplicationId",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "Mounts AllNamedByApplicationId",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mounts-listByServiceId",
    description: "GET /mounts.listByServiceId",
    tag: "mounts",
    method: "GET",
    path: "/mounts.listByServiceId",
    schema: z.object({ serviceType: z.string().min(1), serviceId: z.string().min(1) }),
    annotations: {
      title: "Mounts ListByServiceId",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-create",
    description: "POST /mysql.create",
    tag: "mysql",
    method: "POST",
    path: "/mysql.create",
    schema: z.object({
      name: z.string().min(1),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      dockerImage: z.string().default("mysql:8"),
      environmentId: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      databaseName: z.string().min(1),
      databaseUser: z.string().min(1),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")),
      databaseRootPassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      serverId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Mysql Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "mysql-one",
    description: "GET /mysql.one",
    tag: "mysql",
    method: "GET",
    path: "/mysql.one",
    schema: z.object({ mysqlId: z.string().min(1) }),
    annotations: {
      title: "Mysql One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-start",
    description: "POST /mysql.start",
    tag: "mysql",
    method: "POST",
    path: "/mysql.start",
    schema: z.object({ mysqlId: z.string().min(1) }),
    annotations: {
      title: "Mysql Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-stop",
    description: "POST /mysql.stop",
    tag: "mysql",
    method: "POST",
    path: "/mysql.stop",
    schema: z.object({ mysqlId: z.string().min(1) }),
    annotations: {
      title: "Mysql Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-saveExternalPort",
    description: "POST /mysql.saveExternalPort",
    tag: "mysql",
    method: "POST",
    path: "/mysql.saveExternalPort",
    schema: z.object({ mysqlId: z.string(), externalPort: z.union([z.number(), z.null()]) }),
    annotations: {
      title: "Mysql SaveExternalPort",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-deploy",
    description: "POST /mysql.deploy",
    tag: "mysql",
    method: "POST",
    path: "/mysql.deploy",
    schema: z.object({ mysqlId: z.string() }),
    annotations: {
      title: "Mysql Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-changeStatus",
    description: "POST /mysql.changeStatus",
    tag: "mysql",
    method: "POST",
    path: "/mysql.changeStatus",
    schema: z.object({
      mysqlId: z.string(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]),
    }),
    annotations: {
      title: "Mysql ChangeStatus",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-reload",
    description: "POST /mysql.reload",
    tag: "mysql",
    method: "POST",
    path: "/mysql.reload",
    schema: z.object({
      mysqlId: z.string(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63),
    }),
    annotations: {
      title: "Mysql Reload",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-remove",
    description: "POST /mysql.remove",
    tag: "mysql",
    method: "POST",
    path: "/mysql.remove",
    schema: z.object({ mysqlId: z.string().min(1) }),
    annotations: {
      title: "Mysql Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-saveEnvironment",
    description: "POST /mysql.saveEnvironment",
    tag: "mysql",
    method: "POST",
    path: "/mysql.saveEnvironment",
    schema: z.object({ mysqlId: z.string(), env: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Mysql SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-update",
    description: "POST /mysql.update",
    tag: "mysql",
    method: "POST",
    path: "/mysql.update",
    schema: z.object({
      mysqlId: z.string().min(1),
      name: z.string().min(1).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      databaseName: z.string().min(1).optional(),
      databaseUser: z.string().min(1).optional(),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      databaseRootPassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      dockerImage: z.string().optional(),
      command: z.union([z.string(), z.null()]).optional(),
      args: z.union([z.array(z.string()), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      memoryReservation: z.union([z.string(), z.null()]).optional(),
      memoryLimit: z.union([z.string(), z.null()]).optional(),
      cpuReservation: z.union([z.string(), z.null()]).optional(),
      cpuLimit: z.union([z.string(), z.null()]).optional(),
      externalPort: z.union([z.number(), z.null()]).optional(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      healthCheckSwarm: z
        .union([
          z.union([
            z
              .object({
                Test: z.array(z.string()).optional(),
                Interval: z.number().optional(),
                Timeout: z.number().optional(),
                StartPeriod: z.number().optional(),
                Retries: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      restartPolicySwarm: z
        .union([
          z.union([
            z
              .object({
                Condition: z.string().optional(),
                Delay: z.number().optional(),
                MaxAttempts: z.number().optional(),
                Window: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      placementSwarm: z
        .union([
          z.union([
            z
              .object({
                Constraints: z.array(z.string()).optional(),
                Preferences: z
                  .array(z.object({ Spread: z.object({ SpreadDescriptor: z.string() }) }).strict())
                  .optional(),
                MaxReplicas: z.number().optional(),
                Platforms: z
                  .array(z.object({ Architecture: z.string(), OS: z.string() }).strict())
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      updateConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      rollbackConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      modeSwarm: z
        .union([
          z.union([
            z
              .object({
                Replicated: z.object({ Replicas: z.number().optional() }).strict().optional(),
                Global: z.object({}).optional(),
                ReplicatedJob: z
                  .object({
                    MaxConcurrent: z.number().optional(),
                    TotalCompletions: z.number().optional(),
                  })
                  .strict()
                  .optional(),
                GlobalJob: z.object({}).optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      labelsSwarm: z
        .union([z.union([z.record(z.string(), z.string()), z.null()]), z.null()])
        .optional(),
      networkSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Target: z.string().optional(),
                  Aliases: z.array(z.string()).optional(),
                  DriverOpts: z.record(z.string(), z.string()).optional(),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      stopGracePeriodSwarm: z.union([z.union([z.number(), z.null()]), z.null()]).optional(),
      endpointSpecSwarm: z
        .union([
          z.union([
            z
              .object({
                Mode: z.string().optional(),
                Ports: z
                  .array(
                    z
                      .object({
                        Protocol: z.string().optional(),
                        TargetPort: z.number().optional(),
                        PublishedPort: z.number().optional(),
                        PublishMode: z.string().optional(),
                      })
                      .strict(),
                  )
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      ulimitsSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Name: z.string().min(1),
                  Soft: z.number().int().gte(-1).lte(9007199254740991),
                  Hard: z.number().int().gte(-1).lte(9007199254740991),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      replicas: z.number().optional(),
      createdAt: z.string().optional(),
      environmentId: z.string().optional(),
    }),
    annotations: {
      title: "Mysql Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-changePassword",
    description: "POST /mysql.changePassword",
    tag: "mysql",
    method: "POST",
    path: "/mysql.changePassword",
    schema: z.object({
      mysqlId: z.string().min(1),
      password: z.string().regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")).min(1),
      type: z.enum(["user", "root"]).default("user"),
    }),
    annotations: {
      title: "Mysql ChangePassword",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-move",
    description: "POST /mysql.move",
    tag: "mysql",
    method: "POST",
    path: "/mysql.move",
    schema: z.object({ mysqlId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Mysql Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-rebuild",
    description: "POST /mysql.rebuild",
    tag: "mysql",
    method: "POST",
    path: "/mysql.rebuild",
    schema: z.object({ mysqlId: z.string() }),
    annotations: {
      title: "Mysql Rebuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "mysql-search",
    description: "GET /mysql.search",
    tag: "mysql",
    method: "GET",
    path: "/mysql.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      appName: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Mysql Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createSlack",
    description: "POST /notification.createSlack",
    tag: "notification",
    method: "POST",
    path: "/notification.createSlack",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      webhookUrl: z.string().min(1),
      channel: z.string(),
    }),
    annotations: {
      title: "Notification CreateSlack",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateSlack",
    description: "POST /notification.updateSlack",
    tag: "notification",
    method: "POST",
    path: "/notification.updateSlack",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      webhookUrl: z.string().min(1).optional(),
      channel: z.string().optional(),
      notificationId: z.string().min(1),
      slackId: z.string(),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateSlack",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testSlackConnection",
    description: "POST /notification.testSlackConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testSlackConnection",
    schema: z.object({ webhookUrl: z.string().min(1), channel: z.string() }),
    annotations: {
      title: "Notification TestSlackConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createTelegram",
    description: "POST /notification.createTelegram",
    tag: "notification",
    method: "POST",
    path: "/notification.createTelegram",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      botToken: z.string().min(1),
      chatId: z.string().min(1),
      messageThreadId: z.string(),
    }),
    annotations: {
      title: "Notification CreateTelegram",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateTelegram",
    description: "POST /notification.updateTelegram",
    tag: "notification",
    method: "POST",
    path: "/notification.updateTelegram",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      botToken: z.string().min(1).optional(),
      chatId: z.string().min(1).optional(),
      messageThreadId: z.string().optional(),
      notificationId: z.string().min(1),
      telegramId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateTelegram",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testTelegramConnection",
    description: "POST /notification.testTelegramConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testTelegramConnection",
    schema: z.object({
      botToken: z.string().min(1),
      chatId: z.string().min(1),
      messageThreadId: z.string(),
    }),
    annotations: {
      title: "Notification TestTelegramConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createDiscord",
    description: "POST /notification.createDiscord",
    tag: "notification",
    method: "POST",
    path: "/notification.createDiscord",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      webhookUrl: z.string().min(1),
      decoration: z.boolean(),
    }),
    annotations: {
      title: "Notification CreateDiscord",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateDiscord",
    description: "POST /notification.updateDiscord",
    tag: "notification",
    method: "POST",
    path: "/notification.updateDiscord",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      webhookUrl: z.string().min(1).optional(),
      decoration: z.boolean().optional(),
      notificationId: z.string().min(1),
      discordId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateDiscord",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testDiscordConnection",
    description: "POST /notification.testDiscordConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testDiscordConnection",
    schema: z.object({ webhookUrl: z.string().min(1), decoration: z.boolean().optional() }),
    annotations: {
      title: "Notification TestDiscordConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createEmail",
    description: "POST /notification.createEmail",
    tag: "notification",
    method: "POST",
    path: "/notification.createEmail",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      smtpServer: z.string().min(1),
      smtpPort: z.number().gte(1),
      username: z.string().min(1),
      password: z.string().min(1),
      fromAddress: z.string().min(1),
      toAddresses: z.array(z.string()).min(1),
    }),
    annotations: {
      title: "Notification CreateEmail",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateEmail",
    description: "POST /notification.updateEmail",
    tag: "notification",
    method: "POST",
    path: "/notification.updateEmail",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      smtpServer: z.string().min(1).optional(),
      smtpPort: z.number().gte(1).optional(),
      username: z.string().min(1).optional(),
      password: z.string().min(1).optional(),
      fromAddress: z.string().min(1).optional(),
      toAddresses: z.array(z.string()).min(1).optional(),
      notificationId: z.string().min(1),
      emailId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateEmail",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testEmailConnection",
    description: "POST /notification.testEmailConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testEmailConnection",
    schema: z.object({
      smtpServer: z.string().min(1),
      smtpPort: z.number().gte(1),
      username: z.string().min(1),
      password: z.string().min(1),
      toAddresses: z.array(z.string()).min(1),
      fromAddress: z.string().min(1),
    }),
    annotations: {
      title: "Notification TestEmailConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createResend",
    description: "POST /notification.createResend",
    tag: "notification",
    method: "POST",
    path: "/notification.createResend",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      apiKey: z.string().min(1),
      fromAddress: z.string().min(1),
      toAddresses: z.array(z.string()).min(1),
    }),
    annotations: {
      title: "Notification CreateResend",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateResend",
    description: "POST /notification.updateResend",
    tag: "notification",
    method: "POST",
    path: "/notification.updateResend",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      apiKey: z.string().min(1).optional(),
      fromAddress: z.string().min(1).optional(),
      toAddresses: z.array(z.string()).min(1).optional(),
      notificationId: z.string().min(1),
      resendId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateResend",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testResendConnection",
    description: "POST /notification.testResendConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testResendConnection",
    schema: z.object({
      apiKey: z.string().min(1),
      fromAddress: z.string().min(1),
      toAddresses: z.array(z.string()).min(1),
    }),
    annotations: {
      title: "Notification TestResendConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-remove",
    description: "POST /notification.remove",
    tag: "notification",
    method: "POST",
    path: "/notification.remove",
    schema: z.object({ notificationId: z.string().min(1) }),
    annotations: {
      title: "Notification Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-one",
    description: "GET /notification.one",
    tag: "notification",
    method: "GET",
    path: "/notification.one",
    schema: z.object({ notificationId: z.string().min(1) }),
    annotations: {
      title: "Notification One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-all",
    description: "GET /notification.all",
    tag: "notification",
    method: "GET",
    path: "/notification.all",
    schema: z.object({}),
    annotations: {
      title: "Notification All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-receiveNotification",
    description: "POST /notification.receiveNotification",
    tag: "notification",
    method: "POST",
    path: "/notification.receiveNotification",
    schema: z.object({
      ServerType: z.enum(["Dokploy", "Remote"]).default("Dokploy"),
      Type: z.enum(["Memory", "CPU"]),
      Value: z.number(),
      Threshold: z.number(),
      Message: z.string(),
      Timestamp: z.string(),
      Token: z.string(),
    }),
    annotations: {
      title: "Notification ReceiveNotification",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createGotify",
    description: "POST /notification.createGotify",
    tag: "notification",
    method: "POST",
    path: "/notification.createGotify",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverUrl: z.string().min(1),
      appToken: z.string().min(1),
      priority: z.number().gte(1),
      decoration: z.boolean(),
    }),
    annotations: {
      title: "Notification CreateGotify",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateGotify",
    description: "POST /notification.updateGotify",
    tag: "notification",
    method: "POST",
    path: "/notification.updateGotify",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverUrl: z.string().min(1).optional(),
      appToken: z.string().min(1).optional(),
      priority: z.number().gte(1).optional(),
      decoration: z.boolean().optional(),
      notificationId: z.string().min(1),
      gotifyId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateGotify",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testGotifyConnection",
    description: "POST /notification.testGotifyConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testGotifyConnection",
    schema: z.object({
      serverUrl: z.string().min(1),
      appToken: z.string().min(1),
      priority: z.number().gte(1),
      decoration: z.boolean().optional(),
    }),
    annotations: {
      title: "Notification TestGotifyConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createNtfy",
    description: "POST /notification.createNtfy",
    tag: "notification",
    method: "POST",
    path: "/notification.createNtfy",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverUrl: z.string().min(1),
      topic: z.string().min(1),
      accessToken: z.string(),
      priority: z.number().gte(1),
    }),
    annotations: {
      title: "Notification CreateNtfy",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateNtfy",
    description: "POST /notification.updateNtfy",
    tag: "notification",
    method: "POST",
    path: "/notification.updateNtfy",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverUrl: z.string().min(1).optional(),
      topic: z.string().min(1).optional(),
      accessToken: z.string().optional(),
      priority: z.number().gte(1).optional(),
      notificationId: z.string().min(1),
      ntfyId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateNtfy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testNtfyConnection",
    description: "POST /notification.testNtfyConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testNtfyConnection",
    schema: z.object({
      serverUrl: z.string().min(1),
      topic: z.string().min(1),
      accessToken: z.string(),
      priority: z.number().gte(1),
    }),
    annotations: {
      title: "Notification TestNtfyConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createMattermost",
    description: "POST /notification.createMattermost",
    tag: "notification",
    method: "POST",
    path: "/notification.createMattermost",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      webhookUrl: z.string().url(),
      channel: z.string().optional(),
      username: z.string().optional(),
    }),
    annotations: {
      title: "Notification CreateMattermost",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateMattermost",
    description: "POST /notification.updateMattermost",
    tag: "notification",
    method: "POST",
    path: "/notification.updateMattermost",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      webhookUrl: z.string().url().optional(),
      channel: z.string().optional(),
      username: z.string().optional(),
      notificationId: z.string().min(1),
      mattermostId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateMattermost",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testMattermostConnection",
    description: "POST /notification.testMattermostConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testMattermostConnection",
    schema: z.object({
      webhookUrl: z.string().url(),
      channel: z.string().optional(),
      username: z.string().optional(),
    }),
    annotations: {
      title: "Notification TestMattermostConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createCustom",
    description: "POST /notification.createCustom",
    tag: "notification",
    method: "POST",
    path: "/notification.createCustom",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      endpoint: z.string().min(1),
      headers: z.record(z.string(), z.string()).optional(),
    }),
    annotations: {
      title: "Notification CreateCustom",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateCustom",
    description: "POST /notification.updateCustom",
    tag: "notification",
    method: "POST",
    path: "/notification.updateCustom",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      endpoint: z.string().min(1).optional(),
      headers: z.record(z.string(), z.string()).optional(),
      notificationId: z.string().min(1),
      customId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateCustom",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testCustomConnection",
    description: "POST /notification.testCustomConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testCustomConnection",
    schema: z.object({
      endpoint: z.string().min(1),
      headers: z.record(z.string(), z.string()).optional(),
    }),
    annotations: {
      title: "Notification TestCustomConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createLark",
    description: "POST /notification.createLark",
    tag: "notification",
    method: "POST",
    path: "/notification.createLark",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      webhookUrl: z.string().min(1),
    }),
    annotations: {
      title: "Notification CreateLark",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateLark",
    description: "POST /notification.updateLark",
    tag: "notification",
    method: "POST",
    path: "/notification.updateLark",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      webhookUrl: z.string().min(1).optional(),
      notificationId: z.string().min(1),
      larkId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateLark",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testLarkConnection",
    description: "POST /notification.testLarkConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testLarkConnection",
    schema: z.object({ webhookUrl: z.string().min(1) }),
    annotations: {
      title: "Notification TestLarkConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createTeams",
    description: "POST /notification.createTeams",
    tag: "notification",
    method: "POST",
    path: "/notification.createTeams",
    schema: z.object({
      appBuildError: z.boolean(),
      databaseBackup: z.boolean(),
      dokployBackup: z.boolean(),
      volumeBackup: z.boolean(),
      dokployRestart: z.boolean(),
      name: z.string(),
      appDeploy: z.boolean(),
      dockerCleanup: z.boolean(),
      serverThreshold: z.boolean(),
      webhookUrl: z.string().min(1),
    }),
    annotations: {
      title: "Notification CreateTeams",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updateTeams",
    description: "POST /notification.updateTeams",
    tag: "notification",
    method: "POST",
    path: "/notification.updateTeams",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      webhookUrl: z.string().min(1).optional(),
      notificationId: z.string().min(1),
      teamsId: z.string().min(1),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Notification UpdateTeams",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testTeamsConnection",
    description: "POST /notification.testTeamsConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testTeamsConnection",
    schema: z.object({ webhookUrl: z.string().min(1) }),
    annotations: {
      title: "Notification TestTeamsConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-createPushover",
    description: "POST /notification.createPushover",
    tag: "notification",
    method: "POST",
    path: "/notification.createPushover",
    schema: z.object({
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
      userKey: z.string().min(1),
      apiToken: z.string().min(1),
      priority: z.number().gte(-2).lte(2).default(0),
      retry: z.union([z.number().gte(30), z.null()]).optional(),
      expire: z.union([z.number().gte(1).lte(10800), z.null()]).optional(),
    }),
    annotations: {
      title: "Notification CreatePushover",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "notification-updatePushover",
    description: "POST /notification.updatePushover",
    tag: "notification",
    method: "POST",
    path: "/notification.updatePushover",
    schema: z.object({
      notificationId: z.string().min(1),
      pushoverId: z.string().min(1),
      organizationId: z.string().optional(),
      userKey: z.string().min(1).optional(),
      apiToken: z.string().min(1).optional(),
      priority: z.number().gte(-2).lte(2).optional(),
      retry: z.union([z.number().gte(30), z.null()]).optional(),
      expire: z.union([z.number().gte(1).lte(10800), z.null()]).optional(),
      appBuildError: z.boolean().optional(),
      databaseBackup: z.boolean().optional(),
      dokployBackup: z.boolean().optional(),
      volumeBackup: z.boolean().optional(),
      dokployRestart: z.boolean().optional(),
      name: z.string().optional(),
      appDeploy: z.boolean().optional(),
      dockerCleanup: z.boolean().optional(),
      serverThreshold: z.boolean().optional(),
    }),
    annotations: {
      title: "Notification UpdatePushover",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-testPushoverConnection",
    description: "POST /notification.testPushoverConnection",
    tag: "notification",
    method: "POST",
    path: "/notification.testPushoverConnection",
    schema: z.object({
      userKey: z.string().min(1),
      apiToken: z.string().min(1),
      priority: z.number().gte(-2).lte(2),
      retry: z.union([z.number().gte(30), z.null()]).optional(),
      expire: z.union([z.number().gte(1).lte(10800), z.null()]).optional(),
    }),
    annotations: {
      title: "Notification TestPushoverConnection",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "notification-getEmailProviders",
    description: "GET /notification.getEmailProviders",
    tag: "notification",
    method: "GET",
    path: "/notification.getEmailProviders",
    schema: z.object({}),
    annotations: {
      title: "Notification GetEmailProviders",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "port-create",
    description: "POST /port.create",
    tag: "port",
    method: "POST",
    path: "/port.create",
    schema: z.object({
      publishedPort: z.number(),
      publishMode: z.enum(["ingress", "host"]).default("ingress"),
      targetPort: z.number(),
      protocol: z.enum(["tcp", "udp"]).default("tcp"),
      applicationId: z.string().min(1),
    }),
    annotations: {
      title: "Port Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "port-one",
    description: "GET /port.one",
    tag: "port",
    method: "GET",
    path: "/port.one",
    schema: z.object({ portId: z.string().min(1) }),
    annotations: {
      title: "Port One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "port-delete",
    description: "POST /port.delete",
    tag: "port",
    method: "POST",
    path: "/port.delete",
    schema: z.object({ portId: z.string().min(1) }),
    annotations: {
      title: "Port Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "port-update",
    description: "POST /port.update",
    tag: "port",
    method: "POST",
    path: "/port.update",
    schema: z.object({
      portId: z.string().min(1),
      publishedPort: z.number(),
      publishMode: z.enum(["ingress", "host"]).default("ingress"),
      targetPort: z.number(),
      protocol: z.enum(["tcp", "udp"]).default("tcp"),
    }),
    annotations: {
      title: "Port Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-create",
    description: "POST /postgres.create",
    tag: "postgres",
    method: "POST",
    path: "/postgres.create",
    schema: z.object({
      name: z.string().min(1),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      databaseName: z.string().min(1),
      databaseUser: z.string().min(1),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")),
      dockerImage: z.string().default("postgres:18"),
      environmentId: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      serverId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Postgres Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "postgres-one",
    description: "GET /postgres.one",
    tag: "postgres",
    method: "GET",
    path: "/postgres.one",
    schema: z.object({ postgresId: z.string().min(1) }),
    annotations: {
      title: "Postgres One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-start",
    description: "POST /postgres.start",
    tag: "postgres",
    method: "POST",
    path: "/postgres.start",
    schema: z.object({ postgresId: z.string().min(1) }),
    annotations: {
      title: "Postgres Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-stop",
    description: "POST /postgres.stop",
    tag: "postgres",
    method: "POST",
    path: "/postgres.stop",
    schema: z.object({ postgresId: z.string().min(1) }),
    annotations: {
      title: "Postgres Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-saveExternalPort",
    description: "POST /postgres.saveExternalPort",
    tag: "postgres",
    method: "POST",
    path: "/postgres.saveExternalPort",
    schema: z.object({ postgresId: z.string(), externalPort: z.union([z.number(), z.null()]) }),
    annotations: {
      title: "Postgres SaveExternalPort",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-deploy",
    description: "POST /postgres.deploy",
    tag: "postgres",
    method: "POST",
    path: "/postgres.deploy",
    schema: z.object({ postgresId: z.string() }),
    annotations: {
      title: "Postgres Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-changeStatus",
    description: "POST /postgres.changeStatus",
    tag: "postgres",
    method: "POST",
    path: "/postgres.changeStatus",
    schema: z.object({
      postgresId: z.string(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]),
    }),
    annotations: {
      title: "Postgres ChangeStatus",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-remove",
    description: "POST /postgres.remove",
    tag: "postgres",
    method: "POST",
    path: "/postgres.remove",
    schema: z.object({ postgresId: z.string().min(1) }),
    annotations: {
      title: "Postgres Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-saveEnvironment",
    description: "POST /postgres.saveEnvironment",
    tag: "postgres",
    method: "POST",
    path: "/postgres.saveEnvironment",
    schema: z.object({ postgresId: z.string(), env: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Postgres SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-reload",
    description: "POST /postgres.reload",
    tag: "postgres",
    method: "POST",
    path: "/postgres.reload",
    schema: z.object({
      postgresId: z.string(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63),
    }),
    annotations: {
      title: "Postgres Reload",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-update",
    description: "POST /postgres.update",
    tag: "postgres",
    method: "POST",
    path: "/postgres.update",
    schema: z.object({
      postgresId: z.string().min(1),
      name: z.string().min(1).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      databaseName: z.string().min(1).optional(),
      databaseUser: z.string().min(1).optional(),
      databasePassword: z
        .string()
        .regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$"))
        .optional(),
      description: z.union([z.string(), z.null()]).optional(),
      dockerImage: z.string().optional(),
      command: z.union([z.string(), z.null()]).optional(),
      args: z.union([z.array(z.string()), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      memoryReservation: z.union([z.string(), z.null()]).optional(),
      externalPort: z.union([z.number(), z.null()]).optional(),
      memoryLimit: z.union([z.string(), z.null()]).optional(),
      cpuReservation: z.union([z.string(), z.null()]).optional(),
      cpuLimit: z.union([z.string(), z.null()]).optional(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      healthCheckSwarm: z
        .union([
          z.union([
            z
              .object({
                Test: z.array(z.string()).optional(),
                Interval: z.number().optional(),
                Timeout: z.number().optional(),
                StartPeriod: z.number().optional(),
                Retries: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      restartPolicySwarm: z
        .union([
          z.union([
            z
              .object({
                Condition: z.string().optional(),
                Delay: z.number().optional(),
                MaxAttempts: z.number().optional(),
                Window: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      placementSwarm: z
        .union([
          z.union([
            z
              .object({
                Constraints: z.array(z.string()).optional(),
                Preferences: z
                  .array(z.object({ Spread: z.object({ SpreadDescriptor: z.string() }) }).strict())
                  .optional(),
                MaxReplicas: z.number().optional(),
                Platforms: z
                  .array(z.object({ Architecture: z.string(), OS: z.string() }).strict())
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      updateConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      rollbackConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      modeSwarm: z
        .union([
          z.union([
            z
              .object({
                Replicated: z.object({ Replicas: z.number().optional() }).strict().optional(),
                Global: z.object({}).optional(),
                ReplicatedJob: z
                  .object({
                    MaxConcurrent: z.number().optional(),
                    TotalCompletions: z.number().optional(),
                  })
                  .strict()
                  .optional(),
                GlobalJob: z.object({}).optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      labelsSwarm: z
        .union([z.union([z.record(z.string(), z.string()), z.null()]), z.null()])
        .optional(),
      networkSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Target: z.string().optional(),
                  Aliases: z.array(z.string()).optional(),
                  DriverOpts: z.record(z.string(), z.string()).optional(),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      stopGracePeriodSwarm: z.union([z.union([z.number(), z.null()]), z.null()]).optional(),
      endpointSpecSwarm: z
        .union([
          z.union([
            z
              .object({
                Mode: z.string().optional(),
                Ports: z
                  .array(
                    z
                      .object({
                        Protocol: z.string().optional(),
                        TargetPort: z.number().optional(),
                        PublishedPort: z.number().optional(),
                        PublishMode: z.string().optional(),
                      })
                      .strict(),
                  )
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      ulimitsSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Name: z.string().min(1),
                  Soft: z.number().int().gte(-1).lte(9007199254740991),
                  Hard: z.number().int().gte(-1).lte(9007199254740991),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      replicas: z.number().optional(),
      createdAt: z.string().optional(),
      environmentId: z.string().optional(),
    }),
    annotations: {
      title: "Postgres Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-changePassword",
    description: "POST /postgres.changePassword",
    tag: "postgres",
    method: "POST",
    path: "/postgres.changePassword",
    schema: z.object({
      postgresId: z.string().min(1),
      password: z.string().regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")).min(1),
    }),
    annotations: {
      title: "Postgres ChangePassword",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-move",
    description: "POST /postgres.move",
    tag: "postgres",
    method: "POST",
    path: "/postgres.move",
    schema: z.object({ postgresId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Postgres Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-rebuild",
    description: "POST /postgres.rebuild",
    tag: "postgres",
    method: "POST",
    path: "/postgres.rebuild",
    schema: z.object({ postgresId: z.string() }),
    annotations: {
      title: "Postgres Rebuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "postgres-search",
    description: "GET /postgres.search",
    tag: "postgres",
    method: "GET",
    path: "/postgres.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      appName: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Postgres Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "previewDeployment-all",
    description: "GET /previewDeployment.all",
    tag: "previewDeployment",
    method: "GET",
    path: "/previewDeployment.all",
    schema: z.object({ applicationId: z.string().min(1) }),
    annotations: {
      title: "PreviewDeployment All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "previewDeployment-one",
    description: "GET /previewDeployment.one",
    tag: "previewDeployment",
    method: "GET",
    path: "/previewDeployment.one",
    schema: z.object({ previewDeploymentId: z.string() }),
    annotations: {
      title: "PreviewDeployment One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "previewDeployment-delete",
    description: "POST /previewDeployment.delete",
    tag: "previewDeployment",
    method: "POST",
    path: "/previewDeployment.delete",
    schema: z.object({ previewDeploymentId: z.string() }),
    annotations: {
      title: "PreviewDeployment Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "previewDeployment-redeploy",
    description: "POST /previewDeployment.redeploy",
    tag: "previewDeployment",
    method: "POST",
    path: "/previewDeployment.redeploy",
    schema: z.object({
      previewDeploymentId: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    annotations: {
      title: "PreviewDeployment Redeploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "project-create",
    description: "POST /project.create",
    tag: "project",
    method: "POST",
    path: "/project.create",
    schema: z.object({
      name: z.string().min(1),
      description: z.union([z.string(), z.null()]).optional(),
      env: z.string().optional(),
    }),
    annotations: {
      title: "Project Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "project-one",
    description: "GET /project.one",
    tag: "project",
    method: "GET",
    path: "/project.one",
    schema: z.object({ projectId: z.string().min(1) }),
    annotations: {
      title: "Project One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "project-all",
    description: "GET /project.all",
    tag: "project",
    method: "GET",
    path: "/project.all",
    schema: z.object({}),
    annotations: {
      title: "Project All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "project-allForPermissions",
    description: "GET /project.allForPermissions",
    tag: "project",
    method: "GET",
    path: "/project.allForPermissions",
    schema: z.object({}),
    annotations: {
      title: "Project AllForPermissions",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "project-search",
    description: "GET /project.search",
    tag: "project",
    method: "GET",
    path: "/project.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Project Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "project-remove",
    description: "POST /project.remove",
    tag: "project",
    method: "POST",
    path: "/project.remove",
    schema: z.object({ projectId: z.string().min(1) }),
    annotations: {
      title: "Project Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "project-update",
    description: "POST /project.update",
    tag: "project",
    method: "POST",
    path: "/project.update",
    schema: z.object({
      projectId: z.string().min(1),
      name: z.string().min(1).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      createdAt: z.string().optional(),
      organizationId: z.string().optional(),
      env: z.string().optional(),
    }),
    annotations: {
      title: "Project Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "project-duplicate",
    description: "POST /project.duplicate",
    tag: "project",
    method: "POST",
    path: "/project.duplicate",
    schema: z.object({
      sourceEnvironmentId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      includeServices: z.boolean().default(true),
      selectedServices: z
        .array(
          z.object({
            id: z.string(),
            type: z.enum([
              "application",
              "compose",
              "libsql",
              "mariadb",
              "mongo",
              "mysql",
              "postgres",
              "redis",
            ]),
          }),
        )
        .optional(),
      duplicateInSameProject: z.boolean().default(false),
    }),
    annotations: {
      title: "Project Duplicate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redirects-create",
    description: "POST /redirects.create",
    tag: "redirects",
    method: "POST",
    path: "/redirects.create",
    schema: z.object({
      regex: z.string().min(1),
      replacement: z.string().min(1),
      permanent: z.boolean(),
      applicationId: z.string(),
    }),
    annotations: {
      title: "Redirects Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "redirects-one",
    description: "GET /redirects.one",
    tag: "redirects",
    method: "GET",
    path: "/redirects.one",
    schema: z.object({ redirectId: z.string().min(1) }),
    annotations: {
      title: "Redirects One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redirects-delete",
    description: "POST /redirects.delete",
    tag: "redirects",
    method: "POST",
    path: "/redirects.delete",
    schema: z.object({ redirectId: z.string().min(1) }),
    annotations: {
      title: "Redirects Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "redirects-update",
    description: "POST /redirects.update",
    tag: "redirects",
    method: "POST",
    path: "/redirects.update",
    schema: z.object({
      redirectId: z.string().min(1),
      regex: z.string().min(1),
      replacement: z.string().min(1),
      permanent: z.boolean(),
    }),
    annotations: {
      title: "Redirects Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-create",
    description: "POST /redis.create",
    tag: "redis",
    method: "POST",
    path: "/redis.create",
    schema: z.object({
      name: z.string().min(1),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      databasePassword: z.string(),
      dockerImage: z.string().default("redis:8"),
      environmentId: z.string(),
      description: z.union([z.string(), z.null()]).optional(),
      serverId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Redis Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "redis-one",
    description: "GET /redis.one",
    tag: "redis",
    method: "GET",
    path: "/redis.one",
    schema: z.object({ redisId: z.string().min(1) }),
    annotations: {
      title: "Redis One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-start",
    description: "POST /redis.start",
    tag: "redis",
    method: "POST",
    path: "/redis.start",
    schema: z.object({ redisId: z.string().min(1) }),
    annotations: {
      title: "Redis Start",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-reload",
    description: "POST /redis.reload",
    tag: "redis",
    method: "POST",
    path: "/redis.reload",
    schema: z.object({
      redisId: z.string(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63),
    }),
    annotations: {
      title: "Redis Reload",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-stop",
    description: "POST /redis.stop",
    tag: "redis",
    method: "POST",
    path: "/redis.stop",
    schema: z.object({ redisId: z.string().min(1) }),
    annotations: {
      title: "Redis Stop",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-saveExternalPort",
    description: "POST /redis.saveExternalPort",
    tag: "redis",
    method: "POST",
    path: "/redis.saveExternalPort",
    schema: z.object({ redisId: z.string(), externalPort: z.union([z.number(), z.null()]) }),
    annotations: {
      title: "Redis SaveExternalPort",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-deploy",
    description: "POST /redis.deploy",
    tag: "redis",
    method: "POST",
    path: "/redis.deploy",
    schema: z.object({ redisId: z.string() }),
    annotations: {
      title: "Redis Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-changeStatus",
    description: "POST /redis.changeStatus",
    tag: "redis",
    method: "POST",
    path: "/redis.changeStatus",
    schema: z.object({
      redisId: z.string(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]),
    }),
    annotations: {
      title: "Redis ChangeStatus",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-remove",
    description: "POST /redis.remove",
    tag: "redis",
    method: "POST",
    path: "/redis.remove",
    schema: z.object({ redisId: z.string().min(1) }),
    annotations: {
      title: "Redis Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-saveEnvironment",
    description: "POST /redis.saveEnvironment",
    tag: "redis",
    method: "POST",
    path: "/redis.saveEnvironment",
    schema: z.object({ redisId: z.string(), env: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Redis SaveEnvironment",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-update",
    description: "POST /redis.update",
    tag: "redis",
    method: "POST",
    path: "/redis.update",
    schema: z.object({
      redisId: z.string().min(1),
      name: z.string().min(1).optional(),
      appName: z.string().regex(new RegExp("^[a-zA-Z0-9._-]+$")).min(1).max(63).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      databasePassword: z.string().optional(),
      dockerImage: z.string().optional(),
      command: z.union([z.string(), z.null()]).optional(),
      args: z.union([z.array(z.string()), z.null()]).optional(),
      env: z.union([z.string(), z.null()]).optional(),
      memoryReservation: z.union([z.string(), z.null()]).optional(),
      memoryLimit: z.union([z.string(), z.null()]).optional(),
      cpuReservation: z.union([z.string(), z.null()]).optional(),
      cpuLimit: z.union([z.string(), z.null()]).optional(),
      externalPort: z.union([z.number(), z.null()]).optional(),
      createdAt: z.string().optional(),
      applicationStatus: z.enum(["idle", "running", "done", "error"]).optional(),
      healthCheckSwarm: z
        .union([
          z.union([
            z
              .object({
                Test: z.array(z.string()).optional(),
                Interval: z.number().optional(),
                Timeout: z.number().optional(),
                StartPeriod: z.number().optional(),
                Retries: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      restartPolicySwarm: z
        .union([
          z.union([
            z
              .object({
                Condition: z.string().optional(),
                Delay: z.number().optional(),
                MaxAttempts: z.number().optional(),
                Window: z.number().optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      placementSwarm: z
        .union([
          z.union([
            z
              .object({
                Constraints: z.array(z.string()).optional(),
                Preferences: z
                  .array(z.object({ Spread: z.object({ SpreadDescriptor: z.string() }) }).strict())
                  .optional(),
                MaxReplicas: z.number().optional(),
                Platforms: z
                  .array(z.object({ Architecture: z.string(), OS: z.string() }).strict())
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      updateConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      rollbackConfigSwarm: z
        .union([
          z.union([
            z
              .object({
                Parallelism: z.number(),
                Delay: z.number().optional(),
                FailureAction: z.string().optional(),
                Monitor: z.number().optional(),
                MaxFailureRatio: z.number().optional(),
                Order: z.string(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      modeSwarm: z
        .union([
          z.union([
            z
              .object({
                Replicated: z.object({ Replicas: z.number().optional() }).strict().optional(),
                Global: z.object({}).optional(),
                ReplicatedJob: z
                  .object({
                    MaxConcurrent: z.number().optional(),
                    TotalCompletions: z.number().optional(),
                  })
                  .strict()
                  .optional(),
                GlobalJob: z.object({}).optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      labelsSwarm: z
        .union([z.union([z.record(z.string(), z.string()), z.null()]), z.null()])
        .optional(),
      networkSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Target: z.string().optional(),
                  Aliases: z.array(z.string()).optional(),
                  DriverOpts: z.record(z.string(), z.string()).optional(),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      stopGracePeriodSwarm: z.union([z.union([z.number(), z.null()]), z.null()]).optional(),
      endpointSpecSwarm: z
        .union([
          z.union([
            z
              .object({
                Mode: z.string().optional(),
                Ports: z
                  .array(
                    z
                      .object({
                        Protocol: z.string().optional(),
                        TargetPort: z.number().optional(),
                        PublishedPort: z.number().optional(),
                        PublishMode: z.string().optional(),
                      })
                      .strict(),
                  )
                  .optional(),
              })
              .strict(),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      ulimitsSwarm: z
        .union([
          z.union([
            z.array(
              z
                .object({
                  Name: z.string().min(1),
                  Soft: z.number().int().gte(-1).lte(9007199254740991),
                  Hard: z.number().int().gte(-1).lte(9007199254740991),
                })
                .strict(),
            ),
            z.null(),
          ]),
          z.null(),
        ])
        .optional(),
      replicas: z.number().optional(),
      environmentId: z.string().optional(),
    }),
    annotations: {
      title: "Redis Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-changePassword",
    description: "POST /redis.changePassword",
    tag: "redis",
    method: "POST",
    path: "/redis.changePassword",
    schema: z.object({
      redisId: z.string().min(1),
      password: z.string().regex(new RegExp("^[a-zA-Z0-9@#%^&*()_+\\-=[\\]{}|;:,.<>?~`]*$")).min(1),
    }),
    annotations: {
      title: "Redis ChangePassword",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-move",
    description: "POST /redis.move",
    tag: "redis",
    method: "POST",
    path: "/redis.move",
    schema: z.object({ redisId: z.string(), targetEnvironmentId: z.string() }),
    annotations: {
      title: "Redis Move",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-rebuild",
    description: "POST /redis.rebuild",
    tag: "redis",
    method: "POST",
    path: "/redis.rebuild",
    schema: z.object({ redisId: z.string() }),
    annotations: {
      title: "Redis Rebuild",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "redis-search",
    description: "GET /redis.search",
    tag: "redis",
    method: "GET",
    path: "/redis.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      appName: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Redis Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "registry-create",
    description: "POST /registry.create",
    tag: "registry",
    method: "POST",
    path: "/registry.create",
    schema: z.object({
      registryName: z.string().min(1),
      username: z.string().min(1),
      password: z.string().min(1),
      registryUrl: z.string(),
      registryType: z.literal("cloud"),
      imagePrefix: z.union([z.string(), z.null()]),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Registry Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "registry-remove",
    description: "POST /registry.remove",
    tag: "registry",
    method: "POST",
    path: "/registry.remove",
    schema: z.object({ registryId: z.string().min(1) }),
    annotations: {
      title: "Registry Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "registry-update",
    description: "POST /registry.update",
    tag: "registry",
    method: "POST",
    path: "/registry.update",
    schema: z.object({
      registryId: z.string().min(1),
      registryName: z.string().min(1).optional(),
      imagePrefix: z.union([z.union([z.string(), z.null()]), z.null()]).optional(),
      username: z.string().min(1).optional(),
      password: z.string().min(1).optional(),
      registryUrl: z.string().optional(),
      createdAt: z.string().optional(),
      registryType: z.literal("cloud").optional(),
      organizationId: z.string().min(1).optional(),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Registry Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "registry-all",
    description: "GET /registry.all",
    tag: "registry",
    method: "GET",
    path: "/registry.all",
    schema: z.object({}),
    annotations: {
      title: "Registry All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "registry-one",
    description: "GET /registry.one",
    tag: "registry",
    method: "GET",
    path: "/registry.one",
    schema: z.object({ registryId: z.string().min(1) }),
    annotations: {
      title: "Registry One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "registry-testRegistry",
    description: "POST /registry.testRegistry",
    tag: "registry",
    method: "POST",
    path: "/registry.testRegistry",
    schema: z.object({
      registryName: z.string().optional(),
      username: z.string().min(1),
      password: z.string().min(1),
      registryUrl: z.string(),
      registryType: z.literal("cloud"),
      imagePrefix: z.union([z.string(), z.null()]).optional(),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Registry TestRegistry",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "registry-testRegistryById",
    description: "POST /registry.testRegistryById",
    tag: "registry",
    method: "POST",
    path: "/registry.testRegistryById",
    schema: z.object({ registryId: z.string().min(1).optional(), serverId: z.string().optional() }),
    annotations: {
      title: "Registry TestRegistryById",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "security-create",
    description: "POST /security.create",
    tag: "security",
    method: "POST",
    path: "/security.create",
    schema: z.object({
      applicationId: z.string(),
      username: z.string().min(1),
      password: z.string().min(1),
    }),
    annotations: {
      title: "Security Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "security-one",
    description: "GET /security.one",
    tag: "security",
    method: "GET",
    path: "/security.one",
    schema: z.object({ securityId: z.string().min(1) }),
    annotations: {
      title: "Security One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "security-delete",
    description: "POST /security.delete",
    tag: "security",
    method: "POST",
    path: "/security.delete",
    schema: z.object({ securityId: z.string().min(1) }),
    annotations: {
      title: "Security Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "security-update",
    description: "POST /security.update",
    tag: "security",
    method: "POST",
    path: "/security.update",
    schema: z.object({
      securityId: z.string().min(1),
      username: z.string().min(1),
      password: z.string().min(1),
    }),
    annotations: {
      title: "Security Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-create",
    description: "POST /server.create",
    tag: "server",
    method: "POST",
    path: "/server.create",
    schema: z.object({
      name: z.string().min(1),
      description: z.union([z.string(), z.null()]),
      ipAddress: z.string(),
      port: z.number(),
      username: z.string(),
      sshKeyId: z.union([z.string(), z.null()]),
      serverType: z.enum(["deploy", "build"]),
    }),
    annotations: {
      title: "Server Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "server-one",
    description: "GET /server.one",
    tag: "server",
    method: "GET",
    path: "/server.one",
    schema: z.object({ serverId: z.string().min(1) }),
    annotations: {
      title: "Server One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-getDefaultCommand",
    description: "GET /server.getDefaultCommand",
    tag: "server",
    method: "GET",
    path: "/server.getDefaultCommand",
    schema: z.object({ serverId: z.string().min(1) }),
    annotations: {
      title: "Server GetDefaultCommand",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-all",
    description: "GET /server.all",
    tag: "server",
    method: "GET",
    path: "/server.all",
    schema: z.object({}),
    annotations: {
      title: "Server All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-allForPermissions",
    description: "GET /server.allForPermissions",
    tag: "server",
    method: "GET",
    path: "/server.allForPermissions",
    schema: z.object({}),
    annotations: {
      title: "Server AllForPermissions",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-count",
    description: "GET /server.count",
    tag: "server",
    method: "GET",
    path: "/server.count",
    schema: z.object({}),
    annotations: {
      title: "Server Count",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-withSSHKey",
    description: "GET /server.withSSHKey",
    tag: "server",
    method: "GET",
    path: "/server.withSSHKey",
    schema: z.object({}),
    annotations: {
      title: "Server WithSSHKey",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-buildServers",
    description: "GET /server.buildServers",
    tag: "server",
    method: "GET",
    path: "/server.buildServers",
    schema: z.object({}),
    annotations: {
      title: "Server BuildServers",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-setup",
    description: "POST /server.setup",
    tag: "server",
    method: "POST",
    path: "/server.setup",
    schema: z.object({ serverId: z.string().min(1) }),
    annotations: {
      title: "Server Setup",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-validate",
    description: "GET /server.validate",
    tag: "server",
    method: "GET",
    path: "/server.validate",
    schema: z.object({ serverId: z.string().min(1) }),
    annotations: {
      title: "Server Validate",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-security",
    description: "GET /server.security",
    tag: "server",
    method: "GET",
    path: "/server.security",
    schema: z.object({ serverId: z.string().min(1) }),
    annotations: {
      title: "Server Security",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-setupMonitoring",
    description: "POST /server.setupMonitoring",
    tag: "server",
    method: "POST",
    path: "/server.setupMonitoring",
    schema: z.object({
      serverId: z.string().min(1),
      metricsConfig: z.object({
        server: z.object({
          refreshRate: z.number().gte(2),
          port: z.number().gte(1),
          token: z.string(),
          urlCallback: z.string().url(),
          retentionDays: z.number().gte(1),
          cronJob: z.string().min(1),
          thresholds: z.object({ cpu: z.number().gte(0), memory: z.number().gte(0) }),
        }),
        containers: z.object({
          refreshRate: z.number().gte(2),
          services: z.object({
            include: z.array(z.string()).optional(),
            exclude: z.array(z.string()).optional(),
          }),
        }),
      }),
    }),
    annotations: {
      title: "Server SetupMonitoring",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-remove",
    description: "POST /server.remove",
    tag: "server",
    method: "POST",
    path: "/server.remove",
    schema: z.object({ serverId: z.string().min(1) }),
    annotations: {
      title: "Server Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-update",
    description: "POST /server.update",
    tag: "server",
    method: "POST",
    path: "/server.update",
    schema: z.object({
      name: z.string().min(1),
      description: z.union([z.string(), z.null()]),
      serverId: z.string().min(1),
      ipAddress: z.string(),
      port: z.number(),
      username: z.string(),
      sshKeyId: z.union([z.string(), z.null()]),
      serverType: z.enum(["deploy", "build"]),
      command: z.string().optional(),
    }),
    annotations: {
      title: "Server Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-publicIp",
    description: "GET /server.publicIp",
    tag: "server",
    method: "GET",
    path: "/server.publicIp",
    schema: z.object({}),
    annotations: {
      title: "Server PublicIp",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-getServerTime",
    description: "GET /server.getServerTime",
    tag: "server",
    method: "GET",
    path: "/server.getServerTime",
    schema: z.object({}),
    annotations: {
      title: "Server GetServerTime",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "server-getServerMetrics",
    description: "GET /server.getServerMetrics",
    tag: "server",
    method: "GET",
    path: "/server.getServerMetrics",
    schema: z.object({ url: z.string(), token: z.string(), dataPoints: z.string() }),
    annotations: {
      title: "Server GetServerMetrics",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getWebServerSettings",
    description: "GET /settings.getWebServerSettings",
    tag: "settings",
    method: "GET",
    path: "/settings.getWebServerSettings",
    schema: z.object({}),
    annotations: {
      title: "Settings GetWebServerSettings",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-reloadServer",
    description: "POST /settings.reloadServer",
    tag: "settings",
    method: "POST",
    path: "/settings.reloadServer",
    schema: z.object({}),
    annotations: {
      title: "Settings ReloadServer",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanRedis",
    description: "POST /settings.cleanRedis",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanRedis",
    schema: z.object({}),
    annotations: {
      title: "Settings CleanRedis",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-reloadRedis",
    description: "POST /settings.reloadRedis",
    tag: "settings",
    method: "POST",
    path: "/settings.reloadRedis",
    schema: z.object({}),
    annotations: {
      title: "Settings ReloadRedis",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanAllDeploymentQueue",
    description: "POST /settings.cleanAllDeploymentQueue",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanAllDeploymentQueue",
    schema: z.object({}),
    annotations: {
      title: "Settings CleanAllDeploymentQueue",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-reloadTraefik",
    description: "POST /settings.reloadTraefik",
    tag: "settings",
    method: "POST",
    path: "/settings.reloadTraefik",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings ReloadTraefik",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-toggleDashboard",
    description: "POST /settings.toggleDashboard",
    tag: "settings",
    method: "POST",
    path: "/settings.toggleDashboard",
    schema: z.object({ enableDashboard: z.boolean().optional(), serverId: z.string().optional() }),
    annotations: {
      title: "Settings ToggleDashboard",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanUnusedImages",
    description: "POST /settings.cleanUnusedImages",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanUnusedImages",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings CleanUnusedImages",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanUnusedVolumes",
    description: "POST /settings.cleanUnusedVolumes",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanUnusedVolumes",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings CleanUnusedVolumes",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanStoppedContainers",
    description: "POST /settings.cleanStoppedContainers",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanStoppedContainers",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings CleanStoppedContainers",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanDockerBuilder",
    description: "POST /settings.cleanDockerBuilder",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanDockerBuilder",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings CleanDockerBuilder",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanDockerPrune",
    description: "POST /settings.cleanDockerPrune",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanDockerPrune",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings CleanDockerPrune",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanAll",
    description: "POST /settings.cleanAll",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanAll",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings CleanAll",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanMonitoring",
    description: "POST /settings.cleanMonitoring",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanMonitoring",
    schema: z.object({}),
    annotations: {
      title: "Settings CleanMonitoring",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getDockerDiskUsage",
    description: "GET /settings.getDockerDiskUsage",
    tag: "settings",
    method: "GET",
    path: "/settings.getDockerDiskUsage",
    schema: z.object({}),
    annotations: {
      title: "Settings GetDockerDiskUsage",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-saveSSHPrivateKey",
    description: "POST /settings.saveSSHPrivateKey",
    tag: "settings",
    method: "POST",
    path: "/settings.saveSSHPrivateKey",
    schema: z.object({ sshPrivateKey: z.string() }),
    annotations: {
      title: "Settings SaveSSHPrivateKey",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-assignDomainServer",
    description: "POST /settings.assignDomainServer",
    tag: "settings",
    method: "POST",
    path: "/settings.assignDomainServer",
    schema: z.object({
      host: z.string(),
      certificateType: z.enum(["letsencrypt", "none", "custom"]),
      letsEncryptEmail: z
        .union([
          z.union([
            z
              .string()
              .email()
              .regex(
                new RegExp(
                  "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
                ),
              ),
            z.literal(""),
          ]),
          z.null(),
        ])
        .optional(),
      https: z.boolean().optional(),
    }),
    annotations: {
      title: "Settings AssignDomainServer",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-cleanSSHPrivateKey",
    description: "POST /settings.cleanSSHPrivateKey",
    tag: "settings",
    method: "POST",
    path: "/settings.cleanSSHPrivateKey",
    schema: z.object({}),
    annotations: {
      title: "Settings CleanSSHPrivateKey",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateDockerCleanup",
    description: "POST /settings.updateDockerCleanup",
    tag: "settings",
    method: "POST",
    path: "/settings.updateDockerCleanup",
    schema: z.object({ enableDockerCleanup: z.boolean(), serverId: z.string().optional() }),
    annotations: {
      title: "Settings UpdateDockerCleanup",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-readTraefikConfig",
    description: "GET /settings.readTraefikConfig",
    tag: "settings",
    method: "GET",
    path: "/settings.readTraefikConfig",
    schema: z.object({}),
    annotations: {
      title: "Settings ReadTraefikConfig",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateTraefikConfig",
    description: "POST /settings.updateTraefikConfig",
    tag: "settings",
    method: "POST",
    path: "/settings.updateTraefikConfig",
    schema: z.object({ traefikConfig: z.string().min(1) }),
    annotations: {
      title: "Settings UpdateTraefikConfig",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-readWebServerTraefikConfig",
    description: "GET /settings.readWebServerTraefikConfig",
    tag: "settings",
    method: "GET",
    path: "/settings.readWebServerTraefikConfig",
    schema: z.object({}),
    annotations: {
      title: "Settings ReadWebServerTraefikConfig",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateWebServerTraefikConfig",
    description: "POST /settings.updateWebServerTraefikConfig",
    tag: "settings",
    method: "POST",
    path: "/settings.updateWebServerTraefikConfig",
    schema: z.object({ traefikConfig: z.string().min(1) }),
    annotations: {
      title: "Settings UpdateWebServerTraefikConfig",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-readMiddlewareTraefikConfig",
    description: "GET /settings.readMiddlewareTraefikConfig",
    tag: "settings",
    method: "GET",
    path: "/settings.readMiddlewareTraefikConfig",
    schema: z.object({}),
    annotations: {
      title: "Settings ReadMiddlewareTraefikConfig",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateMiddlewareTraefikConfig",
    description: "POST /settings.updateMiddlewareTraefikConfig",
    tag: "settings",
    method: "POST",
    path: "/settings.updateMiddlewareTraefikConfig",
    schema: z.object({ traefikConfig: z.string().min(1) }),
    annotations: {
      title: "Settings UpdateMiddlewareTraefikConfig",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getUpdateData",
    description: "POST /settings.getUpdateData",
    tag: "settings",
    method: "POST",
    path: "/settings.getUpdateData",
    schema: z.object({}),
    annotations: {
      title: "Settings GetUpdateData",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateServer",
    description: "POST /settings.updateServer",
    tag: "settings",
    method: "POST",
    path: "/settings.updateServer",
    schema: z.object({}),
    annotations: {
      title: "Settings UpdateServer",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getDokployVersion",
    description: "GET /settings.getDokployVersion",
    tag: "settings",
    method: "GET",
    path: "/settings.getDokployVersion",
    schema: z.object({}),
    annotations: {
      title: "Settings GetDokployVersion",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getReleaseTag",
    description: "GET /settings.getReleaseTag",
    tag: "settings",
    method: "GET",
    path: "/settings.getReleaseTag",
    schema: z.object({}),
    annotations: {
      title: "Settings GetReleaseTag",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-readDirectories",
    description: "GET /settings.readDirectories",
    tag: "settings",
    method: "GET",
    path: "/settings.readDirectories",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings ReadDirectories",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateTraefikFile",
    description: "POST /settings.updateTraefikFile",
    tag: "settings",
    method: "POST",
    path: "/settings.updateTraefikFile",
    schema: z.object({
      path: z.string().min(1),
      traefikConfig: z.string().min(1),
      serverId: z.string().optional(),
    }),
    annotations: {
      title: "Settings UpdateTraefikFile",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-readTraefikFile",
    description: "GET /settings.readTraefikFile",
    tag: "settings",
    method: "GET",
    path: "/settings.readTraefikFile",
    schema: z.object({ path: z.string().min(1), serverId: z.string().optional() }),
    annotations: {
      title: "Settings ReadTraefikFile",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getIp",
    description: "GET /settings.getIp",
    tag: "settings",
    method: "GET",
    path: "/settings.getIp",
    schema: z.object({}),
    annotations: {
      title: "Settings GetIp",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateServerIp",
    description: "POST /settings.updateServerIp",
    tag: "settings",
    method: "POST",
    path: "/settings.updateServerIp",
    schema: z.object({ serverIp: z.string() }),
    annotations: {
      title: "Settings UpdateServerIp",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getOpenApiDocument",
    description: "GET /settings.getOpenApiDocument",
    tag: "settings",
    method: "GET",
    path: "/settings.getOpenApiDocument",
    schema: z.object({}),
    annotations: {
      title: "Settings GetOpenApiDocument",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-readTraefikEnv",
    description: "GET /settings.readTraefikEnv",
    tag: "settings",
    method: "GET",
    path: "/settings.readTraefikEnv",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings ReadTraefikEnv",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-writeTraefikEnv",
    description: "POST /settings.writeTraefikEnv",
    tag: "settings",
    method: "POST",
    path: "/settings.writeTraefikEnv",
    schema: z.object({ env: z.string(), serverId: z.string().optional() }),
    annotations: {
      title: "Settings WriteTraefikEnv",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-haveTraefikDashboardPortEnabled",
    description: "GET /settings.haveTraefikDashboardPortEnabled",
    tag: "settings",
    method: "GET",
    path: "/settings.haveTraefikDashboardPortEnabled",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings HaveTraefikDashboardPortEnabled",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-haveActivateRequests",
    description: "GET /settings.haveActivateRequests",
    tag: "settings",
    method: "GET",
    path: "/settings.haveActivateRequests",
    schema: z.object({}),
    annotations: {
      title: "Settings HaveActivateRequests",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-toggleRequests",
    description: "POST /settings.toggleRequests",
    tag: "settings",
    method: "POST",
    path: "/settings.toggleRequests",
    schema: z.object({ enable: z.boolean() }),
    annotations: {
      title: "Settings ToggleRequests",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-isCloud",
    description: "GET /settings.isCloud",
    tag: "settings",
    method: "GET",
    path: "/settings.isCloud",
    schema: z.object({}),
    annotations: {
      title: "Settings IsCloud",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-isUserSubscribed",
    description: "GET /settings.isUserSubscribed",
    tag: "settings",
    method: "GET",
    path: "/settings.isUserSubscribed",
    schema: z.object({}),
    annotations: {
      title: "Settings IsUserSubscribed",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-health",
    description: "GET /settings.health",
    tag: "settings",
    method: "GET",
    path: "/settings.health",
    schema: z.object({}),
    annotations: {
      title: "Settings Health",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-checkInfrastructureHealth",
    description: "GET /settings.checkInfrastructureHealth",
    tag: "settings",
    method: "GET",
    path: "/settings.checkInfrastructureHealth",
    schema: z.object({}),
    annotations: {
      title: "Settings CheckInfrastructureHealth",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-setupGPU",
    description: "POST /settings.setupGPU",
    tag: "settings",
    method: "POST",
    path: "/settings.setupGPU",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings SetupGPU",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-checkGPUStatus",
    description: "GET /settings.checkGPUStatus",
    tag: "settings",
    method: "GET",
    path: "/settings.checkGPUStatus",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings CheckGPUStatus",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateTraefikPorts",
    description: "POST /settings.updateTraefikPorts",
    tag: "settings",
    method: "POST",
    path: "/settings.updateTraefikPorts",
    schema: z.object({
      serverId: z.string().optional(),
      additionalPorts: z.array(
        z.object({
          targetPort: z.number(),
          publishedPort: z.number(),
          protocol: z.enum(["tcp", "udp", "sctp"]),
        }),
      ),
    }),
    annotations: {
      title: "Settings UpdateTraefikPorts",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getTraefikPorts",
    description: "GET /settings.getTraefikPorts",
    tag: "settings",
    method: "GET",
    path: "/settings.getTraefikPorts",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Settings GetTraefikPorts",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-updateLogCleanup",
    description: "POST /settings.updateLogCleanup",
    tag: "settings",
    method: "POST",
    path: "/settings.updateLogCleanup",
    schema: z.object({ cronExpression: z.union([z.string(), z.null()]) }),
    annotations: {
      title: "Settings UpdateLogCleanup",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getLogCleanupStatus",
    description: "GET /settings.getLogCleanupStatus",
    tag: "settings",
    method: "GET",
    path: "/settings.getLogCleanupStatus",
    schema: z.object({}),
    annotations: {
      title: "Settings GetLogCleanupStatus",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "settings-getDokployCloudIps",
    description: "GET /settings.getDokployCloudIps",
    tag: "settings",
    method: "GET",
    path: "/settings.getDokployCloudIps",
    schema: z.object({}),
    annotations: {
      title: "Settings GetDokployCloudIps",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sshKey-create",
    description: "POST /sshKey.create",
    tag: "sshKey",
    method: "POST",
    path: "/sshKey.create",
    schema: z.object({
      name: z.string().min(1),
      description: z.union([z.string(), z.null()]).optional(),
      privateKey: z.string(),
      publicKey: z.string(),
      organizationId: z.string(),
    }),
    annotations: {
      title: "SshKey Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "sshKey-remove",
    description: "POST /sshKey.remove",
    tag: "sshKey",
    method: "POST",
    path: "/sshKey.remove",
    schema: z.object({ sshKeyId: z.string() }),
    annotations: {
      title: "SshKey Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "sshKey-one",
    description: "GET /sshKey.one",
    tag: "sshKey",
    method: "GET",
    path: "/sshKey.one",
    schema: z.object({ sshKeyId: z.string().min(1) }),
    annotations: {
      title: "SshKey One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sshKey-all",
    description: "GET /sshKey.all",
    tag: "sshKey",
    method: "GET",
    path: "/sshKey.all",
    schema: z.object({}),
    annotations: {
      title: "SshKey All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sshKey-allForApps",
    description: "GET /sshKey.allForApps",
    tag: "sshKey",
    method: "GET",
    path: "/sshKey.allForApps",
    schema: z.object({}),
    annotations: {
      title: "SshKey AllForApps",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sshKey-generate",
    description: "POST /sshKey.generate",
    tag: "sshKey",
    method: "POST",
    path: "/sshKey.generate",
    schema: z.object({ type: z.enum(["rsa", "ed25519"]).optional() }),
    annotations: {
      title: "SshKey Generate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sshKey-update",
    description: "POST /sshKey.update",
    tag: "sshKey",
    method: "POST",
    path: "/sshKey.update",
    schema: z.object({
      name: z.string().min(1).optional(),
      description: z.union([z.string(), z.null()]).optional(),
      lastUsedAt: z.union([z.string(), z.null()]).optional(),
      sshKeyId: z.string(),
    }),
    annotations: {
      title: "SshKey Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "stripe-getCurrentPlan",
    description: "GET /stripe.getCurrentPlan",
    tag: "stripe",
    method: "GET",
    path: "/stripe.getCurrentPlan",
    schema: z.object({}),
    annotations: {
      title: "Stripe GetCurrentPlan",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "stripe-getProducts",
    description: "GET /stripe.getProducts",
    tag: "stripe",
    method: "GET",
    path: "/stripe.getProducts",
    schema: z.object({}),
    annotations: {
      title: "Stripe GetProducts",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "stripe-createCheckoutSession",
    description: "POST /stripe.createCheckoutSession",
    tag: "stripe",
    method: "POST",
    path: "/stripe.createCheckoutSession",
    schema: z.object({
      tier: z.enum(["legacy", "hobby", "startup"]),
      productId: z.string(),
      serverQuantity: z.number().gte(1),
      isAnnual: z.boolean(),
    }),
    annotations: {
      title: "Stripe CreateCheckoutSession",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "stripe-createCustomerPortalSession",
    description: "POST /stripe.createCustomerPortalSession",
    tag: "stripe",
    method: "POST",
    path: "/stripe.createCustomerPortalSession",
    schema: z.object({}),
    annotations: {
      title: "Stripe CreateCustomerPortalSession",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "stripe-upgradeSubscription",
    description: "POST /stripe.upgradeSubscription",
    tag: "stripe",
    method: "POST",
    path: "/stripe.upgradeSubscription",
    schema: z.object({
      tier: z.enum(["hobby", "startup"]),
      serverQuantity: z.number().gte(1),
      isAnnual: z.boolean(),
    }),
    annotations: {
      title: "Stripe UpgradeSubscription",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "stripe-canCreateMoreServers",
    description: "GET /stripe.canCreateMoreServers",
    tag: "stripe",
    method: "GET",
    path: "/stripe.canCreateMoreServers",
    schema: z.object({}),
    annotations: {
      title: "Stripe CanCreateMoreServers",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "stripe-getInvoices",
    description: "GET /stripe.getInvoices",
    tag: "stripe",
    method: "GET",
    path: "/stripe.getInvoices",
    schema: z.object({}),
    annotations: {
      title: "Stripe GetInvoices",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "swarm-getNodes",
    description: "GET /swarm.getNodes",
    tag: "swarm",
    method: "GET",
    path: "/swarm.getNodes",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Swarm GetNodes",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "swarm-getNodeInfo",
    description: "GET /swarm.getNodeInfo",
    tag: "swarm",
    method: "GET",
    path: "/swarm.getNodeInfo",
    schema: z.object({ nodeId: z.string(), serverId: z.string().optional() }),
    annotations: {
      title: "Swarm GetNodeInfo",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "swarm-getNodeApps",
    description: "GET /swarm.getNodeApps",
    tag: "swarm",
    method: "GET",
    path: "/swarm.getNodeApps",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Swarm GetNodeApps",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "swarm-getContainerStats",
    description: "GET /swarm.getContainerStats",
    tag: "swarm",
    method: "GET",
    path: "/swarm.getContainerStats",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Swarm GetContainerStats",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-all",
    description: "GET /user.all",
    tag: "user",
    method: "GET",
    path: "/user.all",
    schema: z.object({}),
    annotations: {
      title: "User All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-one",
    description: "GET /user.one",
    tag: "user",
    method: "GET",
    path: "/user.one",
    schema: z.object({ userId: z.string() }),
    annotations: {
      title: "User One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-session",
    description: "GET /user.session",
    tag: "user",
    method: "GET",
    path: "/user.session",
    schema: z.object({}),
    annotations: {
      title: "User Session",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-get",
    description: "GET /user.get",
    tag: "user",
    method: "GET",
    path: "/user.get",
    schema: z.object({}),
    annotations: {
      title: "User Get",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getPermissions",
    description: "GET /user.getPermissions",
    tag: "user",
    method: "GET",
    path: "/user.getPermissions",
    schema: z.object({}),
    annotations: {
      title: "User GetPermissions",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-haveRootAccess",
    description: "GET /user.haveRootAccess",
    tag: "user",
    method: "GET",
    path: "/user.haveRootAccess",
    schema: z.object({}),
    annotations: {
      title: "User HaveRootAccess",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getBackups",
    description: "GET /user.getBackups",
    tag: "user",
    method: "GET",
    path: "/user.getBackups",
    schema: z.object({}),
    annotations: {
      title: "User GetBackups",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getServerMetrics",
    description: "GET /user.getServerMetrics",
    tag: "user",
    method: "GET",
    path: "/user.getServerMetrics",
    schema: z.object({}),
    annotations: {
      title: "User GetServerMetrics",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-update",
    description: "POST /user.update",
    tag: "user",
    method: "POST",
    path: "/user.update",
    schema: z.object({
      id: z.string().min(1).optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      isRegistered: z.boolean().optional(),
      expirationDate: z.string().optional(),
      createdAt2: z.string().optional(),
      createdAt: z.union([z.string(), z.null()]).optional(),
      twoFactorEnabled: z.union([z.boolean(), z.null()]).optional(),
      email: z
        .string()
        .email()
        .regex(
          new RegExp(
            "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
          ),
        )
        .min(1)
        .optional(),
      emailVerified: z.boolean().optional(),
      image: z.union([z.string(), z.null()]).optional(),
      banned: z.union([z.boolean(), z.null()]).optional(),
      banReason: z.union([z.string(), z.null()]).optional(),
      banExpires: z.union([z.string(), z.null()]).optional(),
      updatedAt: z.string().optional(),
      enablePaidFeatures: z.boolean().optional(),
      allowImpersonation: z.boolean().optional(),
      enableEnterpriseFeatures: z.boolean().optional(),
      licenseKey: z.union([z.string(), z.null()]).optional(),
      stripeCustomerId: z.union([z.string(), z.null()]).optional(),
      stripeSubscriptionId: z.union([z.string(), z.null()]).optional(),
      serversQuantity: z.number().optional(),
      password: z.string().optional(),
      currentPassword: z.string().optional(),
    }),
    annotations: {
      title: "User Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getUserByToken",
    description: "GET /user.getUserByToken",
    tag: "user",
    method: "GET",
    path: "/user.getUserByToken",
    schema: z.object({ token: z.string().min(1) }),
    annotations: {
      title: "User GetUserByToken",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getMetricsToken",
    description: "GET /user.getMetricsToken",
    tag: "user",
    method: "GET",
    path: "/user.getMetricsToken",
    schema: z.object({}),
    annotations: {
      title: "User GetMetricsToken",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-remove",
    description: "POST /user.remove",
    tag: "user",
    method: "POST",
    path: "/user.remove",
    schema: z.object({ userId: z.string() }),
    annotations: {
      title: "User Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-assignPermissions",
    description: "POST /user.assignPermissions",
    tag: "user",
    method: "POST",
    path: "/user.assignPermissions",
    schema: z.object({
      id: z.string().min(1),
      accessedProjects: z.array(z.string()),
      accessedEnvironments: z.array(z.string()),
      accessedServices: z.array(z.string()),
      accessedGitProviders: z.array(z.string()),
      accessedServers: z.array(z.string()),
      canCreateProjects: z.boolean(),
      canCreateServices: z.boolean(),
      canDeleteProjects: z.boolean(),
      canDeleteServices: z.boolean(),
      canAccessToDocker: z.boolean(),
      canAccessToTraefikFiles: z.boolean(),
      canAccessToAPI: z.boolean(),
      canAccessToSSHKeys: z.boolean(),
      canAccessToGitProviders: z.boolean(),
      canDeleteEnvironments: z.boolean(),
      canCreateEnvironments: z.boolean(),
    }),
    annotations: {
      title: "User AssignPermissions",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getInvitations",
    description: "GET /user.getInvitations",
    tag: "user",
    method: "GET",
    path: "/user.getInvitations",
    schema: z.object({}),
    annotations: {
      title: "User GetInvitations",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getContainerMetrics",
    description: "GET /user.getContainerMetrics",
    tag: "user",
    method: "GET",
    path: "/user.getContainerMetrics",
    schema: z.object({
      url: z.string(),
      token: z.string(),
      appName: z.string(),
      dataPoints: z.string(),
    }),
    annotations: {
      title: "User GetContainerMetrics",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-generateToken",
    description: "POST /user.generateToken",
    tag: "user",
    method: "POST",
    path: "/user.generateToken",
    schema: z.object({}),
    annotations: {
      title: "User GenerateToken",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-deleteApiKey",
    description: "POST /user.deleteApiKey",
    tag: "user",
    method: "POST",
    path: "/user.deleteApiKey",
    schema: z.object({ apiKeyId: z.string() }),
    annotations: {
      title: "User DeleteApiKey",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-createApiKey",
    description: "POST /user.createApiKey",
    tag: "user",
    method: "POST",
    path: "/user.createApiKey",
    schema: z.object({
      name: z.string().min(1),
      prefix: z.string().optional(),
      expiresIn: z.number().optional(),
      metadata: z.object({ organizationId: z.string() }),
      rateLimitEnabled: z.boolean().optional(),
      rateLimitTimeWindow: z.number().optional(),
      rateLimitMax: z.number().optional(),
      remaining: z.number().optional(),
      refillAmount: z.number().optional(),
      refillInterval: z.number().optional(),
    }),
    annotations: {
      title: "User CreateApiKey",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "user-checkUserOrganizations",
    description: "GET /user.checkUserOrganizations",
    tag: "user",
    method: "GET",
    path: "/user.checkUserOrganizations",
    schema: z.object({ userId: z.string() }),
    annotations: {
      title: "User CheckUserOrganizations",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-createUserWithCredentials",
    description: "POST /user.createUserWithCredentials",
    tag: "user",
    method: "POST",
    path: "/user.createUserWithCredentials",
    schema: z.object({
      email: z
        .string()
        .email()
        .regex(
          new RegExp(
            "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
          ),
        ),
      password: z.string().min(8),
      role: z.string().min(1),
    }),
    annotations: {
      title: "User CreateUserWithCredentials",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "user-sendInvitation",
    description: "POST /user.sendInvitation",
    tag: "user",
    method: "POST",
    path: "/user.sendInvitation",
    schema: z.object({ invitationId: z.string().min(1), notificationId: z.string().min(1) }),
    annotations: {
      title: "User SendInvitation",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-getBookmarkedTemplates",
    description: "GET /user.getBookmarkedTemplates",
    tag: "user",
    method: "GET",
    path: "/user.getBookmarkedTemplates",
    schema: z.object({}),
    annotations: {
      title: "User GetBookmarkedTemplates",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "user-toggleTemplateBookmark",
    description: "POST /user.toggleTemplateBookmark",
    tag: "user",
    method: "POST",
    path: "/user.toggleTemplateBookmark",
    schema: z.object({ templateId: z.string().min(1) }),
    annotations: {
      title: "User ToggleTemplateBookmark",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-one",
    description: "GET /ai.one",
    tag: "ai",
    method: "GET",
    path: "/ai.one",
    schema: z.object({ aiId: z.string() }),
    annotations: {
      title: "Ai One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-getModels",
    description: "GET /ai.getModels",
    tag: "ai",
    method: "GET",
    path: "/ai.getModels",
    schema: z.object({ apiUrl: z.string().min(1), apiKey: z.string() }),
    annotations: {
      title: "Ai GetModels",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-create",
    description: "POST /ai.create",
    tag: "ai",
    method: "POST",
    path: "/ai.create",
    schema: z.object({
      name: z.string().min(1),
      apiUrl: z.string().url(),
      apiKey: z.string(),
      model: z.string().min(1),
      isEnabled: z.boolean(),
    }),
    annotations: {
      title: "Ai Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "ai-update",
    description: "POST /ai.update",
    tag: "ai",
    method: "POST",
    path: "/ai.update",
    schema: z.object({
      aiId: z.string().min(1),
      name: z.string().min(1).optional(),
      apiUrl: z.string().url().optional(),
      apiKey: z.string().optional(),
      model: z.string().min(1).optional(),
      isEnabled: z.boolean().optional(),
      createdAt: z.string().optional(),
    }),
    annotations: {
      title: "Ai Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-getAll",
    description: "GET /ai.getAll",
    tag: "ai",
    method: "GET",
    path: "/ai.getAll",
    schema: z.object({}),
    annotations: {
      title: "Ai GetAll",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-get",
    description: "GET /ai.get",
    tag: "ai",
    method: "GET",
    path: "/ai.get",
    schema: z.object({ aiId: z.string() }),
    annotations: {
      title: "Ai Get",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-delete",
    description: "POST /ai.delete",
    tag: "ai",
    method: "POST",
    path: "/ai.delete",
    schema: z.object({ aiId: z.string() }),
    annotations: {
      title: "Ai Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-suggest",
    description: "POST /ai.suggest",
    tag: "ai",
    method: "POST",
    path: "/ai.suggest",
    schema: z.object({ aiId: z.string(), input: z.string(), serverId: z.string().optional() }),
    annotations: {
      title: "Ai Suggest",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "ai-deploy",
    description: "POST /ai.deploy",
    tag: "ai",
    method: "POST",
    path: "/ai.deploy",
    schema: z.object({
      environmentId: z.string().min(1),
      id: z.string().min(1),
      dockerCompose: z.string().min(1),
      envVariables: z.string(),
      serverId: z.string().optional(),
      name: z.string().min(1),
      description: z.string(),
      domains: z
        .array(
          z.object({
            host: z.string().min(1),
            port: z.number().gte(1),
            serviceName: z.string().min(1),
          }),
        )
        .optional(),
      configFiles: z
        .array(z.object({ filePath: z.string().min(1), content: z.string().min(1) }))
        .optional(),
    }),
    annotations: {
      title: "Ai Deploy",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-create",
    description: "POST /organization.create",
    tag: "organization",
    method: "POST",
    path: "/organization.create",
    schema: z.object({ name: z.string(), logo: z.string().optional() }),
    annotations: {
      title: "Organization Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "organization-all",
    description: "GET /organization.all",
    tag: "organization",
    method: "GET",
    path: "/organization.all",
    schema: z.object({}),
    annotations: {
      title: "Organization All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-one",
    description: "GET /organization.one",
    tag: "organization",
    method: "GET",
    path: "/organization.one",
    schema: z.object({ organizationId: z.string() }),
    annotations: {
      title: "Organization One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-update",
    description: "POST /organization.update",
    tag: "organization",
    method: "POST",
    path: "/organization.update",
    schema: z.object({ organizationId: z.string(), name: z.string(), logo: z.string().optional() }),
    annotations: {
      title: "Organization Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-delete",
    description: "POST /organization.delete",
    tag: "organization",
    method: "POST",
    path: "/organization.delete",
    schema: z.object({ organizationId: z.string() }),
    annotations: {
      title: "Organization Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-inviteMember",
    description: "POST /organization.inviteMember",
    tag: "organization",
    method: "POST",
    path: "/organization.inviteMember",
    schema: z.object({
      email: z
        .string()
        .email()
        .regex(
          new RegExp(
            "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
          ),
        ),
      role: z.string().min(1),
    }),
    annotations: {
      title: "Organization InviteMember",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-allInvitations",
    description: "GET /organization.allInvitations",
    tag: "organization",
    method: "GET",
    path: "/organization.allInvitations",
    schema: z.object({}),
    annotations: {
      title: "Organization AllInvitations",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-removeInvitation",
    description: "POST /organization.removeInvitation",
    tag: "organization",
    method: "POST",
    path: "/organization.removeInvitation",
    schema: z.object({ invitationId: z.string() }),
    annotations: {
      title: "Organization RemoveInvitation",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-updateMemberRole",
    description: "POST /organization.updateMemberRole",
    tag: "organization",
    method: "POST",
    path: "/organization.updateMemberRole",
    schema: z.object({ memberId: z.string(), role: z.string().min(1) }),
    annotations: {
      title: "Organization UpdateMemberRole",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-setDefault",
    description: "POST /organization.setDefault",
    tag: "organization",
    method: "POST",
    path: "/organization.setDefault",
    schema: z.object({ organizationId: z.string().min(1) }),
    annotations: {
      title: "Organization SetDefault",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "organization-active",
    description: "GET /organization.active",
    tag: "organization",
    method: "GET",
    path: "/organization.active",
    schema: z.object({}),
    annotations: {
      title: "Organization Active",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "licenseKey-activate",
    description: "POST /licenseKey.activate",
    tag: "licenseKey",
    method: "POST",
    path: "/licenseKey.activate",
    schema: z.object({ licenseKey: z.string().min(1) }),
    annotations: {
      title: "LicenseKey Activate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "licenseKey-validate",
    description: "POST /licenseKey.validate",
    tag: "licenseKey",
    method: "POST",
    path: "/licenseKey.validate",
    schema: z.object({}),
    annotations: {
      title: "LicenseKey Validate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "licenseKey-deactivate",
    description: "POST /licenseKey.deactivate",
    tag: "licenseKey",
    method: "POST",
    path: "/licenseKey.deactivate",
    schema: z.object({}),
    annotations: {
      title: "LicenseKey Deactivate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "licenseKey-getEnterpriseSettings",
    description: "GET /licenseKey.getEnterpriseSettings",
    tag: "licenseKey",
    method: "GET",
    path: "/licenseKey.getEnterpriseSettings",
    schema: z.object({}),
    annotations: {
      title: "LicenseKey GetEnterpriseSettings",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "licenseKey-haveValidLicenseKey",
    description: "GET /licenseKey.haveValidLicenseKey",
    tag: "licenseKey",
    method: "GET",
    path: "/licenseKey.haveValidLicenseKey",
    schema: z.object({}),
    annotations: {
      title: "LicenseKey HaveValidLicenseKey",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "licenseKey-updateEnterpriseSettings",
    description: "POST /licenseKey.updateEnterpriseSettings",
    tag: "licenseKey",
    method: "POST",
    path: "/licenseKey.updateEnterpriseSettings",
    schema: z.object({ enableEnterpriseFeatures: z.boolean().optional() }),
    annotations: {
      title: "LicenseKey UpdateEnterpriseSettings",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-showSignInWithSSO",
    description: "GET /sso.showSignInWithSSO",
    tag: "sso",
    method: "GET",
    path: "/sso.showSignInWithSSO",
    schema: z.object({}),
    annotations: {
      title: "Sso ShowSignInWithSSO",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-listProviders",
    description: "GET /sso.listProviders",
    tag: "sso",
    method: "GET",
    path: "/sso.listProviders",
    schema: z.object({}),
    annotations: {
      title: "Sso ListProviders",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-getTrustedOrigins",
    description: "GET /sso.getTrustedOrigins",
    tag: "sso",
    method: "GET",
    path: "/sso.getTrustedOrigins",
    schema: z.object({}),
    annotations: {
      title: "Sso GetTrustedOrigins",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-one",
    description: "GET /sso.one",
    tag: "sso",
    method: "GET",
    path: "/sso.one",
    schema: z.object({ providerId: z.string().min(1) }),
    annotations: {
      title: "Sso One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-update",
    description: "POST /sso.update",
    tag: "sso",
    method: "POST",
    path: "/sso.update",
    schema: z.object({
      providerId: z.string(),
      issuer: z.string(),
      domains: z.array(z.string()),
      oidcConfig: z
        .object({
          clientId: z.string(),
          clientSecret: z.string(),
          authorizationEndpoint: z.string().optional(),
          tokenEndpoint: z.string().optional(),
          userInfoEndpoint: z.string().optional(),
          tokenEndpointAuthentication: z
            .enum(["client_secret_post", "client_secret_basic"])
            .optional(),
          jwksEndpoint: z.string().optional(),
          discoveryEndpoint: z.string().optional(),
          skipDiscovery: z.boolean().optional(),
          scopes: z.array(z.string()).optional(),
          pkce: z.boolean().default(true),
          mapping: z
            .object({
              id: z.string(),
              email: z.string(),
              emailVerified: z.string().optional(),
              name: z.string(),
              image: z.string().optional(),
              extraFields: z.record(z.string(), z.any()).optional(),
            })
            .optional(),
        })
        .optional(),
      samlConfig: z
        .object({
          entryPoint: z.string(),
          cert: z.string(),
          callbackUrl: z.string(),
          audience: z.string().optional(),
          idpMetadata: z
            .object({
              metadata: z.string().optional(),
              entityID: z.string().optional(),
              cert: z.string().optional(),
              privateKey: z.string().optional(),
              privateKeyPass: z.string().optional(),
              isAssertionEncrypted: z.boolean().optional(),
              encPrivateKey: z.string().optional(),
              encPrivateKeyPass: z.string().optional(),
              singleSignOnService: z
                .array(z.object({ Binding: z.string(), Location: z.string() }))
                .optional(),
            })
            .optional(),
          spMetadata: z.object({
            metadata: z.string().optional(),
            entityID: z.string().optional(),
            binding: z.string().optional(),
            privateKey: z.string().optional(),
            privateKeyPass: z.string().optional(),
            isAssertionEncrypted: z.boolean().optional(),
            encPrivateKey: z.string().optional(),
            encPrivateKeyPass: z.string().optional(),
          }),
          wantAssertionsSigned: z.boolean().optional(),
          authnRequestsSigned: z.boolean().optional(),
          signatureAlgorithm: z.string().optional(),
          digestAlgorithm: z.string().optional(),
          identifierFormat: z.string().optional(),
          privateKey: z.string().optional(),
          decryptionPvk: z.string().optional(),
          additionalParams: z.record(z.string(), z.any()).optional(),
          mapping: z
            .object({
              id: z.string(),
              email: z.string(),
              emailVerified: z.string().optional(),
              name: z.string(),
              firstName: z.string().optional(),
              lastName: z.string().optional(),
              extraFields: z.record(z.string(), z.any()).optional(),
            })
            .optional(),
        })
        .optional(),
      organizationId: z.string().optional(),
      overrideUserInfo: z.boolean().default(false),
    }),
    annotations: {
      title: "Sso Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-deleteProvider",
    description: "POST /sso.deleteProvider",
    tag: "sso",
    method: "POST",
    path: "/sso.deleteProvider",
    schema: z.object({ providerId: z.string().min(1) }),
    annotations: {
      title: "Sso DeleteProvider",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-register",
    description: "POST /sso.register",
    tag: "sso",
    method: "POST",
    path: "/sso.register",
    schema: z.object({
      providerId: z.string(),
      issuer: z.string(),
      domains: z.array(z.string()),
      oidcConfig: z
        .object({
          clientId: z.string(),
          clientSecret: z.string(),
          authorizationEndpoint: z.string().optional(),
          tokenEndpoint: z.string().optional(),
          userInfoEndpoint: z.string().optional(),
          tokenEndpointAuthentication: z
            .enum(["client_secret_post", "client_secret_basic"])
            .optional(),
          jwksEndpoint: z.string().optional(),
          discoveryEndpoint: z.string().optional(),
          skipDiscovery: z.boolean().optional(),
          scopes: z.array(z.string()).optional(),
          pkce: z.boolean().default(true),
          mapping: z
            .object({
              id: z.string(),
              email: z.string(),
              emailVerified: z.string().optional(),
              name: z.string(),
              image: z.string().optional(),
              extraFields: z.record(z.string(), z.any()).optional(),
            })
            .optional(),
        })
        .optional(),
      samlConfig: z
        .object({
          entryPoint: z.string(),
          cert: z.string(),
          callbackUrl: z.string(),
          audience: z.string().optional(),
          idpMetadata: z
            .object({
              metadata: z.string().optional(),
              entityID: z.string().optional(),
              cert: z.string().optional(),
              privateKey: z.string().optional(),
              privateKeyPass: z.string().optional(),
              isAssertionEncrypted: z.boolean().optional(),
              encPrivateKey: z.string().optional(),
              encPrivateKeyPass: z.string().optional(),
              singleSignOnService: z
                .array(z.object({ Binding: z.string(), Location: z.string() }))
                .optional(),
            })
            .optional(),
          spMetadata: z.object({
            metadata: z.string().optional(),
            entityID: z.string().optional(),
            binding: z.string().optional(),
            privateKey: z.string().optional(),
            privateKeyPass: z.string().optional(),
            isAssertionEncrypted: z.boolean().optional(),
            encPrivateKey: z.string().optional(),
            encPrivateKeyPass: z.string().optional(),
          }),
          wantAssertionsSigned: z.boolean().optional(),
          authnRequestsSigned: z.boolean().optional(),
          signatureAlgorithm: z.string().optional(),
          digestAlgorithm: z.string().optional(),
          identifierFormat: z.string().optional(),
          privateKey: z.string().optional(),
          decryptionPvk: z.string().optional(),
          additionalParams: z.record(z.string(), z.any()).optional(),
          mapping: z
            .object({
              id: z.string(),
              email: z.string(),
              emailVerified: z.string().optional(),
              name: z.string(),
              firstName: z.string().optional(),
              lastName: z.string().optional(),
              extraFields: z.record(z.string(), z.any()).optional(),
            })
            .optional(),
        })
        .optional(),
      organizationId: z.string().optional(),
      overrideUserInfo: z.boolean().default(false),
    }),
    annotations: {
      title: "Sso Register",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-addTrustedOrigin",
    description: "POST /sso.addTrustedOrigin",
    tag: "sso",
    method: "POST",
    path: "/sso.addTrustedOrigin",
    schema: z.object({ origin: z.string().min(1) }),
    annotations: {
      title: "Sso AddTrustedOrigin",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-removeTrustedOrigin",
    description: "POST /sso.removeTrustedOrigin",
    tag: "sso",
    method: "POST",
    path: "/sso.removeTrustedOrigin",
    schema: z.object({ origin: z.string().min(1) }),
    annotations: {
      title: "Sso RemoveTrustedOrigin",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "sso-updateTrustedOrigin",
    description: "POST /sso.updateTrustedOrigin",
    tag: "sso",
    method: "POST",
    path: "/sso.updateTrustedOrigin",
    schema: z.object({ oldOrigin: z.string().min(1), newOrigin: z.string().min(1) }),
    annotations: {
      title: "Sso UpdateTrustedOrigin",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "whitelabeling-get",
    description: "GET /whitelabeling.get",
    tag: "whitelabeling",
    method: "GET",
    path: "/whitelabeling.get",
    schema: z.object({}),
    annotations: {
      title: "Whitelabeling Get",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "whitelabeling-update",
    description: "POST /whitelabeling.update",
    tag: "whitelabeling",
    method: "POST",
    path: "/whitelabeling.update",
    schema: z.object({
      whitelabelingConfig: z.object({
        appName: z.union([z.string(), z.null()]),
        appDescription: z.union([z.string(), z.null()]),
        logoUrl: z.union([z.string(), z.null()]),
        faviconUrl: z.union([z.string(), z.null()]),
        customCss: z.union([z.string(), z.null()]),
        loginLogoUrl: z.union([z.string(), z.null()]),
        supportUrl: z.union([z.string(), z.null()]),
        docsUrl: z.union([z.string(), z.null()]),
        errorPageTitle: z.union([z.string(), z.null()]),
        errorPageDescription: z.union([z.string(), z.null()]),
        metaTitle: z.union([z.string(), z.null()]),
        footerText: z.union([z.string(), z.null()]),
      }),
    }),
    annotations: {
      title: "Whitelabeling Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "whitelabeling-reset",
    description: "POST /whitelabeling.reset",
    tag: "whitelabeling",
    method: "POST",
    path: "/whitelabeling.reset",
    schema: z.object({}),
    annotations: {
      title: "Whitelabeling Reset",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "whitelabeling-getPublic",
    description: "GET /whitelabeling.getPublic",
    tag: "whitelabeling",
    method: "GET",
    path: "/whitelabeling.getPublic",
    schema: z.object({}),
    annotations: {
      title: "Whitelabeling GetPublic",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "customRole-all",
    description: "GET /customRole.all",
    tag: "customRole",
    method: "GET",
    path: "/customRole.all",
    schema: z.object({}),
    annotations: {
      title: "CustomRole All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "customRole-create",
    description: "POST /customRole.create",
    tag: "customRole",
    method: "POST",
    path: "/customRole.create",
    schema: z.object({
      roleName: z.string().min(1).max(50),
      permissions: z.record(z.string(), z.array(z.string())),
    }),
    annotations: {
      title: "CustomRole Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "customRole-update",
    description: "POST /customRole.update",
    tag: "customRole",
    method: "POST",
    path: "/customRole.update",
    schema: z.object({
      roleName: z.string().min(1),
      newRoleName: z.string().min(1).max(50).optional(),
      permissions: z.record(z.string(), z.array(z.string())),
    }),
    annotations: {
      title: "CustomRole Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "customRole-remove",
    description: "POST /customRole.remove",
    tag: "customRole",
    method: "POST",
    path: "/customRole.remove",
    schema: z.object({ roleName: z.string().min(1) }),
    annotations: {
      title: "CustomRole Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "customRole-membersByRole",
    description: "GET /customRole.membersByRole",
    tag: "customRole",
    method: "GET",
    path: "/customRole.membersByRole",
    schema: z.object({ roleName: z.string().min(1) }),
    annotations: {
      title: "CustomRole MembersByRole",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "customRole-getStatements",
    description: "GET /customRole.getStatements",
    tag: "customRole",
    method: "GET",
    path: "/customRole.getStatements",
    schema: z.object({}),
    annotations: {
      title: "CustomRole GetStatements",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "auditLog-all",
    description: "GET /auditLog.all",
    tag: "auditLog",
    method: "GET",
    path: "/auditLog.all",
    schema: z.object({
      userId: z.string().optional(),
      userEmail: z.string().optional(),
      resourceName: z.string().optional(),
      action: z
        .enum(["create", "update", "delete", "deploy", "cancel", "redeploy", "login", "logout"])
        .optional(),
      resourceType: z
        .enum([
          "project",
          "service",
          "environment",
          "deployment",
          "user",
          "customRole",
          "domain",
          "certificate",
          "registry",
          "server",
          "sshKey",
          "gitProvider",
          "notification",
          "settings",
          "session",
        ])
        .optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      limit: z.number().gte(1).lte(500).default(50),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "AuditLog All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "schedule-create",
    description: "POST /schedule.create",
    tag: "schedule",
    method: "POST",
    path: "/schedule.create",
    schema: z.object({
      scheduleId: z.string().optional(),
      name: z.string(),
      cronExpression: z.string(),
      appName: z.string().optional(),
      serviceName: z.union([z.string(), z.null()]).optional(),
      shellType: z.enum(["bash", "sh"]).optional(),
      scheduleType: z.enum(["application", "compose", "server", "dokploy-server"]).optional(),
      command: z.string(),
      script: z.union([z.string(), z.null()]).optional(),
      applicationId: z.union([z.string(), z.null()]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
      serverId: z.union([z.string(), z.null()]).optional(),
      userId: z.union([z.string(), z.null()]).optional(),
      enabled: z.boolean().optional(),
      timezone: z.union([z.string(), z.null()]).optional(),
      createdAt: z.string().optional(),
    }),
    annotations: {
      title: "Schedule Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "schedule-update",
    description: "POST /schedule.update",
    tag: "schedule",
    method: "POST",
    path: "/schedule.update",
    schema: z.object({
      scheduleId: z.string().min(1),
      name: z.string(),
      cronExpression: z.string(),
      appName: z.string().optional(),
      serviceName: z.union([z.string(), z.null()]).optional(),
      shellType: z.enum(["bash", "sh"]).optional(),
      scheduleType: z.enum(["application", "compose", "server", "dokploy-server"]).optional(),
      command: z.string(),
      script: z.union([z.string(), z.null()]).optional(),
      applicationId: z.union([z.string(), z.null()]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
      serverId: z.union([z.string(), z.null()]).optional(),
      userId: z.union([z.string(), z.null()]).optional(),
      enabled: z.boolean().optional(),
      timezone: z.union([z.string(), z.null()]).optional(),
      createdAt: z.string().optional(),
    }),
    annotations: {
      title: "Schedule Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "schedule-delete",
    description: "POST /schedule.delete",
    tag: "schedule",
    method: "POST",
    path: "/schedule.delete",
    schema: z.object({ scheduleId: z.string() }),
    annotations: {
      title: "Schedule Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "schedule-list",
    description: "GET /schedule.list",
    tag: "schedule",
    method: "GET",
    path: "/schedule.list",
    schema: z.object({
      id: z.string(),
      scheduleType: z.enum(["application", "compose", "server", "dokploy-server"]),
    }),
    annotations: {
      title: "Schedule List",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "schedule-one",
    description: "GET /schedule.one",
    tag: "schedule",
    method: "GET",
    path: "/schedule.one",
    schema: z.object({ scheduleId: z.string() }),
    annotations: {
      title: "Schedule One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "schedule-runManually",
    description: "POST /schedule.runManually",
    tag: "schedule",
    method: "POST",
    path: "/schedule.runManually",
    schema: z.object({ scheduleId: z.string().min(1) }),
    annotations: {
      title: "Schedule RunManually",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "rollback-delete",
    description: "POST /rollback.delete",
    tag: "rollback",
    method: "POST",
    path: "/rollback.delete",
    schema: z.object({ rollbackId: z.string().min(1) }),
    annotations: {
      title: "Rollback Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "rollback-rollback",
    description: "POST /rollback.rollback",
    tag: "rollback",
    method: "POST",
    path: "/rollback.rollback",
    schema: z.object({ rollbackId: z.string().min(1) }),
    annotations: {
      title: "Rollback Rollback",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "volumeBackups-list",
    description: "GET /volumeBackups.list",
    tag: "volumeBackups",
    method: "GET",
    path: "/volumeBackups.list",
    schema: z.object({
      id: z.string().min(1),
      volumeBackupType: z.enum([
        "application",
        "postgres",
        "mysql",
        "mariadb",
        "mongo",
        "redis",
        "compose",
        "libsql",
      ]),
    }),
    annotations: {
      title: "VolumeBackups List",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "volumeBackups-create",
    description: "POST /volumeBackups.create",
    tag: "volumeBackups",
    method: "POST",
    path: "/volumeBackups.create",
    schema: z.object({
      name: z.string(),
      volumeName: z.string(),
      prefix: z.string(),
      serviceType: z
        .enum([
          "application",
          "postgres",
          "mysql",
          "mariadb",
          "mongo",
          "redis",
          "compose",
          "libsql",
        ])
        .optional(),
      appName: z.string().optional(),
      serviceName: z.union([z.string(), z.null()]).optional(),
      turnOff: z.boolean().optional(),
      cronExpression: z.string(),
      keepLatestCount: z.union([z.number(), z.null()]).optional(),
      enabled: z.union([z.boolean(), z.null()]).optional(),
      applicationId: z.union([z.string(), z.null()]).optional(),
      postgresId: z.union([z.string(), z.null()]).optional(),
      mariadbId: z.union([z.string(), z.null()]).optional(),
      mongoId: z.union([z.string(), z.null()]).optional(),
      mysqlId: z.union([z.string(), z.null()]).optional(),
      redisId: z.union([z.string(), z.null()]).optional(),
      libsqlId: z.union([z.string(), z.null()]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
      createdAt: z.string().optional(),
      destinationId: z.string(),
    }),
    annotations: {
      title: "VolumeBackups Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "volumeBackups-one",
    description: "GET /volumeBackups.one",
    tag: "volumeBackups",
    method: "GET",
    path: "/volumeBackups.one",
    schema: z.object({ volumeBackupId: z.string().min(1) }),
    annotations: {
      title: "VolumeBackups One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "volumeBackups-delete",
    description: "POST /volumeBackups.delete",
    tag: "volumeBackups",
    method: "POST",
    path: "/volumeBackups.delete",
    schema: z.object({ volumeBackupId: z.string().min(1) }),
    annotations: {
      title: "VolumeBackups Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "volumeBackups-update",
    description: "POST /volumeBackups.update",
    tag: "volumeBackups",
    method: "POST",
    path: "/volumeBackups.update",
    schema: z.object({
      name: z.string(),
      volumeName: z.string(),
      prefix: z.string(),
      serviceType: z
        .enum([
          "application",
          "postgres",
          "mysql",
          "mariadb",
          "mongo",
          "redis",
          "compose",
          "libsql",
        ])
        .optional(),
      appName: z.string().optional(),
      serviceName: z.union([z.string(), z.null()]).optional(),
      turnOff: z.boolean().optional(),
      cronExpression: z.string(),
      keepLatestCount: z.union([z.number(), z.null()]).optional(),
      enabled: z.union([z.boolean(), z.null()]).optional(),
      applicationId: z.union([z.string(), z.null()]).optional(),
      postgresId: z.union([z.string(), z.null()]).optional(),
      mariadbId: z.union([z.string(), z.null()]).optional(),
      mongoId: z.union([z.string(), z.null()]).optional(),
      mysqlId: z.union([z.string(), z.null()]).optional(),
      redisId: z.union([z.string(), z.null()]).optional(),
      libsqlId: z.union([z.string(), z.null()]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
      createdAt: z.string().optional(),
      destinationId: z.string(),
      volumeBackupId: z.string().min(1),
    }),
    annotations: {
      title: "VolumeBackups Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "volumeBackups-runManually",
    description: "POST /volumeBackups.runManually",
    tag: "volumeBackups",
    method: "POST",
    path: "/volumeBackups.runManually",
    schema: z.object({ volumeBackupId: z.string().min(1) }),
    annotations: {
      title: "VolumeBackups RunManually",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "environment-create",
    description: "POST /environment.create",
    tag: "environment",
    method: "POST",
    path: "/environment.create",
    schema: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      projectId: z.string().min(1),
    }),
    annotations: {
      title: "Environment Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "environment-one",
    description: "GET /environment.one",
    tag: "environment",
    method: "GET",
    path: "/environment.one",
    schema: z.object({ environmentId: z.string().min(1) }),
    annotations: {
      title: "Environment One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "environment-byProjectId",
    description: "GET /environment.byProjectId",
    tag: "environment",
    method: "GET",
    path: "/environment.byProjectId",
    schema: z.object({ projectId: z.string() }),
    annotations: {
      title: "Environment ByProjectId",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "environment-remove",
    description: "POST /environment.remove",
    tag: "environment",
    method: "POST",
    path: "/environment.remove",
    schema: z.object({ environmentId: z.string().min(1) }),
    annotations: {
      title: "Environment Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "environment-update",
    description: "POST /environment.update",
    tag: "environment",
    method: "POST",
    path: "/environment.update",
    schema: z.object({
      environmentId: z.string().min(1),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      env: z.string().optional(),
    }),
    annotations: {
      title: "Environment Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "environment-duplicate",
    description: "POST /environment.duplicate",
    tag: "environment",
    method: "POST",
    path: "/environment.duplicate",
    schema: z.object({
      environmentId: z.string().min(1),
      name: z.string().min(1),
      description: z.string().optional(),
    }),
    annotations: {
      title: "Environment Duplicate",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "environment-search",
    description: "GET /environment.search",
    tag: "environment",
    method: "GET",
    path: "/environment.search",
    schema: z.object({
      q: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      projectId: z.string().optional(),
      limit: z.number().gte(1).lte(100).default(20),
      offset: z.number().gte(0).default(0),
    }),
    annotations: {
      title: "Environment Search",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "tag-create",
    description: "POST /tag.create",
    tag: "tag",
    method: "POST",
    path: "/tag.create",
    schema: z.object({
      name: z.string().min(1),
      color: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Tag Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "tag-all",
    description: "GET /tag.all",
    tag: "tag",
    method: "GET",
    path: "/tag.all",
    schema: z.object({}),
    annotations: {
      title: "Tag All",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "tag-one",
    description: "GET /tag.one",
    tag: "tag",
    method: "GET",
    path: "/tag.one",
    schema: z.object({ tagId: z.string().min(1) }),
    annotations: {
      title: "Tag One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "tag-update",
    description: "POST /tag.update",
    tag: "tag",
    method: "POST",
    path: "/tag.update",
    schema: z.object({
      tagId: z.string().min(1),
      name: z.string().min(1).optional(),
      color: z.union([z.string(), z.null()]).optional(),
      createdAt: z.string().optional(),
      organizationId: z.string().optional(),
    }),
    annotations: {
      title: "Tag Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "tag-remove",
    description: "POST /tag.remove",
    tag: "tag",
    method: "POST",
    path: "/tag.remove",
    schema: z.object({ tagId: z.string().min(1) }),
    annotations: {
      title: "Tag Remove",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "tag-assignToProject",
    description: "POST /tag.assignToProject",
    tag: "tag",
    method: "POST",
    path: "/tag.assignToProject",
    schema: z.object({ projectId: z.string().min(1), tagId: z.string().min(1) }),
    annotations: {
      title: "Tag AssignToProject",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "tag-removeFromProject",
    description: "POST /tag.removeFromProject",
    tag: "tag",
    method: "POST",
    path: "/tag.removeFromProject",
    schema: z.object({ projectId: z.string().min(1), tagId: z.string().min(1) }),
    annotations: {
      title: "Tag RemoveFromProject",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "tag-bulkAssign",
    description: "POST /tag.bulkAssign",
    tag: "tag",
    method: "POST",
    path: "/tag.bulkAssign",
    schema: z.object({ projectId: z.string().min(1), tagIds: z.array(z.string().min(1)) }),
    annotations: {
      title: "Tag BulkAssign",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-create",
    description: "POST /patch.create",
    tag: "patch",
    method: "POST",
    path: "/patch.create",
    schema: z.object({
      filePath: z.string().min(1),
      content: z.string(),
      type: z.enum(["create", "update", "delete"]).optional(),
      enabled: z.boolean().optional(),
      applicationId: z.union([z.string(), z.null()]).optional(),
      composeId: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Patch Create",
      ...{ openWorldHint: true },
    },
  },
  {
    name: "patch-one",
    description: "GET /patch.one",
    tag: "patch",
    method: "GET",
    path: "/patch.one",
    schema: z.object({ patchId: z.string().min(1) }),
    annotations: {
      title: "Patch One",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-byEntityId",
    description: "GET /patch.byEntityId",
    tag: "patch",
    method: "GET",
    path: "/patch.byEntityId",
    schema: z.object({ id: z.string(), type: z.enum(["application", "compose"]) }),
    annotations: {
      title: "Patch ByEntityId",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-update",
    description: "POST /patch.update",
    tag: "patch",
    method: "POST",
    path: "/patch.update",
    schema: z.object({
      patchId: z.string().min(1),
      type: z.enum(["create", "update", "delete"]).optional(),
      filePath: z.string().min(1).optional(),
      enabled: z.boolean().optional(),
      content: z.string().optional(),
      createdAt: z.string().optional(),
      updatedAt: z.union([z.string(), z.null()]).optional(),
    }),
    annotations: {
      title: "Patch Update",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-delete",
    description: "POST /patch.delete",
    tag: "patch",
    method: "POST",
    path: "/patch.delete",
    schema: z.object({ patchId: z.string().min(1) }),
    annotations: {
      title: "Patch Delete",
      ...{ destructiveHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-toggleEnabled",
    description: "POST /patch.toggleEnabled",
    tag: "patch",
    method: "POST",
    path: "/patch.toggleEnabled",
    schema: z.object({ patchId: z.string().min(1), enabled: z.boolean() }),
    annotations: {
      title: "Patch ToggleEnabled",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-ensureRepo",
    description: "POST /patch.ensureRepo",
    tag: "patch",
    method: "POST",
    path: "/patch.ensureRepo",
    schema: z.object({ id: z.string(), type: z.enum(["application", "compose"]) }),
    annotations: {
      title: "Patch EnsureRepo",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-readRepoDirectories",
    description: "GET /patch.readRepoDirectories",
    tag: "patch",
    method: "GET",
    path: "/patch.readRepoDirectories",
    schema: z.object({
      id: z.string().min(1),
      type: z.enum(["application", "compose"]),
      repoPath: z.string(),
    }),
    annotations: {
      title: "Patch ReadRepoDirectories",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-readRepoFile",
    description: "GET /patch.readRepoFile",
    tag: "patch",
    method: "GET",
    path: "/patch.readRepoFile",
    schema: z.object({
      id: z.string().min(1),
      type: z.enum(["application", "compose"]),
      filePath: z.string(),
    }),
    annotations: {
      title: "Patch ReadRepoFile",
      ...{ readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-saveFileAsPatch",
    description: "POST /patch.saveFileAsPatch",
    tag: "patch",
    method: "POST",
    path: "/patch.saveFileAsPatch",
    schema: z.object({
      id: z.string().min(1),
      type: z.enum(["application", "compose"]),
      filePath: z.string(),
      content: z.string(),
      patchType: z.enum(["create", "update"]).default("update"),
    }),
    annotations: {
      title: "Patch SaveFileAsPatch",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-markFileForDeletion",
    description: "POST /patch.markFileForDeletion",
    tag: "patch",
    method: "POST",
    path: "/patch.markFileForDeletion",
    schema: z.object({
      id: z.string().min(1),
      type: z.enum(["application", "compose"]),
      filePath: z.string(),
    }),
    annotations: {
      title: "Patch MarkFileForDeletion",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
  {
    name: "patch-cleanPatchRepos",
    description: "POST /patch.cleanPatchRepos",
    tag: "patch",
    method: "POST",
    path: "/patch.cleanPatchRepos",
    schema: z.object({ serverId: z.string().optional() }),
    annotations: {
      title: "Patch CleanPatchRepos",
      ...{ idempotentHint: true, openWorldHint: true },
    },
  },
];
