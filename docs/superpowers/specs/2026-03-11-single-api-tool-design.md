# Single API Tool Design

Replace 312 individual MCP tools with two: `dokploy-api` and `dokploy-api-schema`.

## Context

The Dokploy MCP server currently registers 312 tools across 33 categories. Every tool is a thin wrapper around a single HTTP call to the Dokploy API using RPC-style endpoints (`/resource.action`). Only GET and POST methods are used. This creates massive tool-list bloat for consuming LLMs with no functional benefit — every tool does the same thing: validate input, call endpoint, format response.

## Architecture

### Tool 1: `dokploy-api`

Executes any Dokploy API operation.

**Parameters:**
- `method` (required): `"GET"` or `"POST"`
- `operation` (required): The API operation path, e.g. `"application.create"`, `"server.one"`
- `params` (optional): Object — forwarded as JSON body (POST) or query string (GET)

**Behavior:**
- POST: `apiClient.post(/${operation}, params)`
- GET: `apiClient.get(/${operation}, { params })`
- Error handling preserved from current `toolFactory.ts` (401/403/404/422/500 mapping)
- Response formatted via `ResponseFormatter.success/error`

**Tool description** includes a categorized list of all available operation names (no param details) so the LLM knows what's available without a round-trip.

**Annotations:**
- `readOnlyHint: false` (tool can mutate)
- `openWorldHint: true` (connects to external API)

### Tool 2: `dokploy-api-schema`

Returns parameter details for API operations, sourced from the Dokploy OpenAPI spec.

**Parameters:**
- `category` (optional): Filter by category, e.g. `"application"`, `"server"`
- `operation` (optional): Get details for a specific operation, e.g. `"application.create"`
- If neither provided, returns a summary of all categories with operation counts

**Behavior:**
- On first call, fetches OpenAPI spec from `GET /settings.getOpenApiDocument` and caches in module-level variable
- Parses the spec to extract operation details: parameters, types, required fields, descriptions
- Maps OpenAPI paths to operation names (strip leading `/`, e.g. `/application.create` -> `application.create`)
- Returns filtered results based on input

**Annotations:**
- `readOnlyHint: true`
- `idempotentHint: true`

### Operation Name List (for `dokploy-api` tool description)

Grouped by category, derived from current tool inventory:

```
admin: setupMonitoring
ai: create, delete, deploy, get, getAll, getModels, one, suggest, update
application: cancelDeployment, cleanQueues, create, delete, deploy, disconnectGitProvider, markRunning, move, one, readAppMonitoring, readTraefikConfig, redeploy, refreshToken, reload, saveBitbucketProvider, saveBuildType, saveDockerProvider, saveEnvironment, saveGitProvider, saveGiteaProvider, saveGithubProvider, saveGitlabProvider, start, stop, update, updateTraefikConfig
backup: create, listBackupFiles, one, remove, update
certificates: all, create, one, remove
cluster: addManager, addWorker, getNodes, removeWorker
compose: cancelDeployment, cleanQueues, create, delete, deploy, deployTemplate, disconnectGitProvider, fetchSourceType, getConvertedCompose, getDefaultCommand, getTags, import, isolatedDeployment, killBuild, loadMountsByService, loadServices, move, one, processTemplate, randomizeCompose, redeploy, refreshToken, start, stop, templates, update
deployment: all, allByCompose, allByServer, allByType, killProcess
destination: all, create, one, remove, testConnection, update
docker: getConfig, getContainers, getContainersByAppLabel, getContainersByAppNameMatch, getServiceContainersByAppName, getStackContainersByAppName, restartContainer
domain: byApplicationId, byComposeId, canGenerateTraefikMeDomains, create, delete, generateDomain, one, update, validateDomain
environment: byProjectId, create, duplicate, one, remove, update
gitProvider: getAll, remove
github: githubProviders, getGithubBranches, getGithubRepositories
gitlab: getGitlabBranches, getGitlabRepositories
gitea: getGiteaBranches, getGiteaRepositories, getGiteaUrl
bitbucket: getBitbucketBranches, getBitbucketRepositories
mounts: create, one, remove, update
mysql: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
notification: all, create, getEmailProviders, one, receiveNotification, remove, test, update
organization: all, allInvitations, create, delete, one, removeInvitation, setDefault, update
port: create, delete, one, update
postgres: changeStatus, create, deploy, move, one, rebuild, reload, remove, saveEnvironment, saveExternalPort, start, stop, update
previewDeployment: all, delete, one
project: all, create, duplicate, one, remove, update
redirects: create, delete, one, update
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
volumeBackups: create, delete, list, one, runManually, update
```

## Files Changed

### Deleted
- `src/mcp/tools/toolFactory.ts`
- All 33 category directories under `src/mcp/tools/` (admin/, ai/, application/, backup/, certificates/, cluster/, compose/, database/, deployment/, destination/, docker/, domain/, environment/, git/, mounts/, mysql/, notification/, organization/, port/, postgres/, previewDeployment/, project/, redirects/, registry/, rollback/, schedule/, security/, server/, settings/, sshKey/, stripe/, swarm/, user/)

### Created
- `src/mcp/tools/api.ts` — the `dokploy-api` tool
- `src/mcp/tools/apiSchema.ts` — the `dokploy-api-schema` tool

### Modified
- `src/mcp/tools/index.ts` — exports only the two new tools
- `src/server.ts` — registers two tools with proper annotations support

### Unchanged
- `src/utils/apiClient.ts`
- `src/utils/responseFormatter.ts`
- `src/utils/logger.ts`
- `src/utils/clientConfig.ts`
- `src/index.ts`
- `src/http-server.ts`

## Error Handling

Preserved from `toolFactory.ts`:
- Input validation: operation must be a non-empty string, method must be GET or POST
- 401/Unauthorized -> auth error message
- 403 -> permissions error
- 404 -> resource not found
- 422 -> validation error (forward API error details)
- 500 -> server error
- Network errors -> connectivity message
- All errors formatted via `ResponseFormatter.error()`

## Edge Cases

- **No params**: Both GET and POST work fine with no params (empty body / no query string)
- **OpenAPI spec unavailable**: `dokploy-api-schema` returns an error message if the spec fetch fails, does not break `dokploy-api`
- **Unknown operation**: The Dokploy API will return 404, which gets handled by standard error flow
- **Large spec**: Cached after first fetch, no repeated network calls
