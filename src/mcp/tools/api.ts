import { z } from "zod";
import { AxiosError } from "axios";
import apiClient from "../../utils/apiClient.js";
import { createLogger } from "../../utils/logger.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";

const logger = createLogger("DokployApi");

const OPERATIONS_LIST = `Available operations (use dokploy-api-schema for parameter details):
admin: setupMonitoring
ai: create, delete, deploy, get, getAll, getModels, one, suggest, update
application: cancelDeployment, cleanQueues, create, delete, deploy, disconnectGitProvider, markRunning, move, one, readAppMonitoring, readTraefikConfig, redeploy, refreshToken, reload, saveBitbucketProvider, saveBuildType, saveDockerProvider, saveEnvironment, saveGitProvider, saveGiteaProvider, saveGithubProvider, saveGitlabProvider, start, stop, update, updateTraefikConfig
backup: create, listBackupFiles, one, remove, update
bitbucket: getBitbucketBranches, getBitbucketRepositories
certificates: all, create, one, remove
cluster: addManager, addWorker, getNodes, removeWorker
compose: cancelDeployment, cleanQueues, create, delete, deploy, deployTemplate, disconnectGitProvider, fetchSourceType, getConvertedCompose, getDefaultCommand, getTags, import, isolatedDeployment, killBuild, loadMountsByService, loadServices, move, one, processTemplate, randomizeCompose, redeploy, refreshToken, start, stop, templates, update
deployment: all, allByCompose, allByServer, allByType, killProcess
destination: all, create, one, remove, testConnection, update
docker: getConfig, getContainers, getContainersByAppLabel, getContainersByAppNameMatch, getServiceContainersByAppName, getStackContainersByAppName, restartContainer
domain: byApplicationId, byComposeId, canGenerateTraefikMeDomains, create, delete, generateDomain, one, update, validateDomain
environment: byProjectId, create, duplicate, one, remove, update
gitea: getGiteaBranches, getGiteaRepositories, getGiteaUrl
github: getGithubBranches, getGithubRepositories, githubProviders
gitlab: getGitlabBranches, getGitlabRepositories
gitProvider: create, getAll, one, remove, testConnection, update
mariadb: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
mongo: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
mounts: create, one, remove, update
mysql: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
notification: all, create, getEmailProviders, one, receiveNotification, remove, test, update
organization: all, allInvitations, create, delete, one, removeInvitation, setDefault, update
port: create, delete, one, update
postgres: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
previewDeployment: all, delete, one
project: all, create, duplicate, one, remove, update
redirects: create, delete, one, update
redis: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
registry: all, create, one, remove, testRegistry, update
rollback: delete, rollback
schedule: create, delete, list, one, runManually, update
security: create, delete, one, update
server: all, buildServers, count, create, getDefaultCommand, getServerMetrics, getServerTime, one, publicIp, remove, security, setup, setupMonitoring, update, validate, withSSHKey
settings: assignDomainServer, checkGPUStatus, cleanAll, cleanDockerBuilder, cleanDockerPrune, cleanMonitoring, cleanRedis, cleanSSHPrivateKey, cleanStoppedContainers, cleanUnusedImages, cleanUnusedVolumes, getDokployCloudIps, getDokployVersion, getIp, getLogCleanupStatus, getOpenApiDocument, getReleaseTag, getTraefikPorts, getUpdateData, haveActivateRequests, haveTraefikDashboardPortEnabled, health, isCloud, isUserSubscribed, readDirectories, readMiddlewareTraefikConfig, readTraefikConfig, readTraefikEnv, readTraefikFile, readWebServerTraefikConfig, reloadRedis, reloadServer, reloadTraefik, saveSSHPrivateKey, setupGPU, toggleDashboard, toggleRequests, updateDockerCleanup, updateLogCleanup, updateMiddlewareTraefikConfig, updateServer, updateTraefikConfig, updateTraefikFile, updateTraefikPorts, updateWebServerTraefikConfig, writeTraefikEnv
sshKey: all, create, generate, one, remove, update
stripe: canCreateMoreServers, createCheckoutSession, createCustomerPortalSession, getProducts
swarm: getNodeApps, getNodeInfo, getNodes
user: all, assignPermissions, checkUserOrganizations, createApiKey, deleteApiKey, generateToken, get, getBackups, getUserByToken, getContainerMetrics, getInvitations, getMetricsToken, getServerMetrics, haveRootAccess, one, remove, sendInvitation, update
volumeBackups: create, delete, list, one, runManually, update`;

