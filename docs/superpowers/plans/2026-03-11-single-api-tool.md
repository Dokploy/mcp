# Single API Tool Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 313 individual MCP tools with two (`dokploy-api` and `dokploy-api-schema`) to reduce launch token usage from ~70k to under 2k.

**Architecture:** A single `dokploy-api` tool forwards any operation to the Dokploy API as a generic HTTP call. A companion `dokploy-api-schema` tool lazily fetches and caches the OpenAPI spec to provide parameter details on demand. All 33 category directories are deleted.

**Tech Stack:** TypeScript, Zod, axios, @modelcontextprotocol/sdk 1.12.0

**Spec:** `docs/superpowers/specs/2026-03-11-single-api-tool-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/mcp/tools/api.ts` | Create | `dokploy-api` tool — generic HTTP dispatch |
| `src/mcp/tools/apiSchema.ts` | Create | `dokploy-api-schema` tool — OpenAPI spec lookup |
| `src/mcp/tools/index.ts` | Rewrite | Export only the two new tools |
| `src/server.ts` | Rewrite | Register tools with annotations support |
| `src/mcp/tools/toolFactory.ts` | Delete | No longer needed |
| `src/mcp/tools/{33 dirs}/*` | Delete | All individual tool files |

Unchanged: `src/utils/apiClient.ts`, `src/utils/responseFormatter.ts`, `src/utils/logger.ts`, `src/utils/clientConfig.ts`, `src/index.ts`, `src/http-server.ts`

---

## Task 1: Create `dokploy-api` tool

**Files:**
- Create: `src/mcp/tools/api.ts`

- [ ] **Step 1: Create `src/mcp/tools/api.ts`**

```typescript
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
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd /home/limehawk/dev/dokploy-mcp && bunx tsc --noEmit src/mcp/tools/api.ts 2>&1 | head -20`

Note: This will fail until index.ts is updated. That's fine — we're just checking for syntax errors in this file. If import errors are the only errors, the file is correct.

- [ ] **Step 3: Commit**

```bash
git add src/mcp/tools/api.ts
git commit -m "feat: add dokploy-api generic tool"
```

---

## Task 2: Create `dokploy-api-schema` tool

**Files:**
- Create: `src/mcp/tools/apiSchema.ts`

- [ ] **Step 1: Create `src/mcp/tools/apiSchema.ts`**

