import { z } from "zod";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Import all individual tool schemas for reuse
import { applicationCancelDeployment } from "../application/applicationCancelDeployment.js";
import { applicationCleanQueues } from "../application/applicationCleanQueues.js";
import { applicationCreate } from "../application/applicationCreate.js";
import { applicationDelete } from "../application/applicationDelete.js";
import { applicationDeploy } from "../application/applicationDeploy.js";
import { applicationDisconnectGitProvider } from "../application/applicationDisconnectGitProvider.js";
import { applicationMarkRunning } from "../application/applicationMarkRunning.js";
import { applicationMove } from "../application/applicationMove.js";
import { applicationOne } from "../application/applicationOne.js";
import { applicationReadAppMonitoring } from "../application/applicationReadAppMonitoring.js";
import { applicationReadTraefikConfig } from "../application/applicationReadTraefikConfig.js";
import { applicationRedeploy } from "../application/applicationRedeploy.js";
import { applicationRefreshToken } from "../application/applicationRefreshToken.js";
import { applicationReload } from "../application/applicationReload.js";
import { applicationSaveBitbucketProvider } from "../application/applicationSaveBitbucketProvider.js";
import { applicationSaveBuildType } from "../application/applicationSaveBuildType.js";
import { applicationSaveDockerProvider } from "../application/applicationSaveDockerProvider.js";
import { applicationSaveEnvironment } from "../application/applicationSaveEnvironment.js";
import { applicationSaveGitProvider } from "../application/applicationSaveGitProvider.js";
import { applicationSaveGiteaProvider } from "../application/applicationSaveGiteaProvider.js";
import { applicationSaveGithubProvider } from "../application/applicationSaveGithubProvider.js";
import { applicationSaveGitlabProvider } from "../application/applicationSaveGitlabProvider.js";
import { applicationStart } from "../application/applicationStart.js";
import { applicationStop } from "../application/applicationStop.js";
import { applicationUpdate } from "../application/applicationUpdate.js";
import { applicationUpdateTraefikConfig } from "../application/applicationUpdateTraefikConfig.js";

export const dokployApplication = createTool({
  name: "dokploy_application",
  description:
    "Consolidated tool for managing Dokploy applications. Supports multiple actions: create, delete, deploy, start, stop, update, get, redeploy, reload, move, cancelDeployment, cleanQueues, disconnectGitProvider, markRunning, readAppMonitoring, readTraefikConfig, refreshToken, saveBitbucketProvider, saveBuildType, saveDockerProvider, saveEnvironment, saveGitProvider, saveGiteaProvider, saveGithubProvider, saveGitlabProvider, updateTraefikConfig.",
  schema: z.object({
    action: z
      .enum([
        "create",
        "delete",
        "deploy",
        "start",
        "stop",
        "update",
        "get",
        "redeploy",
        "reload",
        "move",
        "cancelDeployment",
        "cleanQueues",
        "disconnectGitProvider",
        "markRunning",
        "readAppMonitoring",
        "readTraefikConfig",
        "refreshToken",
        "saveBitbucketProvider",
        "saveBuildType",
        "saveDockerProvider",
        "saveEnvironment",
        "saveGitProvider",
        "saveGiteaProvider",
        "saveGithubProvider",
        "saveGitlabProvider",
        "updateTraefikConfig",
      ])
      .describe(
        "The action to perform on the application: create, delete, deploy, start, stop, update, get, redeploy, reload, move, cancelDeployment, cleanQueues, disconnectGitProvider, markRunning, readAppMonitoring, readTraefikConfig, refreshToken, saveBitbucketProvider, saveBuildType, saveDockerProvider, saveEnvironment, saveGitProvider, saveGiteaProvider, saveGithubProvider, saveGitlabProvider, updateTraefikConfig"
      ),
    // Make parameters optional so they can be passed based on the action
    params: z
      .record(z.any())
      .optional()
      .describe(
        "Parameters for the action. The required parameters vary by action. See individual tool documentation for details."
      ),
  }),
  annotations: {
    title: "Manage Dokploy Application",
    destructiveHint: false, // Will be dynamically set based on action
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { action, params = {} } = input;

    // Map actions to their corresponding tool handlers
    const actionMap: Record<string, any> = {
      create: applicationCreate,
      delete: applicationDelete,
      deploy: applicationDeploy,
      start: applicationStart,
      stop: applicationStop,
      update: applicationUpdate,
      get: applicationOne,
      redeploy: applicationRedeploy,
      reload: applicationReload,
      move: applicationMove,
      cancelDeployment: applicationCancelDeployment,
      cleanQueues: applicationCleanQueues,
      disconnectGitProvider: applicationDisconnectGitProvider,
      markRunning: applicationMarkRunning,
      readAppMonitoring: applicationReadAppMonitoring,
      readTraefikConfig: applicationReadTraefikConfig,
      refreshToken: applicationRefreshToken,
      saveBitbucketProvider: applicationSaveBitbucketProvider,
      saveBuildType: applicationSaveBuildType,
      saveDockerProvider: applicationSaveDockerProvider,
      saveEnvironment: applicationSaveEnvironment,
      saveGitProvider: applicationSaveGitProvider,
      saveGiteaProvider: applicationSaveGiteaProvider,
      saveGithubProvider: applicationSaveGithubProvider,
      saveGitlabProvider: applicationSaveGitlabProvider,
      updateTraefikConfig: applicationUpdateTraefikConfig,
    };

    const tool = actionMap[action];
    if (!tool) {
      return ResponseFormatter.error(
        "Invalid action",
        `Action "${action}" is not supported`
      );
    }

    // Call the corresponding tool handler with the provided params
    try {
      return await tool.handler(params);
    } catch (error) {
      return ResponseFormatter.error(
        `Failed to execute action "${action}"`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  },
});
