# Dokploy MCP Server - Tools Documentation

## Overview

The Dokploy MCP server exposes **2 tools** that provide full coverage of the Dokploy API:

| Tool | Purpose |
|------|---------|
| `dokploy-api` | Execute any Dokploy API operation |
| `dokploy-api-schema` | Discover available operations and their parameters |

## `dokploy-api`

Executes any Dokploy API operation. HTTP method (GET/POST) is auto-detected.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `operation` | string | Yes | API operation path, e.g. `"application.create"`, `"server.one"` |
| `params` | object | No | Parameters sent as JSON body (POST) or query string (GET) |

### Examples

```json
// Create an application
{ "operation": "application.create", "params": { "name": "my-app", "environmentId": "env-123" } }

// Get a project
{ "operation": "project.one", "params": { "projectId": "proj-456" } }

// List all servers
{ "operation": "server.all" }

// Deploy a compose service
{ "operation": "compose.deploy", "params": { "composeId": "comp-789" } }

// Check server health
{ "operation": "settings.health" }
```

### Available Operations

Operations are grouped by category. Use `dokploy-api-schema` to get parameter details.

- **admin**: setupMonitoring
- **ai**: create, delete, deploy, get, getAll, getModels, one, suggest, update
- **application**: cancelDeployment, cleanQueues, create, delete, deploy, disconnectGitProvider, markRunning, move, one, readAppMonitoring, readTraefikConfig, redeploy, refreshToken, reload, saveBitbucketProvider, saveBuildType, saveDockerProvider, saveEnvironment, saveGitProvider, saveGiteaProvider, saveGithubProvider, saveGitlabProvider, start, stop, update, updateTraefikConfig
- **backup**: create, listBackupFiles, one, remove, update
- **bitbucket**: getBitbucketBranches, getBitbucketRepositories
- **certificates**: all, create, one, remove
- **cluster**: addManager, addWorker, getNodes, removeWorker
- **compose**: cancelDeployment, cleanQueues, create, delete, deploy, deployTemplate, disconnectGitProvider, fetchSourceType, getConvertedCompose, getDefaultCommand, getTags, import, isolatedDeployment, killBuild, loadMountsByService, loadServices, move, one, processTemplate, randomizeCompose, redeploy, refreshToken, start, stop, templates, update
- **deployment**: all, allByCompose, allByServer, allByType, killProcess
- **destination**: all, create, one, remove, testConnection, update
- **docker**: getConfig, getContainers, getContainersByAppLabel, getContainersByAppNameMatch, getServiceContainersByAppName, getStackContainersByAppName, restartContainer
- **domain**: byApplicationId, byComposeId, canGenerateTraefikMeDomains, create, delete, generateDomain, one, update, validateDomain
- **environment**: byProjectId, create, duplicate, one, remove, update
- **gitea**: getGiteaBranches, getGiteaRepositories, getGiteaUrl
- **github**: getGithubBranches, getGithubRepositories, githubProviders
- **gitlab**: getGitlabBranches, getGitlabRepositories
- **gitProvider**: create, getAll, one, remove, testConnection, update
- **mariadb**: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
- **mongo**: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
- **mounts**: create, one, remove, update
- **mysql**: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
- **notification**: all, create, getEmailProviders, one, receiveNotification, remove, test, update
- **organization**: all, allInvitations, create, delete, one, removeInvitation, setDefault, update
- **port**: create, delete, one, update
- **postgres**: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
- **previewDeployment**: all, delete, one
- **project**: all, create, duplicate, one, remove, update
- **redirects**: create, delete, one, update
- **redis**: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
- **registry**: all, create, one, remove, testRegistry, update
- **rollback**: delete, rollback
- **schedule**: create, delete, list, one, runManually, update
- **security**: create, delete, one, update
- **server**: all, buildServers, count, create, getDefaultCommand, getServerMetrics, getServerTime, one, publicIp, remove, security, setup, setupMonitoring, update, validate, withSSHKey
- **settings**: assignDomainServer, checkGPUStatus, cleanAll, cleanDockerBuilder, cleanDockerPrune, cleanMonitoring, cleanRedis, cleanSSHPrivateKey, cleanStoppedContainers, cleanUnusedImages, cleanUnusedVolumes, getDokployCloudIps, getDokployVersion, getIp, getLogCleanupStatus, getOpenApiDocument, getReleaseTag, getTraefikPorts, getUpdateData, haveActivateRequests, haveTraefikDashboardPortEnabled, health, isCloud, isUserSubscribed, readDirectories, readMiddlewareTraefikConfig, readTraefikConfig, readTraefikEnv, readTraefikFile, readWebServerTraefikConfig, reloadRedis, reloadServer, reloadTraefik, saveSSHPrivateKey, setupGPU, toggleDashboard, toggleRequests, updateDockerCleanup, updateLogCleanup, updateMiddlewareTraefikConfig, updateServer, updateTraefikConfig, updateTraefikFile, updateTraefikPorts, updateWebServerTraefikConfig, writeTraefikEnv
- **sshKey**: all, create, generate, one, remove, update
- **stripe**: canCreateMoreServers, createCheckoutSession, createCustomerPortalSession, getProducts
- **swarm**: getNodeApps, getNodeInfo, getNodes
- **user**: all, assignPermissions, checkUserOrganizations, createApiKey, deleteApiKey, generateToken, get, getBackups, getUserByToken, getContainerMetrics, getInvitations, getMetricsToken, getServerMetrics, haveRootAccess, one, remove, sendInvitation, update
- **volumeBackups**: create, delete, list, one, runManually, update

## `dokploy-api-schema`

Discovers operation parameters from the Dokploy OpenAPI spec. Fetches the spec on first call and caches it.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category` | string | No | Filter by category, e.g. `"application"`, `"server"` |
| `operation` | string | No | Get details for a specific operation, e.g. `"application.create"` |

If neither parameter is provided, returns a summary of all categories with operation counts.

### Examples

```json
// Get all categories
{}

// List operations in the application category
{ "category": "application" }

// Get parameter details for a specific operation
{ "operation": "application.create" }
```