// Operations that use GET. Everything else uses POST.
const GET_OPERATIONS = new Set([
  "ai.get",
  "ai.getAll",
  "ai.getModels",
  "ai.one",
  "application.one",
  "application.readAppMonitoring",
  "application.readTraefikConfig",
  "backup.listBackupFiles",
  "backup.one",
  "bitbucket.getBitbucketBranches",
  "bitbucket.getBitbucketRepositories",
  "certificates.all",
  "certificates.one",
  "cluster.addManager",
  "cluster.addWorker",
  "cluster.getNodes",
  "compose.getConvertedCompose",
  "compose.getDefaultCommand",
  "compose.getTags",
  "compose.loadMountsByService",
  "compose.loadServices",
  "compose.one",
  "compose.templates",
  "deployment.all",
  "deployment.allByCompose",
  "deployment.allByServer",
  "deployment.allByType",
  "destination.all",
  "destination.one",
  "docker.getConfig",
  "docker.getContainers",
  "docker.getContainersByAppLabel",
  "docker.getContainersByAppNameMatch",
  "docker.getServiceContainersByAppName",
  "docker.getStackContainersByAppName",
  "domain.byApplicationId",
  "domain.byComposeId",
  "domain.canGenerateTraefikMeDomains",
  "domain.one",
  "environment.byProjectId",
  "environment.one",
  "gitea.getGiteaBranches",
  "gitea.getGiteaRepositories",
  "gitea.getGiteaUrl",
  "github.getGithubBranches",
  "github.getGithubRepositories",
  "github.githubProviders",
  "gitlab.getGitlabBranches",
  "gitlab.getGitlabRepositories",
  "gitProvider.getAll",
  "gitProvider.one",
  "mariadb.one",
  "mongo.one",
  "mounts.one",
  "mysql.one",
  "notification.all",
  "notification.getEmailProviders",
  "notification.one",
  "organization.all",
  "organization.allInvitations",
  "organization.one",
  "port.one",
  "postgres.one",
  "previewDeployment.all",
  "previewDeployment.one",
  "project.all",
  "project.one",
  "redirects.one",
  "redis.one",
  "registry.all",
  "registry.one",
  "schedule.list",
  "schedule.one",
  "security.one",
  "server.all",
  "server.buildServers",
  "server.count",
  "server.getDefaultCommand",
  "server.getServerMetrics",
  "server.getServerTime",
  "server.one",
  "server.publicIp",
  "server.security",
  "server.validate",
  "server.withSSHKey",
  "settings.checkGPUStatus",
  "settings.getDokployCloudIps",
  "settings.getDokployVersion",
  "settings.getIp",
  "settings.getLogCleanupStatus",
  "settings.getOpenApiDocument",
  "settings.getReleaseTag",
  "settings.getTraefikPorts",
  "settings.haveActivateRequests",
  "settings.haveTraefikDashboardPortEnabled",
  "settings.health",
  "settings.isCloud",
  "settings.isUserSubscribed",
  "settings.readDirectories",
  "settings.readMiddlewareTraefikConfig",
  "settings.readTraefikConfig",
  "settings.readTraefikEnv",
  "settings.readTraefikFile",
  "settings.readWebServerTraefikConfig",
  "sshKey.all",
  "sshKey.one",
  "stripe.canCreateMoreServers",
  "stripe.getProducts",
  "swarm.getNodeApps",
  "swarm.getNodeInfo",
  "swarm.getNodes",
  "user.all",
  "user.checkUserOrganizations",
  "user.get",
  "user.getBackups",
  "user.getUserByToken",
  "user.getContainerMetrics",
  "user.getInvitations",
  "user.getMetricsToken",
  "user.getServerMetrics",
  "user.haveRootAccess",
  "user.one",
  "volumeBackups.list",
  "volumeBackups.one",
]);

function getMethod(operation: string): "GET" | "POST" {
  return GET_OPERATIONS.has(operation) ? "GET" : "POST";
}

export const schema = {
  operation: z
    .string()
    .min(1)
    .describe(
      'The API operation path, e.g. "application.create", "server.one", "postgres.deploy"'
    ),
  params: z
    .record(z.any())
    .optional()
    .describe(
      "Parameters object. Sent as JSON body for mutations, query string for reads."
    ),
};

export const name = "dokploy-api";

export const description = `Execute any Dokploy API operation. HTTP method is auto-detected. Use dokploy-api-schema to discover parameters for an operation.

${OPERATIONS_LIST}`;

export const annotations = {
  title: "Dokploy API",
  readOnlyHint: false,
  openWorldHint: true,
};

export async function handler(input: {
  operation: string;
  params?: Record<string, unknown>;
}) {
  const { operation, params } = input;
  const method = getMethod(operation);
  const endpoint = `/${operation}`;

  logger.info(`Executing ${method} ${endpoint}`, { hasParams: !!params });

  try {
    const response =
      method === "POST"
        ? await apiClient.post(endpoint, params ?? {})
        : await apiClient.get(endpoint, { params });

    return ResponseFormatter.success(
      `${method} ${operation} succeeded`,
      response.data
    );
  } catch (error) {
    logger.error(`${method} ${endpoint} failed`, {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const data = error.response.data as Record<string, unknown> | undefined;
      const detail =
        (data?.message as string) || (data?.error as string) || error.message;

      if (status === 401) {
        return ResponseFormatter.error(
          "Authentication failed",
          "Please check your DOKPLOY_API_KEY configuration"
        );
      }
      if (status === 403) {
        return ResponseFormatter.error(
          "Access denied",
          `Insufficient permissions for ${operation}`
        );
      }
      if (status === 404) {
        return ResponseFormatter.error(
          "Resource not found",
          `Operation ${operation} not found or resource does not exist`
        );
      }
      if (status === 422) {
        return ResponseFormatter.error(
          `Validation error for ${operation}`,
          detail
        );
      }
      if (status >= 500) {
        return ResponseFormatter.error(
          "Server error",
          `Dokploy server error while processing ${operation}`
        );
      }
    }

    return ResponseFormatter.error(
      `Failed: ${operation}`,
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
