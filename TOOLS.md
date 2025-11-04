# Dokploy MCP Server - Tools Documentation

This document provides detailed information about all available tools in the Dokploy MCP Server.

## 📊 Overview

- **Total Tools**: 4 (consolidated from 67 individual tools)
- **dokploy_application**: Application and domain management (35 actions)
- **dokploy_project**: Project management (6 actions)
- **dokploy_postgres**: PostgreSQL database management (13 actions)
- **dokploy_mysql**: MySQL database management (13 actions)

All tools use a consolidated architecture with a mandatory **`action`** parameter to specify the operation, and an optional **`params`** object containing action-specific parameters.

## 🏗️ Architecture

Each consolidated tool follows this pattern:

```json
{
  "action": "string",
  "params": {
    // Action-specific parameters
  }
}
```

The tool validates the action and routes to the appropriate underlying API endpoint with full parameter support.

---

## 🗂️ dokploy_project

Consolidated tool for managing Dokploy projects.

### Supported Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `list` | Lists all projects | None |
| `create` | Creates a new project | `name`, `description?`, `env?` |
| `get` | Gets a specific project | `projectId` |
| `update` | Updates an existing project | `projectId`, `name?`, `description?`, `env?` |
| `remove` | Removes/deletes a project | `projectId` |
| `duplicate` | Duplicates an existing project | `sourceProjectId`, `name`, `includeServices?`, `selectedServices?` |

### Example Usage

#### List all projects
```json
{
  "action": "list",
  "params": {}
}
```

#### Create a project
```json
{
  "action": "create",
  "params": {
    "name": "My New Project",
    "description": "Project description",
    "env": "VARIABLE=value"
  }
}
```

#### Get a specific project
```json
{
  "action": "get",
  "params": {
    "projectId": "project-123"
  }
}
```

---

## 🚀 dokploy_application

Consolidated tool for managing Dokploy applications and domains. This is the primary tool for application lifecycle management.

### Application Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `create` | Creates a new application | `name`, `appName?`, `environmentId`, `description?`, `serverId?` |
| `delete` | Deletes an application | `applicationId` |
| `deploy` | Deploys an application | `applicationId`, `title?`, `description?` |
| `start` | Starts an application | `applicationId` |
| `stop` | Stops an application | `applicationId` |
| `update` | Updates application configuration | `applicationId`, [extensive configuration options] |
| `get` | Gets application details | `applicationId` |
| `redeploy` | Redeploys an application | `applicationId`, `title?`, `description?` |
| `reload` | Reloads an application | `applicationId` |
| `move` | Moves application to another environment | `applicationId`, `environmentId` |
| `cancelDeployment` | Cancels ongoing deployment | `applicationId` |
| `cleanQueues` | Cleans deployment queues | `applicationId` |
| `disconnectGitProvider` | Disconnects git provider | `applicationId` |
| `markRunning` | Marks application as running | `applicationId` |
| `readAppMonitoring` | Reads monitoring data | `applicationId` |
| `readTraefikConfig` | Reads Traefik configuration | `applicationId` |
| `refreshToken` | Refreshes access token | `applicationId` |

### Git Provider Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `saveBitbucketProvider` | Configure Bitbucket provider | `applicationId`, `bitbucketId`, `repository`, `owner`, `branch`, `buildPath` |
| `saveGithubProvider` | Configure GitHub provider | `applicationId`, `githubId`, `repository`, `owner`, `branch`, `buildPath` |
| `saveGitlabProvider` | Configure GitLab provider | `applicationId`, `gitlabId`, `repository`, `owner`, `branch`, `buildPath` |
| `saveGiteaProvider` | Configure Gitea provider | `applicationId`, `giteaId`, `repository`, `owner`, `branch`, `buildPath` |
| `saveGitProvider` | Configure generic Git provider | `applicationId`, `customGitUrl`, `customGitBranch?`, `customGitBuildPath?` |

### Configuration Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `saveBuildType` | Saves build configuration | `applicationId`, `buildType`, `dockerfile?`, `dockerImage?` |
| `saveDockerProvider` | Saves Docker provider settings | `applicationId`, `dockerImage`, `registryId?`, `username?`, `password?` |
| `saveEnvironment` | Saves environment variables | `applicationId`, `env?`, `buildArgs?` |
| `updateTraefikConfig` | Updates Traefik configuration | `applicationId`, [Traefik config options] |

### Domain Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `domainCreate` | Creates a new domain | `applicationId?`, `composeId?`, `host`, `path?`, `port?`, `https?` |
| `domainDelete` | Deletes a domain | `domainId` |
| `domainUpdate` | Updates domain configuration | `domainId`, `host?`, `path?`, `port?`, `https?` |
| `domainGet` | Gets domain details | `domainId` |
| `domainByApplicationId` | Lists domains for application | `applicationId` |
| `domainByComposeId` | Lists domains for compose | `composeId` |
| `domainGenerateDomain` | Generates a domain | `applicationId?`, `composeId?` |
| `domainCanGenerateTraefikMeDomains` | Checks if Traefik.me domains can be generated | None |
| `domainValidate` | Validates a domain | `domainId` |

### Example Usage

#### Create an application
```json
{
  "action": "create",
  "params": {
    "name": "My App",
    "appName": "my-app",
    "environmentId": "env-123",
    "description": "My application"
  }
}
```

