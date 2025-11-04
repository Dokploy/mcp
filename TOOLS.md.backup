# Dokploy MCP Server - Tools Documentation

This document provides detailed information about all available tools in the Dokploy MCP Server.

## 📊 Overview

- **Total Tools**: 67
- **Project Tools**: 6
- **Application Tools**: 26
- **Domain Tools**: 9
- **PostgreSQL Tools**: 13
- **MySQL Tools**: 13

All tools include semantic annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`) to help MCP clients understand their behavior.

## 🗂️ Project Management Tools

### `project-all`

- **Description**: Lists all projects in Dokploy
- **Input Schema**: None
- **Annotations**: Read-only, Idempotent
- **Example**: `{}`

### `project-one`

- **Description**: Gets a specific project by its ID in Dokploy
- **Input Schema**:
  ```json
  {
    "projectId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `projectId`

### `project-create`

- **Description**: Creates a new project in Dokploy
- **Input Schema**:
  ```json
  {
    "name": "string",
    "description": "string|null",
    "env": "string"
  }
  ```
- **Annotations**: Non-destructive, Non-idempotent
- **Required Fields**: `name`
- **Optional Fields**: `description`, `env`

### `project-update`

- **Description**: Updates an existing project in Dokploy
- **Input Schema**:
  ```json
  {
    "projectId": "string",
    "name": "string",
    "description": "string|null",
    "createdAt": "string",
    "organizationId": "string",
    "env": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `projectId`
- **Optional Fields**: `name`, `description`, `createdAt`, `organizationId`, `env`

### `project-duplicate`

- **Description**: Duplicates an existing project in Dokploy with optional service selection
- **Input Schema**:
  ```json
  {
    "sourceProjectId": "string",
    "name": "string",
    "description": "string",
    "includeServices": "boolean",
    "selectedServices": [
      {
        "id": "string",
        "type": "application|postgres|mariadb|mongo|mysql|redis|compose"
      }
    ]
  }
  ```
- **Annotations**: Creation tool (non-destructive)
- **Required Fields**: `sourceProjectId`, `name`
- **Optional Fields**: `description`, `includeServices`, `selectedServices`

### `project-remove`

- **Description**: Removes/deletes an existing project in Dokploy
- **Input Schema**:
  ```json
  {
    "projectId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `projectId`

## 🚀 Application Management Tools

### Core Application Operations

#### `application-one`

- **Description**: Gets a specific application by its ID in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `applicationId`

#### `application-create`

- **Description**: Creates a new application in Dokploy
- **Input Schema**:
  ```json
  {
    "name": "string",
    "appName": "string",
    "description": "string|null",
    "projectId": "string",
    "serverId": "string|null"
  }
  ```
- **Annotations**: Non-destructive, Non-idempotent
- **Required Fields**: `name`, `projectId`
- **Optional Fields**: `appName`, `description`, `serverId`

#### `application-update`

- **Description**: Updates an existing application in Dokploy
- **Input Schema**: Complex schema with 60+ fields including deployment settings, resource limits, networking, and monitoring configurations
- **Annotations**: Destructive
- **Required Fields**: `applicationId`
- **Optional Fields**: All application configuration fields (build settings, environment variables, resource limits, etc.)

#### `application-delete`

- **Description**: Deletes an application from Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`

#### `application-move`

- **Description**: Moves an application to a different project
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "targetProjectId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `targetProjectId`

### Deployment & Lifecycle Operations

#### `application-deploy`

- **Description**: Deploys an application in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Non-destructive, Non-idempotent
- **Required Fields**: `applicationId`

#### `application-redeploy`

- **Description**: Redeploys an application in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Non-destructive, Non-idempotent
- **Required Fields**: `applicationId`

#### `application-start`

- **Description**: Starts an application in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Non-destructive, Non-idempotent
- **Required Fields**: `applicationId`

#### `application-stop`

- **Description**: Stops an application in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Destructive, Non-idempotent
- **Required Fields**: `applicationId`

#### `application-cancelDeployment`

- **Description**: Cancels an ongoing deployment for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Destructive, Non-idempotent
- **Required Fields**: `applicationId`

#### `application-reload`

- **Description**: Reloads an application in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "appName": "string"
  }
  ```
- **Annotations**: Non-destructive, Non-idempotent
- **Required Fields**: `applicationId`, `appName`

#### `application-markRunning`

- **Description**: Marks an application as running in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Destructive, Non-idempotent
- **Required Fields**: `applicationId`

### Configuration Management

#### `application-saveBuildType`

- **Description**: Saves build type configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "buildType": "dockerfile|heroku|nixpacks|buildpacks|docker",
    "dockerContextPath": "string|null",
    "dockerBuildStage": "string|null",
    "herokuVersion": "string|null"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `buildType`
- **Optional Fields**: `dockerContextPath`, `dockerBuildStage`, `herokuVersion`

#### `application-saveEnvironment`

- **Description**: Saves environment configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "env": "string|null",
    "buildArgs": "string|null"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`
- **Optional Fields**: `env`, `buildArgs`

### Git Provider Configurations

#### `application-saveGithubProvider`

- **Description**: Saves GitHub provider configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "repository": "string|null",
    "branch": "string|null",
    "owner": "string|null",
    "buildPath": "string|null",
    "githubId": "string|null",
    "watchPaths": ["string"]|null,
    "enableSubmodules": "boolean",
    "triggerType": "push|tag"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `owner`, `githubId`, `enableSubmodules`
- **Optional Fields**: `repository`, `branch`, `buildPath`, `watchPaths`, `triggerType`

#### `application-saveGitlabProvider`

- **Description**: Saves GitLab provider configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "gitlabBranch": "string|null",
    "gitlabBuildPath": "string|null",
    "gitlabOwner": "string|null",
    "gitlabRepository": "string|null",
    "gitlabId": "string|null",
    "gitlabProjectId": "number|null",
    "gitlabPathNamespace": "string|null",
    "watchPaths": ["string"]|null,
    "enableSubmodules": "boolean"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `gitlabBranch`, `gitlabBuildPath`, `gitlabOwner`, `gitlabRepository`, `gitlabId`, `gitlabProjectId`, `gitlabPathNamespace`, `enableSubmodules`
- **Optional Fields**: `watchPaths`

#### `application-saveBitbucketProvider`

- **Description**: Saves Bitbucket provider configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "bitbucketBranch": "string|null",
    "bitbucketBuildPath": "string|null",
    "bitbucketOwner": "string|null",
    "bitbucketRepository": "string|null",
    "bitbucketId": "string|null",
    "watchPaths": ["string"]|null,
    "enableSubmodules": "boolean"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `bitbucketBranch`, `bitbucketBuildPath`, `bitbucketOwner`, `bitbucketRepository`, `bitbucketId`, `enableSubmodules`
- **Optional Fields**: `watchPaths`

#### `application-saveGiteaProvider`

- **Description**: Saves Gitea provider configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "giteaBranch": "string|null",
    "giteaBuildPath": "string|null",
    "giteaOwner": "string|null",
    "giteaRepository": "string|null",
    "giteaId": "string|null",
    "watchPaths": ["string"]|null,
    "enableSubmodules": "boolean"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `giteaBranch`, `giteaBuildPath`, `giteaOwner`, `giteaRepository`, `giteaId`, `enableSubmodules`
- **Optional Fields**: `watchPaths`

#### `application-saveGitProvider`

- **Description**: Saves Git provider configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "customGitUrl": "string|null",
    "customGitBranch": "string|null",
    "customGitBuildPath": "string|null",
    "customGitSSHKeyId": "string|null",
    "watchPaths": ["string"]|null,
    "enableSubmodules": "boolean"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `enableSubmodules`
- **Optional Fields**: `customGitUrl`, `customGitBranch`, `customGitBuildPath`, `customGitSSHKeyId`, `watchPaths`

#### `application-saveDockerProvider`

- **Description**: Saves Docker provider configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "dockerImage": "string|null"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `dockerImage`

#### `application-disconnectGitProvider`

- **Description**: Disconnects Git provider configuration from an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`

### Monitoring & Configuration

#### `application-readAppMonitoring`

- **Description**: Reads monitoring data for an application
- **Input Schema**:
  ```json
  {
    "appName": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `appName`

#### `application-readTraefikConfig`

- **Description**: Reads Traefik configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `applicationId`

#### `application-updateTraefikConfig`

- **Description**: Updates Traefik configuration for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string",
    "traefikConfig": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`, `traefikConfig`

### Utility Operations

#### `application-refreshToken`

- **Description**: Refreshes the token for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Non-destructive
- **Required Fields**: `applicationId`

#### `application-cleanQueues`

- **Description**: Cleans deployment queues for an application
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `applicationId`

## 🌐 Domain Management Tools

These tools manage domains for applications, compose services, and preview deployments, including SSL/TLS, routing, validation, and automatic suggestions.

### `domain-byApplicationId`

- **Description**: Retrieves all domains associated with a specific application in Dokploy
- **Input Schema**:
  ```json
  {
    "applicationId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `applicationId`

### `domain-byComposeId`

- **Description**: Retrieves all domains associated with a specific compose stack/service in Dokploy
- **Input Schema**:
  ```json
  {
    "composeId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `composeId`

### `domain-one`

- **Description**: Retrieves a specific domain configuration by its ID in Dokploy
- **Input Schema**:
  ```json
  {
    "domainId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `domainId`

### `domain-create`

- **Description**: Creates a new domain configuration (application, compose, or preview) with SSL options
- **Input Schema**:
  ```json
  {
    "host": "string",
    "path": "string|null",
    "port": "number|null",
    "https": "boolean",
    "applicationId": "string|null",
    "certificateType": "letsencrypt|none|custom",
    "customCertResolver": "string|null",
    "composeId": "string|null",
    "serviceName": "string|null",
    "domainType": "compose|application|preview|null",
    "previewDeploymentId": "string|null",
    "internalPath": "string|null",
    "stripPath": "boolean"
  }
  ```
- **Annotations**: Non-destructive, Non-idempotent
- **Required Fields**: `host`, `https`, `certificateType`, `stripPath`
- **Optional Fields**: `path`, `port`, `applicationId`, `customCertResolver`, `composeId`, `serviceName`, `domainType`, `previewDeploymentId`, `internalPath`

### `domain-update`

- **Description**: Updates an existing domain configuration (host, SSL, routing, service associations)
- **Input Schema**:
  ```json
  {
    "domainId": "string",
    "host": "string",
    "path": "string|null",
    "port": "number|null",
    "https": "boolean",
    "certificateType": "letsencrypt|none|custom",
    "customCertResolver": "string|null",
    "serviceName": "string|null",
    "domainType": "compose|application|preview|null",
    "internalPath": "string|null",
    "stripPath": "boolean"
  }
  ```
- **Annotations**: Non-destructive, Idempotent
- **Required Fields**: `domainId`, `host`, `https`, `certificateType`, `stripPath`
- **Optional Fields**: `path`, `port`, `customCertResolver`, `serviceName`, `domainType`, `internalPath`

### `domain-delete`

- **Description**: Deletes a domain configuration by ID
- **Input Schema**:
  ```json
  {
    "domainId": "string"
  }
  ```
- **Annotations**: Destructive, Non-idempotent
- **Required Fields**: `domainId`

### `domain-validateDomain`

- **Description**: Validates if a domain is correctly configured, optionally against a specific server IP
- **Input Schema**:
  ```json
  {
    "domain": "string",
    "serverIp": "string(optional)"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `domain`
- **Optional Fields**: `serverIp`

### `domain-generateDomain`

- **Description**: Generates a suggested domain for an application name, optionally scoped to a server
- **Input Schema**:
  ```json
  {
    "appName": "string",
    "serverId": "string(optional)"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `appName`
- **Optional Fields**: `serverId`

### `domain-canGenerateTraefikMeDomains`

- **Description**: Checks whether Traefik.me domains can be generated for a specific server
- **Input Schema**:
  ```json
  {
    "serverId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `serverId`

## 🐘 PostgreSQL Database Management Tools

### Core Database Operations

#### `postgres-create`

- **Description**: Creates a new PostgreSQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "name": "string",
    "appName": "string",
    "databaseName": "string",
    "databaseUser": "string",
    "databasePassword": "string",
    "dockerImage": "string",
    "projectId": "string",
    "description": "string|null",
    "serverId": "string|null"
  }
  ```
- **Annotations**: Creation tool (non-destructive)
- **Required Fields**: `name`, `appName`, `databaseName`, `databaseUser`, `databasePassword`, `projectId`
- **Optional Fields**: `dockerImage`, `description`, `serverId`

#### `postgres-one`

- **Description**: Gets a specific PostgreSQL database by its ID in Dokploy
- **Input Schema**:
  ```json
  {
    "postgresId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `postgresId`

#### `postgres-update`

- **Description**: Updates an existing PostgreSQL database in Dokploy
- **Input Schema**: Complex schema with database configuration fields including name, credentials, resource limits, and Docker settings
- **Annotations**: Destructive
- **Required Fields**: `postgresId`
- **Optional Fields**: All database configuration fields (name, credentials, memory/CPU limits, etc.)

#### `postgres-remove`

- **Description**: Removes/deletes a PostgreSQL database from Dokploy
- **Input Schema**:
  ```json
  {
    "postgresId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`

#### `postgres-move`

- **Description**: Moves a PostgreSQL database to a different project
- **Input Schema**:
  ```json
  {
    "postgresId": "string",
    "targetProjectId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`, `targetProjectId`

### Lifecycle Management

#### `postgres-deploy`

- **Description**: Deploys a PostgreSQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "postgresId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`

#### `postgres-start`

- **Description**: Starts a PostgreSQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "postgresId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`

#### `postgres-stop`

- **Description**: Stops a PostgreSQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "postgresId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`

#### `postgres-reload`

- **Description**: Reloads a PostgreSQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "postgresId": "string",
    "appName": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`, `appName`

#### `postgres-rebuild`

- **Description**: Rebuilds a PostgreSQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "postgresId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`

### Configuration Management

#### `postgres-changeStatus`

- **Description**: Changes the status of a PostgreSQL database
- **Input Schema**:
  ```json
  {
    "postgresId": "string",
    "applicationStatus": "idle|running|done|error"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`, `applicationStatus`

#### `postgres-saveExternalPort`

- **Description**: Saves external port configuration for a PostgreSQL database
- **Input Schema**:
  ```json
  {
    "postgresId": "string",
    "externalPort": "number|null"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`, `externalPort`

#### `postgres-saveEnvironment`

- **Description**: Saves environment variables for a PostgreSQL database
- **Input Schema**:
  ```json
  {
    "postgresId": "string",
    "env": "string|null"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `postgresId`
- **Optional Fields**: `env`

## 🐬 MySQL Database Management Tools

Dokploy includes comprehensive MySQL database management capabilities. These tools mirror the PostgreSQL functionality but are tailored for MySQL databases with MySQL-specific features like root password management.

### Core Database Operations

#### `mysql-create`

- **Description**: Creates a new MySQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "name": "string",
    "appName": "string",
    "databaseName": "string",
    "databaseUser": "string",
    "databasePassword": "string",
    "databaseRootPassword": "string",
    "dockerImage": "string",
    "projectId": "string",
    "description": "string|null",
    "serverId": "string|null"
  }
  ```
- **Annotations**: Creation tool (non-destructive)
- **Required Fields**: `name`, `appName`, `databaseName`, `databaseUser`, `databasePassword`, `databaseRootPassword`, `projectId`
- **Optional Fields**: `dockerImage` (defaults to "mysql:8"), `description`, `serverId`

#### `mysql-one`

- **Description**: Gets a specific MySQL database by its ID in Dokploy
- **Input Schema**:
  ```json
  {
    "mysqlId": "string"
  }
  ```
- **Annotations**: Read-only, Idempotent
- **Required Fields**: `mysqlId`

#### `mysql-update`

- **Description**: Updates an existing MySQL database in Dokploy
- **Input Schema**: Complex schema with database configuration fields including name, credentials, resource limits, and Docker settings
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`
- **Optional Fields**: All database configuration fields (name, credentials, memory/CPU limits, etc.)

#### `mysql-remove`

- **Description**: Removes/deletes a MySQL database from Dokploy
- **Input Schema**:
  ```json
  {
    "mysqlId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`

#### `mysql-move`

- **Description**: Moves a MySQL database to a different project
- **Input Schema**:
  ```json
  {
    "mysqlId": "string",
    "targetProjectId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`, `targetProjectId`

### Lifecycle Management

#### `mysql-deploy`

- **Description**: Deploys a MySQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "mysqlId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`

#### `mysql-start`

- **Description**: Starts a MySQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "mysqlId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`

#### `mysql-stop`

- **Description**: Stops a MySQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "mysqlId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`

#### `mysql-reload`

- **Description**: Reloads a MySQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "mysqlId": "string",
    "appName": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`, `appName`

#### `mysql-rebuild`

- **Description**: Rebuilds a MySQL database in Dokploy
- **Input Schema**:
  ```json
  {
    "mysqlId": "string"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`

### Configuration Management

#### `mysql-changeStatus`

- **Description**: Changes the status of a MySQL database
- **Input Schema**:
  ```json
  {
    "mysqlId": "string",
    "applicationStatus": "idle|running|done|error"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`, `applicationStatus`

#### `mysql-saveExternalPort`

- **Description**: Saves external port configuration for a MySQL database
- **Input Schema**:
  ```json
  {
    "mysqlId": "string",
    "externalPort": "number|null"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`, `externalPort`

#### `mysql-saveEnvironment`

- **Description**: Saves environment variables for a MySQL database
- **Input Schema**:
  ```json
  {
    "mysqlId": "string",
    "env": "string|null"
  }
  ```
- **Annotations**: Destructive
- **Required Fields**: `mysqlId`
- **Optional Fields**: `env`

## 🏷️ Tool Annotations

All tools include semantic annotations to help MCP clients understand their behavior:

- **Read-Only** (`readOnlyHint: true`): Safe operations that only retrieve data
  - Examples: `project-all`, `project-one`, `application-one`, `application-readTraefikConfig`, `postgres-one`, `mysql-one`

- **Destructive** (`destructiveHint: true`): Operations that modify or delete resources irreversibly
  - Examples: `project-update`, `project-remove`, `application-delete`, `application-stop`, `application-cancelDeployment`

- **Non-Destructive** (`destructiveHint: false`): Operations that create resources or perform safe actions
  - Examples: All create operations, deploy, start, reload operations

- **Idempotent** (`idempotentHint: true`): Operations safe to repeat without side effects
  - Examples: All read-only operations

- **External API** (`openWorldHint: true`): All tools interact with external Dokploy API

## 🔧 Quick Start Examples

### Project & Application Workflow
```json
// Create project → Create application → Configure Git → Deploy
{"tool": "project-create", "input": {"name": "my-project"}}
{"tool": "application-create", "input": {"name": "my-app", "projectId": "..."}}
{"tool": "application-saveGithubProvider", "input": {"applicationId": "...", "repository": "owner/repo", "branch": "main"}}
{"tool": "application-deploy", "input": {"applicationId": "..."}}
```

### Database Workflow
```json
// Create → Deploy → Configure
{"tool": "postgres-create", "input": {"name": "my-db", "databaseName": "app", "databaseUser": "user", "databasePassword": "pass", "projectId": "..."}}
{"tool": "postgres-deploy", "input": {"postgresId": "..."}}
{"tool": "postgres-saveExternalPort", "input": {"postgresId": "...", "externalPort": 5432}}
```

## 📝 Important Notes

- Nullable fields accept `null` but must be provided if marked required
- Provider tools use prefixed fields: `gitlabBranch`, `giteaOwner`, `bitbucketRepository`
- Resource limits use string format: `"512m"`, `"1g"`, `"0.5"`
- MySQL requires both `databasePassword` and `databaseRootPassword`
- Default images: PostgreSQL `postgres:latest`, MySQL `mysql:8`
- All tools include comprehensive error handling and Zod validation