```typescript
import { z } from "zod";
import apiClient from "../../utils/apiClient.js";
import { createLogger } from "../../utils/logger.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";

const logger = createLogger("DokployApiSchema");

let cachedSpec: Record<string, unknown> | null = null;

async function getOpenApiSpec(): Promise<Record<string, unknown>> {
  if (cachedSpec) return cachedSpec;

  logger.info("Fetching OpenAPI spec from Dokploy server");
  const response = await apiClient.get("/settings.getOpenApiDocument");
  cachedSpec = response.data;
  return cachedSpec!;
}

interface OperationInfo {
  name: string;
  method: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

function extractOperations(spec: Record<string, unknown>): OperationInfo[] {
  const paths = (spec as any).paths || {};
  const operations: OperationInfo[] = [];

  for (const [path, methods] of Object.entries(paths)) {
    const operationName = path.replace(/^\//, "");
    const methodsObj = methods as Record<string, any>;

    for (const [method, details] of Object.entries(methodsObj)) {
      if (!["get", "post"].includes(method)) continue;

      const op: OperationInfo = {
        name: operationName,
        method: method.toUpperCase(),
        description: details.summary || details.description,
      };

      // Extract request body schema for POST
      if (method === "post" && details.requestBody) {
        const content = details.requestBody.content;
        const jsonSchema = content?.["application/json"]?.schema;
        if (jsonSchema) {
          op.parameters = resolveSchema(spec, jsonSchema);
        }
      }

      // Extract query parameters for GET
      if (method === "get" && details.parameters) {
        const params: Record<string, unknown> = {};
        for (const param of details.parameters) {
          if (param.in === "query") {
            params[param.name] = {
              type: param.schema?.type || "string",
              required: param.required || false,
              description: param.description,
            };
          }
        }
        if (Object.keys(params).length > 0) {
          op.parameters = params;
        }
      }

      operations.push(op);
    }
  }

  return operations;
}

function resolveSchema(
  spec: Record<string, unknown>,
  schema: Record<string, any>,
  depth = 0
): Record<string, unknown> {
  // Guard against circular references
  if (depth > 10) return { note: "Max resolution depth reached" };

  // Handle $ref
  if (schema.$ref) {
    const refPath = schema.$ref.replace("#/", "").split("/");
    let resolved: any = spec;
    for (const segment of refPath) {
      resolved = resolved?.[segment];
    }
    if (resolved) {
      return resolveSchema(spec, resolved, depth + 1);
    }
    return { $ref: schema.$ref, note: "Could not resolve reference" };
  }

  // Handle allOf (merge all sub-schemas)
  if (schema.allOf) {
    let merged: Record<string, unknown> = {};
    for (const sub of schema.allOf) {
      const resolved = resolveSchema(spec, sub, depth + 1);
      merged = { ...merged, ...resolved };
    }
    return merged;
  }

  // Handle oneOf/anyOf (list variants)
  if (schema.oneOf || schema.anyOf) {
    const variants = schema.oneOf || schema.anyOf;
    return {
      oneOf: variants.map((v: any) => resolveSchema(spec, v, depth + 1)),
    };
  }

  // Handle object with properties
  if (schema.type === "object" && schema.properties) {
    const result: Record<string, unknown> = {};
    const required = new Set(schema.required || []);
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const prop = propSchema as Record<string, any>;
      if (prop.$ref || prop.allOf || prop.oneOf || prop.anyOf) {
        // Recursively resolve nested schemas
        const resolved = resolveSchema(spec, prop, depth + 1);
        result[propName] = {
          ...resolved,
          required: required.has(propName),
        };
      } else {
        result[propName] = {
          type: prop.type || "unknown",
          required: required.has(propName),
          ...(prop.description && { description: prop.description }),
          ...(prop.enum && { enum: prop.enum }),
          ...(prop.nullable && { nullable: true }),
          ...(prop.default !== undefined && { default: prop.default }),
        };
      }
    }
    return result;
  }

  return schema;
}

function getCategory(operationName: string): string {
  const dotIndex = operationName.indexOf(".");
  return dotIndex > 0 ? operationName.substring(0, dotIndex) : operationName;
}

export const schema = {
  category: z
    .string()
    .optional()
    .describe(
      'Filter by category, e.g. "application", "server", "postgres"'
    ),
  operation: z
    .string()
    .optional()
    .describe(
      'Get details for a specific operation, e.g. "application.create"'
    ),
};

export const name = "dokploy-api-schema";

export const description =
  "Get parameter details for Dokploy API operations. Returns operation schemas from the OpenAPI spec. Call with no params for a category summary, with category to list operations, or with operation for full parameter details.";

export const annotations = {
  title: "Dokploy API Schema",
  readOnlyHint: true,
  idempotentHint: true,
};

export async function handler(input: {
  category?: string;
  operation?: string;
}) {
  try {
    const spec = await getOpenApiSpec();
    const operations = extractOperations(spec);

    // Specific operation requested
    if (input.operation) {
      const op = operations.find((o) => o.name === input.operation);
      if (!op) {
        return ResponseFormatter.error(
          "Operation not found",
          `No operation named "${input.operation}". Use without params to see available categories.`
        );
      }
      return ResponseFormatter.success(
        `Schema for ${input.operation}`,
        op
      );
    }

    // Category filter
    if (input.category) {
      const categoryOps = operations.filter(
        (o) => getCategory(o.name) === input.category
      );
      if (categoryOps.length === 0) {
        return ResponseFormatter.error(
          "Category not found",
          `No operations in category "${input.category}". Use without params to see available categories.`
        );
      }
      return ResponseFormatter.success(
        `Operations in ${input.category}`,
        {
          category: input.category,
          operations: categoryOps,
        }
      );
    }

    // No filter — return category summary
    const categories: Record<string, number> = {};
    for (const op of operations) {
      const cat = getCategory(op.name);
      categories[cat] = (categories[cat] || 0) + 1;
    }
    return ResponseFormatter.success("Available categories", {
      totalOperations: operations.length,
      categories,
    });
  } catch (error) {
    logger.error("Failed to fetch API schema", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return ResponseFormatter.error(
      "Failed to fetch API schema",
      `Could not retrieve OpenAPI spec: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/mcp/tools/apiSchema.ts