#### Deploy an application
```json
{
  "action": "deploy",
  "params": {
    "applicationId": "app-123",
    "title": "Production deployment",
    "description": "Deploying v1.0.0"
  }
}
```

#### Create a domain for an application
```json
{
  "action": "domainCreate",
  "params": {
    "applicationId": "app-123",
    "host": "example.com",
    "port": 3000,
    "https": true
  }
}
```

#### Save environment variables
```json
{
  "action": "saveEnvironment",
  "params": {
    "applicationId": "app-123",
    "env": "NODE_ENV=production\nAPI_KEY=secret"
  }
}
```

---

## 🗄️ dokploy_postgres

Consolidated tool for managing PostgreSQL databases in Dokploy.

### Supported Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `create` | Creates a new PostgreSQL database | `name`, `appName`, `databaseName`, `databaseUser`, `databasePassword`, `environmentId`, `dockerImage?`, `serverId?` |
| `remove` | Removes a PostgreSQL database | `postgresId` |
| `deploy` | Deploys a PostgreSQL database | `postgresId` |
| `start` | Starts a PostgreSQL database | `postgresId` |
| `stop` | Stops a PostgreSQL database | `postgresId` |
| `update` | Updates PostgreSQL configuration | `postgresId`, [configuration options] |
| `get` | Gets PostgreSQL database details | `postgresId` |
| `rebuild` | Rebuilds a PostgreSQL database | `postgresId` |
| `reload` | Reloads a PostgreSQL database | `postgresId` |
| `move` | Moves PostgreSQL to another environment | `postgresId`, `environmentId` |
| `changeStatus` | Changes database status | `postgresId`, `applicationStatus` |
| `saveEnvironment` | Saves environment variables | `postgresId`, `env?` |
| `saveExternalPort` | Saves external port configuration | `postgresId`, `externalPort` |

### Example Usage

#### Create a PostgreSQL database
```json
{
  "action": "create",
  "params": {
    "name": "Production DB",
    "appName": "prod-db",
    "databaseName": "myapp",
    "databaseUser": "dbuser",
    "databasePassword": "securepassword",
    "environmentId": "env-123",
    "dockerImage": "postgres:15"
  }
}
```

#### Start a PostgreSQL database
```json
{
  "action": "start",
  "params": {
    "postgresId": "pg-123"
  }
}
```

#### Save external port
```json
{
  "action": "saveExternalPort",
  "params": {
    "postgresId": "pg-123",
    "externalPort": 5432
  }
}
```

---

## 🗄️ dokploy_mysql

Consolidated tool for managing MySQL databases in Dokploy.

### Supported Actions

| Action | Description | Key Parameters |
|--------|-------------|----------------|
| `create` | Creates a new MySQL database | `name`, `appName`, `databaseName`, `databaseUser`, `databasePassword`, `databaseRootPassword`, `environmentId`, `dockerImage?`, `serverId?` |
| `remove` | Removes a MySQL database | `mysqlId` |
| `deploy` | Deploys a MySQL database | `mysqlId` |
| `start` | Starts a MySQL database | `mysqlId` |
| `stop` | Stops a MySQL database | `mysqlId` |
| `update` | Updates MySQL configuration | `mysqlId`, [configuration options] |
| `get` | Gets MySQL database details | `mysqlId` |
| `rebuild` | Rebuilds a MySQL database | `mysqlId` |
| `reload` | Reloads a MySQL database | `mysqlId` |
| `move` | Moves MySQL to another environment | `mysqlId`, `environmentId` |
| `changeStatus` | Changes database status | `mysqlId`, `applicationStatus` |
| `saveEnvironment` | Saves environment variables | `mysqlId`, `env?` |
| `saveExternalPort` | Saves external port configuration | `mysqlId`, `externalPort` |

### Example Usage

#### Create a MySQL database
```json
{
  "action": "create",
  "params": {
    "name": "Production MySQL",
    "appName": "prod-mysql",
    "databaseName": "myapp",
    "databaseUser": "dbuser",
    "databasePassword": "securepassword",
    "databaseRootPassword": "rootpassword",
    "environmentId": "env-123",
    "dockerImage": "mysql:8"
  }
}
```

#### Deploy a MySQL database
```json
{
  "action": "deploy",
  "params": {
    "mysqlId": "mysql-123"
  }
}
```

---

## 🔐 Security Considerations

- All database passwords should follow strong password policies
- Environment variables may contain sensitive data - handle with care
- Use HTTPS for domains when possible
- Store API keys and credentials securely

## 📝 Notes

- The `params` object is optional for some actions (like `list`) but required for most operations
- All ID fields (applicationId, postgresId, mysqlId, projectId, etc.) are required when specified
- Optional parameters are marked with `?` in the parameter tables
- For detailed parameter schemas, refer to the individual tool implementations in the codebase

## 🔄 Migration from Individual Tools

If you were using the previous individual tools (e.g., `application-deploy`, `postgres-create`), you can migrate by:

1. Changing the tool name to the consolidated version (e.g., `dokploy_application`, `dokploy_postgres`)
2. Moving the tool name's action suffix to the `action` parameter (e.g., `deploy`)
3. Moving all other parameters into the `params` object

**Before:**
```json
{
  "tool": "application-deploy",
  "applicationId": "app-123",
  "title": "Deploy v1.0"
}
```

**After:**
```json
{
  "tool": "dokploy_application",
  "action": "deploy",
  "params": {
    "applicationId": "app-123",
    "title": "Deploy v1.0"
  }
}
```
