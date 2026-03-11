# Single API Tool Design

Replace 313 individual MCP tools with two: `dokploy-api` and `dokploy-api-schema`.

## Context

The Dokploy MCP server currently registers 313 tools across 33 categories. Every tool is a thin wrapper around a single HTTP call to the Dokploy API using RPC-style endpoints (`/resource.action`). Only GET and POST methods are used. This creates massive tool-list bloat — consuming ~70k tokens on launch (see PR #17) — with no functional benefit, since every tool does the same thing: validate input, call endpoint, format response.

## Architecture

### Tool 1: `dokploy-api`

Executes any Dokploy API operation.

**Parameters:**
- `operation` (required): The API operation path, e.g. `"application.create"`, `"server.one"`
- `params` (optional): Object — forwarded as JSON body (POST) or query string (GET)

**Behavior:**
- HTTP method is auto-detected: a static set of known GET operations is hardcoded (derived from inventory). Everything else defaults to POST.
- POST: `apiClient.post(`/${operation}`, params)`
- GET: `apiClient.get(`/${operation}`, { params })` — uses axios params serialization (differs from old tools which manually built query strings, but functionally equivalent for flat key-value params)
- Response formatted via `ResponseFormatter.success/error`

**Tool description** includes a categorized list of all available operation names (no param details) so the LLM knows what's available without a round-trip. Format is one line per category: `category: op1, op2, op3`. Use `dokploy-api-schema` to discover parameters for any operation.

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

**Example output for `operation: "application.create"`:**
```json
{
  "operation": "application.create",
  "method": "POST",
  "description": "Create a new application",
  "parameters": {
    "name": { "type": "string", "required": true, "description": "The name of the application" },
    "appName": { "type": "string", "required": false },
    "environmentId": { "type": "string", "required": true, "description": "The environment ID" },
    "serverId": { "type": "string", "required": false, "nullable": true }
  }
}
```

**Example output for `category: "application"` (abbreviated):**
```json
{
  "category": "application",
  "operations": [
    { "name": "application.create", "method": "POST", "description": "..." },
    { "name": "application.one", "method": "GET", "description": "..." },
    ...
  ]
}
```

**Annotations:**
- `readOnlyHint: true`
- `idempotentHint: true`

### Operation Name List (for `dokploy-api` tool description)

Grouped by category, derived from actual Dokploy API endpoints:

```
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
volumeBackups: create, delete, list, one, runManually, update
```

Note: The old `database/` tools used polymorphic dispatch (accepting a `dbType` param to route to `postgres.*`, `mysql.*`, `mongo.*`, `mariadb.*`, `redis.*`). With the single-tool design, callers use the actual API endpoint directly (e.g., `mongo.create` instead of `database.create` with `dbType: "mongo"`). Same for git provider tools.

## Files Changed

### Deleted
- `src/mcp/tools/toolFactory.ts`
- All 33 category directories under `src/mcp/tools/` (admin/, ai/, application/, backup/, certificates/, cluster/, compose/, database/, deployment/, destination/, docker/, domain/, environment/, git/, mounts/, mysql/, notification/, organization/, port/, postgres/, previewDeployment/, project/, redirects/, registry/, rollback/, schedule/, security/, server/, settings/, sshKey/, stripe/, swarm/, user/)

### Created
- `src/mcp/tools/api.ts` — the `dokploy-api` tool
- `src/mcp/tools/apiSchema.ts` — the `dokploy-api-schema` tool

### Modified
- `src/mcp/tools/index.ts` — exports only the two new tools
- `src/server.ts` — registers two tools with annotations support (new — old code used 4-arg overload without annotations)

### Unchanged
- `src/utils/apiClient.ts`
- `src/utils/responseFormatter.ts`
- `src/utils/logger.ts`
- `src/utils/clientConfig.ts`
- `src/index.ts`
- `src/http-server.ts`

## Error Handling

Carried forward from `toolFactory.ts` with additions:
- Input validation: operation must be a non-empty string, method must be GET or POST
- 401/Unauthorized -> auth error message (existing)
- 404 -> resource not found (existing)
- 500 -> server error (existing)
- 403 -> permissions error (new — was only logged in apiClient interceptor)
- 422 -> validation error, forward API error details (new — was only logged in apiClient interceptor)
- Network errors -> connectivity message
- All errors formatted via `ResponseFormatter.error()`

## Edge Cases

- **No params**: Both GET and POST work fine with no params (empty body / no query string)
- **OpenAPI spec unavailable**: `dokploy-api-schema` returns an error message if the spec fetch fails, does not break `dokploy-api`
- **Unknown operation**: The Dokploy API will return 404, which gets handled by standard error flow
- **Large spec**: Cached after first fetch, no repeated network calls. For long-running servers, cache persists for the process lifetime (acceptable — spec changes require server restart anyway)
- **Polymorphic endpoints**: Old `database.*` and `git.*` tools that dispatched based on a type parameter are replaced by direct endpoint calls (e.g., `mongo.create`, `github.getGithubBranches`)