git commit -m "feat: add dokploy-api-schema tool for operation discovery"
```

---

## Task 3: Rewrite `index.ts` and `server.ts`

**Files:**
- Rewrite: `src/mcp/tools/index.ts`
- Rewrite: `src/server.ts`

- [ ] **Step 1: Rewrite `src/mcp/tools/index.ts`**

```typescript
export * as api from "./api.js";
export * as apiSchema from "./apiSchema.js";
```

- [ ] **Step 2: Rewrite `src/server.ts`**

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as api from "./mcp/tools/api.js";
import * as apiSchema from "./mcp/tools/apiSchema.js";

export function createServer() {
  const server = new McpServer({
    name: "dokploy",
    version: "1.0.0",
  });

  server.tool(
    api.name,
    api.description,
    api.schema,
    api.annotations,
    api.handler
  );

  server.tool(
    apiSchema.name,
    apiSchema.description,
    apiSchema.schema,
    apiSchema.annotations,
    apiSchema.handler
  );

  return server;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/mcp/tools/index.ts src/server.ts
git commit -m "feat: wire up two-tool registration in server"
```

---

## Task 4: Delete old tool files

**Files:**
- Delete: `src/mcp/tools/toolFactory.ts`
- Delete: all 33 category directories under `src/mcp/tools/`

- [ ] **Step 1: Delete `toolFactory.ts`**

```bash
cd /home/limehawk/dev/dokploy-mcp
gio trash src/mcp/tools/toolFactory.ts
```

- [ ] **Step 2: Delete all 33 category directories**

```bash
cd /home/limehawk/dev/dokploy-mcp/src/mcp/tools
gio trash admin ai application backup certificates cluster compose database deployment destination docker domain environment git mounts mysql notification organization port postgres previewDeployment project redirects registry rollback schedule security server settings sshKey stripe swarm user
```

- [ ] **Step 3: Commit**

```bash
git add -A src/mcp/tools/
git commit -m "chore: remove 313 individual tool files

Replaced by dokploy-api and dokploy-api-schema tools."
```

---

## Task 5: Build and verify

- [ ] **Step 1: Type-check**

Run: `cd /home/limehawk/dev/dokploy-mcp && bun run type-check`
Expected: 0 errors

- [ ] **Step 2: Build**

Run: `cd /home/limehawk/dev/dokploy-mcp && bun run build`
Expected: Clean build, `build/` directory populated

- [ ] **Step 3: Verify tool registration by starting stdio mode briefly**

Run: `cd /home/limehawk/dev/dokploy-mcp && echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | timeout 5 node build/index.js 2>/dev/null || true`
Expected: JSON response showing exactly 2 tools: `dokploy-api` and `dokploy-api-schema`

- [ ] **Step 4: Commit build (if build output is tracked)**

Check if `build/` is in `.gitignore`. If not tracked, skip this step.

---

## Task 6: Update documentation

**Files:**
- Modify: `TOOLS.md` (if it exists and documents individual tools)

- [ ] **Step 1: Replace TOOLS.md content**

Replace the entire file with documentation for the two new tools: usage examples, parameter descriptions, and the operation list. Keep it concise — the tool descriptions themselves are comprehensive.

- [ ] **Step 2: Commit**

```bash
git add TOOLS.md
git commit -m "docs: update TOOLS.md for single api tool architecture"
```
