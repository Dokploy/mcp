# Dokploy MCP Server - Tools Documentation

> Auto-generated from the [Dokploy OpenAPI spec](https://docs.dokploy.com/openapi.json). Run `pnpm generate` to update.

- **Total Tools**: 508
- **Categories**: 48

## Categories

- [admin](#admin) (1 tools)
- [ai](#ai) (9 tools)
- [application](#application) (30 tools)
- [auditLog](#auditLog) (1 tools)
- [backup](#backup) (12 tools)
- [bitbucket](#bitbucket) (7 tools)
- [certificates](#certificates) (5 tools)
- [cluster](#cluster) (4 tools)
- [compose](#compose) (29 tools)
- [customRole](#customRole) (6 tools)
- [deployment](#deployment) (8 tools)
- [destination](#destination) (6 tools)
- [docker](#docker) (9 tools)
- [domain](#domain) (9 tools)
- [environment](#environment) (7 tools)
- [gitea](#gitea) (8 tools)
- [github](#github) (6 tools)
- [gitlab](#gitlab) (7 tools)
- [gitProvider](#gitProvider) (4 tools)
- [libsql](#libsql) (13 tools)
- [licenseKey](#licenseKey) (6 tools)
- [mariadb](#mariadb) (15 tools)
- [mongo](#mongo) (15 tools)
- [mounts](#mounts) (6 tools)
- [mysql](#mysql) (15 tools)
- [notification](#notification) (41 tools)
- [organization](#organization) (11 tools)
- [patch](#patch) (12 tools)
- [port](#port) (4 tools)
- [postgres](#postgres) (15 tools)
- [previewDeployment](#previewDeployment) (4 tools)
- [project](#project) (8 tools)
- [redirects](#redirects) (4 tools)
- [redis](#redis) (15 tools)
- [registry](#registry) (7 tools)
- [rollback](#rollback) (2 tools)
- [schedule](#schedule) (6 tools)
- [security](#security) (4 tools)
- [server](#server) (17 tools)
- [settings](#settings) (51 tools)
- [sshKey](#sshKey) (7 tools)
- [sso](#sso) (10 tools)
- [stripe](#stripe) (7 tools)
- [swarm](#swarm) (4 tools)
- [tag](#tag) (8 tools)
- [user](#user) (23 tools)
- [volumeBackups](#volumeBackups) (6 tools)
- [whitelabeling](#whitelabeling) (4 tools)

## admin

| Tool | Method | Parameters |
|------|--------|------------|
| `admin-setupMonitoring` | POST | `metricsConfig` (object) |

## ai

| Tool | Method | Parameters |
|------|--------|------------|
| `ai-one` | GET | `aiId` (string) |
| `ai-getModels` | GET | `apiUrl` (string), `apiKey` (string) |
| `ai-create` | POST | `name` (string), `apiUrl` (string), `apiKey` (string), `model` (string), `isEnabled` (boolean) |
| `ai-update` | POST | `aiId` (string), +6 optional |
| `ai-getAll` | GET | None |
| `ai-get` | GET | `aiId` (string) |
| `ai-delete` | POST | `aiId` (string) |
| `ai-suggest` | POST | `aiId` (string), `input` (string), `serverId`? |
| `ai-deploy` | POST | `environmentId` (string), `id` (string), `dockerCompose` (string), `envVariables` (string), `name` (string), `description` (string), `serverId`?, `domains`?, `configFiles`? |

## application

| Tool | Method | Parameters |
|------|--------|------------|
| `application-create` | POST | `name` (string), `environmentId` (string), `appName`?, `description`?, `serverId`? |
| `application-one` | GET | `applicationId` (string) |
| `application-reload` | POST | `appName` (string), `applicationId` (string) |
| `application-delete` | POST | `applicationId` (string) |
| `application-stop` | POST | `applicationId` (string) |
| `application-start` | POST | `applicationId` (string) |
| `application-redeploy` | POST | `applicationId` (string), `title`?, `description`? |
| `application-saveEnvironment` | POST | `applicationId` (string), `env` (string | null), `buildArgs` (string | null), `buildSecrets` (string | null), `createEnvFile` (boolean) |
| `application-saveBuildType` | POST | `applicationId` (string), `buildType` ("dockerfile" | "heroku_buildpacks" | "paketo_buildpacks" | "nixpacks" | "static" | "railpack"), `dockerfile` (string | null), `dockerContextPath` (string | null), `dockerBuildStage` (string | null), `herokuVersion` (string | null), `railpackVersion` (string | null), `publishDirectory`?, `isStaticSpa`? |
| `application-saveGithubProvider` | POST | `applicationId` (string), `repository` (string | null), `branch` (string | null), `owner` (string | null), `buildPath` (string | null), `githubId` (string | null), `triggerType` ("push" | "tag"), `enableSubmodules`?, `watchPaths`? |
| `application-saveGitlabProvider` | POST | `applicationId` (string), `gitlabBranch` (string | null), `gitlabBuildPath` (string | null), `gitlabOwner` (string | null), `gitlabRepository` (string | null), `gitlabId` (string | null), `gitlabProjectId` (number | null), `gitlabPathNamespace` (string | null), `enableSubmodules`?, `watchPaths`? |
| `application-saveBitbucketProvider` | POST | `bitbucketBranch` (string | null), `bitbucketBuildPath` (string | null), `bitbucketOwner` (string | null), `bitbucketRepository` (string | null), `bitbucketRepositorySlug` (string | null), `bitbucketId` (string | null), `applicationId` (string), `enableSubmodules`?, `watchPaths`? |
| `application-saveGiteaProvider` | POST | `applicationId` (string), `giteaBranch` (string | null), `giteaBuildPath` (string | null), `giteaOwner` (string | null), `giteaRepository` (string | null), `giteaId` (string | null), `enableSubmodules`?, `watchPaths`? |
| `application-saveDockerProvider` | POST | `dockerImage` (string | null), `applicationId` (string), `username` (string | null), `password` (string | null), `registryUrl` (string | null) |
| `application-saveGitProvider` | POST | `customGitBranch` (string | null), `applicationId` (string), `customGitBuildPath` (string | null), `customGitUrl` (string | null), `watchPaths` (array | null), `enableSubmodules`?, `customGitSSHKeyId`? |
| `application-disconnectGitProvider` | POST | `applicationId` (string) |
| `application-markRunning` | POST | `applicationId` (string) |
| `application-update` | POST | `applicationId` (string), +97 optional |
| `application-refreshToken` | POST | `applicationId` (string) |
| `application-deploy` | POST | `applicationId` (string), `title`?, `description`? |
| `application-cleanQueues` | POST | `applicationId` (string) |
| `application-clearDeployments` | POST | `applicationId` (string) |
| `application-killBuild` | POST | `applicationId` (string) |
| `application-readTraefikConfig` | GET | `applicationId` (string) |
| `application-dropDeployment` | POST | None |
| `application-updateTraefikConfig` | POST | `applicationId` (string), `traefikConfig` (string) |
| `application-readAppMonitoring` | GET | `appName` (string) |
| `application-move` | POST | `applicationId` (string), `targetEnvironmentId` (string) |
| `application-cancelDeployment` | POST | `applicationId` (string) |
| `application-search` | GET | +11 optional |

## auditLog

| Tool | Method | Parameters |
|------|--------|------------|
| `auditLog-all` | GET | +9 optional |

## backup

| Tool | Method | Parameters |
|------|--------|------------|
| `backup-create` | POST | `schedule` (string), `prefix` (string), `destinationId` (string), `database` (string), `databaseType` ("postgres" | "mariadb" | "mysql" | "mongo" | "web-server" | "libsql"), +12 optional |
| `backup-one` | GET | `backupId` (string) |
| `backup-update` | POST | `schedule` (string), `enabled` (boolean | null), `prefix` (string), `backupId` (string), `destinationId` (string), `database` (string), `keepLatestCount` (number | null), `serviceName` (string | null), `metadata` (unknown | null), `databaseType` ("postgres" | "mariadb" | "mysql" | "mongo" | "web-server" | "libsql") |
| `backup-remove` | POST | `backupId` (string) |
| `backup-manualBackupPostgres` | POST | `backupId` (string) |
| `backup-manualBackupMySql` | POST | `backupId` (string) |
| `backup-manualBackupMariadb` | POST | `backupId` (string) |
| `backup-manualBackupCompose` | POST | `backupId` (string) |
| `backup-manualBackupMongo` | POST | `backupId` (string) |
| `backup-manualBackupLibsql` | POST | `backupId` (string) |
| `backup-manualBackupWebServer` | POST | `backupId` (string) |
| `backup-listBackupFiles` | GET | `destinationId` (string), `search` (string), `serverId`? |

## bitbucket

| Tool | Method | Parameters |
|------|--------|------------|
| `bitbucket-create` | POST | `authId` (string), `name` (string), +7 optional |
| `bitbucket-one` | GET | `bitbucketId` (string) |
| `bitbucket-bitbucketProviders` | GET | None |
| `bitbucket-getBitbucketRepositories` | GET | `bitbucketId` (string) |
| `bitbucket-getBitbucketBranches` | GET | `owner` (string), `repo` (string), `bitbucketId`? |
| `bitbucket-testConnection` | POST | `bitbucketId` (string), +5 optional |
| `bitbucket-update` | POST | `bitbucketId` (string), `gitProviderId` (string), `name` (string), +6 optional |

## certificates

| Tool | Method | Parameters |
|------|--------|------------|
| `certificates-create` | POST | `name` (string), `certificateData` (string), `privateKey` (string), `organizationId` (string), +4 optional |
| `certificates-one` | GET | `certificateId` (string) |
| `certificates-remove` | POST | `certificateId` (string) |
| `certificates-all` | GET | None |
| `certificates-update` | POST | `certificateId` (string), `name`?, `certificateData`?, `privateKey`? |

## cluster

| Tool | Method | Parameters |
|------|--------|------------|
| `cluster-getNodes` | GET | `serverId`? |
| `cluster-removeWorker` | POST | `nodeId` (string), `serverId`? |
| `cluster-addWorker` | GET | `serverId`? |
| `cluster-addManager` | GET | `serverId`? |

## compose

| Tool | Method | Parameters |
|------|--------|------------|
| `compose-create` | POST | `name` (string), `environmentId` (string), +5 optional |
| `compose-one` | GET | `composeId` (string) |
| `compose-update` | POST | `composeId` (string), +43 optional |
| `compose-saveEnvironment` | POST | `composeId` (string), `env` (string | null) |
| `compose-delete` | POST | `composeId` (string), `deleteVolumes` (boolean) |
| `compose-cleanQueues` | POST | `composeId` (string) |
| `compose-clearDeployments` | POST | `composeId` (string) |
| `compose-killBuild` | POST | `composeId` (string) |
| `compose-loadServices` | GET | `composeId` (string), `type`? |
| `compose-loadMountsByService` | GET | `composeId` (string), `serviceName` (string) |
| `compose-fetchSourceType` | POST | `composeId` (string) |
| `compose-randomizeCompose` | POST | `composeId` (string), `suffix`? |
| `compose-isolatedDeployment` | POST | `composeId` (string), `suffix`? |
| `compose-getConvertedCompose` | GET | `composeId` (string) |
| `compose-deploy` | POST | `composeId` (string), `title`?, `description`? |
| `compose-redeploy` | POST | `composeId` (string), `title`?, `description`? |
| `compose-stop` | POST | `composeId` (string) |
| `compose-start` | POST | `composeId` (string) |
| `compose-getDefaultCommand` | GET | `composeId` (string) |
| `compose-refreshToken` | POST | `composeId` (string) |
| `compose-deployTemplate` | POST | `environmentId` (string), `id` (string), `serverId`?, `baseUrl`? |
| `compose-templates` | GET | `baseUrl`? |
| `compose-getTags` | GET | `baseUrl`? |
| `compose-disconnectGitProvider` | POST | `composeId` (string) |
| `compose-move` | POST | `composeId` (string), `targetEnvironmentId` (string) |
| `compose-processTemplate` | POST | `base64` (string), `composeId` (string) |
| `compose-import` | POST | `base64` (string), `composeId` (string) |
| `compose-cancelDeployment` | POST | `composeId` (string) |
| `compose-search` | GET | +8 optional |

## customRole

| Tool | Method | Parameters |
|------|--------|------------|
| `customRole-all` | GET | None |
| `customRole-create` | POST | `roleName` (string), `permissions` (object) |
| `customRole-update` | POST | `roleName` (string), `permissions` (object), `newRoleName`? |
| `customRole-remove` | POST | `roleName` (string) |
| `customRole-membersByRole` | GET | `roleName` (string) |
| `customRole-getStatements` | GET | None |

## deployment

| Tool | Method | Parameters |
|------|--------|------------|
| `deployment-all` | GET | `applicationId` (string) |
| `deployment-allByCompose` | GET | `composeId` (string) |
| `deployment-allByServer` | GET | `serverId` (string) |
| `deployment-allCentralized` | GET | None |
| `deployment-queueList` | GET | None |
| `deployment-allByType` | GET | `id` (string), `type` ("application" | "compose" | "server" | "schedule" | "previewDeployment" | "backup" | "volumeBackup") |
| `deployment-killProcess` | POST | `deploymentId` (string) |
| `deployment-removeDeployment` | POST | `deploymentId` (string) |

## destination

| Tool | Method | Parameters |
|------|--------|------------|
| `destination-create` | POST | `name` (string), `provider` (string | null), `accessKey` (string), `bucket` (string), `region` (string), `endpoint` (string), `secretAccessKey` (string), `additionalFlags` (array | null), `serverId`? |
| `destination-testConnection` | POST | `name` (string), `provider` (string | null), `accessKey` (string), `bucket` (string), `region` (string), `endpoint` (string), `secretAccessKey` (string), `additionalFlags` (array | null), `serverId`? |
| `destination-one` | GET | `destinationId` (string) |
| `destination-all` | GET | None |
| `destination-remove` | POST | `destinationId` (string) |
| `destination-update` | POST | `name` (string), `accessKey` (string), `bucket` (string), `region` (string), `endpoint` (string), `secretAccessKey` (string), `destinationId` (string), `provider` (string | null), `additionalFlags` (array | null), `serverId`? |

## docker

| Tool | Method | Parameters |
|------|--------|------------|
| `docker-getContainers` | GET | `serverId`? |
| `docker-restartContainer` | POST | `containerId` (string) |
| `docker-removeContainer` | POST | `containerId` (string), `serverId`? |
| `docker-getConfig` | GET | `containerId` (string), `serverId`? |
| `docker-getContainersByAppNameMatch` | GET | `appName` (string), `appType`?, `serverId`? |
| `docker-getContainersByAppLabel` | GET | `appName` (string), `type` ("standalone" | "swarm"), `serverId`? |
| `docker-getStackContainersByAppName` | GET | `appName` (string), `serverId`? |
| `docker-getServiceContainersByAppName` | GET | `appName` (string), `serverId`? |
| `docker-uploadFileToContainer` | POST | None |

## domain

| Tool | Method | Parameters |
|------|--------|------------|
| `domain-create` | POST | `host` (string), +14 optional |
| `domain-byApplicationId` | GET | `applicationId` (string) |
| `domain-byComposeId` | GET | `composeId` (string) |
| `domain-generateDomain` | POST | `appName` (string), `serverId`? |
| `domain-canGenerateTraefikMeDomains` | GET | `serverId` (string) |
| `domain-update` | POST | `host` (string), `domainId` (string), +11 optional |
| `domain-one` | GET | `domainId` (string) |
| `domain-delete` | POST | `domainId` (string) |
| `domain-validateDomain` | POST | `domain` (string), `serverIp`? |

## environment

| Tool | Method | Parameters |
|------|--------|------------|
| `environment-create` | POST | `name` (string), `projectId` (string), `description`? |
| `environment-one` | GET | `environmentId` (string) |
| `environment-byProjectId` | GET | `projectId` (string) |
| `environment-remove` | POST | `environmentId` (string) |
| `environment-update` | POST | `environmentId` (string), +4 optional |
| `environment-duplicate` | POST | `environmentId` (string), `name` (string), `description`? |
| `environment-search` | GET | +6 optional |

## gitea

| Tool | Method | Parameters |
|------|--------|------------|
| `gitea-create` | POST | `giteaUrl` (string), `name` (string), +13 optional |
| `gitea-one` | GET | `giteaId` (string) |
| `gitea-giteaProviders` | GET | None |
| `gitea-getGiteaRepositories` | GET | `giteaId` (string) |
| `gitea-getGiteaBranches` | GET | `owner` (string), `repositoryName` (string), `giteaId`? |
| `gitea-testConnection` | POST | `giteaId`?, `organizationName`? |
| `gitea-update` | POST | `giteaId` (string), `giteaUrl` (string), `gitProviderId` (string), `name` (string), +11 optional |
| `gitea-getGiteaUrl` | GET | `giteaId` (string) |

## github

| Tool | Method | Parameters |
|------|--------|------------|
| `github-one` | GET | `githubId` (string) |
| `github-getGithubRepositories` | GET | `githubId` (string) |
| `github-getGithubBranches` | GET | `repo` (string), `owner` (string), `githubId`? |
| `github-githubProviders` | GET | None |
| `github-testConnection` | POST | `githubId` (string) |
| `github-update` | POST | `githubId` (string), `name` (string), `gitProviderId` (string), `githubAppName` (string) |

## gitlab

| Tool | Method | Parameters |
|------|--------|------------|
| `gitlab-create` | POST | `authId` (string), `name` (string), `gitlabUrl` (string), +6 optional |
| `gitlab-one` | GET | `gitlabId` (string) |
| `gitlab-gitlabProviders` | GET | None |
| `gitlab-getGitlabRepositories` | GET | `gitlabId` (string) |
| `gitlab-getGitlabBranches` | GET | `owner` (string), `repo` (string), `id`?, `gitlabId`? |
| `gitlab-testConnection` | POST | `gitlabId` (string), `groupName`? |
| `gitlab-update` | POST | `name` (string), `gitlabId` (string), `gitlabUrl` (string), `gitProviderId` (string), +5 optional |

## gitProvider

| Tool | Method | Parameters |
|------|--------|------------|
| `gitProvider-getAll` | GET | None |
| `gitProvider-toggleShare` | POST | `gitProviderId` (string), `sharedWithOrganization` (boolean) |
| `gitProvider-allForPermissions` | GET | None |
| `gitProvider-remove` | POST | `gitProviderId` (string) |

## libsql

| Tool | Method | Parameters |
|------|--------|------------|
| `libsql-create` | POST | `name` (string), `appName` (string), `dockerImage` (string), `environmentId` (string), `description` (string | null), `databaseUser` (string), `databasePassword` (string), `sqldNode` ("primary" | "replica"), `sqldPrimaryUrl` (unknown | null), `enableNamespaces` (boolean), `serverId` (string | null) |
| `libsql-one` | GET | `libsqlId` (string) |
| `libsql-start` | POST | `libsqlId` (string) |
| `libsql-stop` | POST | `libsqlId` (string) |
| `libsql-saveExternalPorts` | POST | `libsqlId` (string), `externalPort`?, `externalGRPCPort`?, `externalAdminPort`? |
| `libsql-deploy` | POST | `libsqlId` (string) |
| `libsql-changeStatus` | POST | `libsqlId` (string), `applicationStatus` ("idle" | "running" | "done" | "error") |
| `libsql-remove` | POST | `libsqlId` (string) |
| `libsql-saveEnvironment` | POST | `libsqlId` (string), `env` (string | null) |
| `libsql-reload` | POST | `libsqlId` (string), `appName` (string) |
| `libsql-update` | POST | `libsqlId` (string), +32 optional |
| `libsql-move` | POST | `libsqlId` (string), `targetEnvironmentId` (string) |
| `libsql-rebuild` | POST | `libsqlId` (string) |

## licenseKey

| Tool | Method | Parameters |
|------|--------|------------|
| `licenseKey-activate` | POST | `licenseKey` (string) |
| `licenseKey-validate` | POST | None |
| `licenseKey-deactivate` | POST | None |
| `licenseKey-getEnterpriseSettings` | GET | None |
| `licenseKey-haveValidLicenseKey` | GET | None |
| `licenseKey-updateEnterpriseSettings` | POST | `enableEnterpriseFeatures`? |

## mariadb

| Tool | Method | Parameters |
|------|--------|------------|
| `mariadb-create` | POST | `name` (string), `environmentId` (string), `databaseName` (string), `databaseUser` (string), `databasePassword` (string), +5 optional |
| `mariadb-one` | GET | `mariadbId` (string) |
| `mariadb-start` | POST | `mariadbId` (string) |
| `mariadb-stop` | POST | `mariadbId` (string) |
| `mariadb-saveExternalPort` | POST | `mariadbId` (string), `externalPort` (number | null) |
| `mariadb-deploy` | POST | `mariadbId` (string) |
| `mariadb-changeStatus` | POST | `mariadbId` (string), `applicationStatus` ("idle" | "running" | "done" | "error") |
| `mariadb-remove` | POST | `mariadbId` (string) |
| `mariadb-saveEnvironment` | POST | `mariadbId` (string), `env` (string | null) |
| `mariadb-reload` | POST | `mariadbId` (string), `appName` (string) |
| `mariadb-update` | POST | `mariadbId` (string), +31 optional |
| `mariadb-changePassword` | POST | `mariadbId` (string), `password` (string), `type`? |
| `mariadb-move` | POST | `mariadbId` (string), `targetEnvironmentId` (string) |
| `mariadb-rebuild` | POST | `mariadbId` (string) |
| `mariadb-search` | GET | +8 optional |

## mongo

| Tool | Method | Parameters |
|------|--------|------------|
| `mongo-create` | POST | `name` (string), `environmentId` (string), `databaseUser` (string), `databasePassword` (string), +5 optional |
| `mongo-one` | GET | `mongoId` (string) |
| `mongo-start` | POST | `mongoId` (string) |
| `mongo-stop` | POST | `mongoId` (string) |
| `mongo-saveExternalPort` | POST | `mongoId` (string), `externalPort` (number | null) |
| `mongo-deploy` | POST | `mongoId` (string) |
| `mongo-changeStatus` | POST | `mongoId` (string), `applicationStatus` ("idle" | "running" | "done" | "error") |
| `mongo-reload` | POST | `mongoId` (string), `appName` (string) |
| `mongo-remove` | POST | `mongoId` (string) |
| `mongo-saveEnvironment` | POST | `mongoId` (string), `env` (string | null) |
| `mongo-update` | POST | `mongoId` (string), +30 optional |
| `mongo-changePassword` | POST | `mongoId` (string), `password` (string) |
| `mongo-move` | POST | `mongoId` (string), `targetEnvironmentId` (string) |
| `mongo-rebuild` | POST | `mongoId` (string) |
| `mongo-search` | GET | +8 optional |

## mounts

| Tool | Method | Parameters |
|------|--------|------------|
| `mounts-create` | POST | `type` ("bind" | "volume" | "file"), `mountPath` (string), `serviceId` (string), +5 optional |
| `mounts-remove` | POST | `mountId` (string) |
| `mounts-one` | GET | `mountId` (string) |
| `mounts-update` | POST | `mountId` (string), +15 optional |
| `mounts-allNamedByApplicationId` | GET | `applicationId` (string) |
| `mounts-listByServiceId` | GET | `serviceType` (string), `serviceId` (string) |

## mysql

| Tool | Method | Parameters |
|------|--------|------------|
| `mysql-create` | POST | `name` (string), `environmentId` (string), `databaseName` (string), `databaseUser` (string), `databasePassword` (string), +5 optional |
| `mysql-one` | GET | `mysqlId` (string) |
| `mysql-start` | POST | `mysqlId` (string) |
| `mysql-stop` | POST | `mysqlId` (string) |
| `mysql-saveExternalPort` | POST | `mysqlId` (string), `externalPort` (number | null) |
| `mysql-deploy` | POST | `mysqlId` (string) |
| `mysql-changeStatus` | POST | `mysqlId` (string), `applicationStatus` ("idle" | "running" | "done" | "error") |
| `mysql-reload` | POST | `mysqlId` (string), `appName` (string) |
| `mysql-remove` | POST | `mysqlId` (string) |
| `mysql-saveEnvironment` | POST | `mysqlId` (string), `env` (string | null) |
| `mysql-update` | POST | `mysqlId` (string), +31 optional |
| `mysql-changePassword` | POST | `mysqlId` (string), `password` (string), `type`? |
| `mysql-move` | POST | `mysqlId` (string), `targetEnvironmentId` (string) |
| `mysql-rebuild` | POST | `mysqlId` (string) |
| `mysql-search` | GET | +8 optional |

## notification

| Tool | Method | Parameters |
|------|--------|------------|
| `notification-createSlack` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `webhookUrl` (string), `channel` (string) |
| `notification-updateSlack` | POST | `notificationId` (string), `slackId` (string), +12 optional |
| `notification-testSlackConnection` | POST | `webhookUrl` (string), `channel` (string) |
| `notification-createTelegram` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `botToken` (string), `chatId` (string), `messageThreadId` (string) |
| `notification-updateTelegram` | POST | `notificationId` (string), `telegramId` (string), +13 optional |
| `notification-testTelegramConnection` | POST | `botToken` (string), `chatId` (string), `messageThreadId` (string) |
| `notification-createDiscord` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `webhookUrl` (string), `decoration` (boolean) |
| `notification-updateDiscord` | POST | `notificationId` (string), `discordId` (string), +12 optional |
| `notification-testDiscordConnection` | POST | `webhookUrl` (string), `decoration`? |
| `notification-createEmail` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `smtpServer` (string), `smtpPort` (number), `username` (string), `password` (string), `fromAddress` (string), `toAddresses` (string[]) |
| `notification-updateEmail` | POST | `notificationId` (string), `emailId` (string), +16 optional |
| `notification-testEmailConnection` | POST | `smtpServer` (string), `smtpPort` (number), `username` (string), `password` (string), `toAddresses` (string[]), `fromAddress` (string) |
| `notification-createResend` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `apiKey` (string), `fromAddress` (string), `toAddresses` (string[]) |
| `notification-updateResend` | POST | `notificationId` (string), `resendId` (string), +13 optional |
| `notification-testResendConnection` | POST | `apiKey` (string), `fromAddress` (string), `toAddresses` (string[]) |
| `notification-remove` | POST | `notificationId` (string) |
| `notification-one` | GET | `notificationId` (string) |
| `notification-all` | GET | None |
| `notification-receiveNotification` | POST | `Type` ("Memory" | "CPU"), `Value` (number), `Threshold` (number), `Message` (string), `Timestamp` (string), `Token` (string), `ServerType`? |
| `notification-createGotify` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverUrl` (string), `appToken` (string), `priority` (number), `decoration` (boolean) |
| `notification-updateGotify` | POST | `notificationId` (string), `gotifyId` (string), +13 optional |
| `notification-testGotifyConnection` | POST | `serverUrl` (string), `appToken` (string), `priority` (number), `decoration`? |
| `notification-createNtfy` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverUrl` (string), `topic` (string), `accessToken` (string), `priority` (number) |
| `notification-updateNtfy` | POST | `notificationId` (string), `ntfyId` (string), +13 optional |
| `notification-testNtfyConnection` | POST | `serverUrl` (string), `topic` (string), `accessToken` (string), `priority` (number) |
| `notification-createMattermost` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `webhookUrl` (string), `channel`?, `username`? |
| `notification-updateMattermost` | POST | `notificationId` (string), `mattermostId` (string), +13 optional |
| `notification-testMattermostConnection` | POST | `webhookUrl` (string), `channel`?, `username`? |
| `notification-createCustom` | POST | `name` (string), `endpoint` (string), +9 optional |
| `notification-updateCustom` | POST | `notificationId` (string), `customId` (string), +12 optional |
| `notification-testCustomConnection` | POST | `endpoint` (string), `headers`? |
| `notification-createLark` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `webhookUrl` (string) |
| `notification-updateLark` | POST | `notificationId` (string), `larkId` (string), +11 optional |
| `notification-testLarkConnection` | POST | `webhookUrl` (string) |
| `notification-createTeams` | POST | `appBuildError` (boolean), `databaseBackup` (boolean), `dokployBackup` (boolean), `volumeBackup` (boolean), `dokployRestart` (boolean), `name` (string), `appDeploy` (boolean), `dockerCleanup` (boolean), `serverThreshold` (boolean), `webhookUrl` (string) |
| `notification-updateTeams` | POST | `notificationId` (string), `teamsId` (string), +11 optional |
| `notification-testTeamsConnection` | POST | `webhookUrl` (string) |
| `notification-createPushover` | POST | `name` (string), `userKey` (string), `apiToken` (string), +11 optional |
| `notification-updatePushover` | POST | `notificationId` (string), `pushoverId` (string), +15 optional |
| `notification-testPushoverConnection` | POST | `userKey` (string), `apiToken` (string), `priority` (number), `retry`?, `expire`? |
| `notification-getEmailProviders` | GET | None |

## organization

| Tool | Method | Parameters |
|------|--------|------------|
| `organization-create` | POST | `name` (string), `logo`? |
| `organization-all` | GET | None |
| `organization-one` | GET | `organizationId` (string) |
| `organization-update` | POST | `organizationId` (string), `name` (string), `logo`? |
| `organization-delete` | POST | `organizationId` (string) |
| `organization-inviteMember` | POST | `email` (string), `role` (string) |
| `organization-allInvitations` | GET | None |
| `organization-removeInvitation` | POST | `invitationId` (string) |
| `organization-updateMemberRole` | POST | `memberId` (string), `role` (string) |
| `organization-setDefault` | POST | `organizationId` (string) |
| `organization-active` | GET | None |

## patch

| Tool | Method | Parameters |
|------|--------|------------|
| `patch-create` | POST | `filePath` (string), `content` (string), +4 optional |
| `patch-one` | GET | `patchId` (string) |
| `patch-byEntityId` | GET | `id` (string), `type` ("application" | "compose") |
| `patch-update` | POST | `patchId` (string), +6 optional |
| `patch-delete` | POST | `patchId` (string) |
| `patch-toggleEnabled` | POST | `patchId` (string), `enabled` (boolean) |
| `patch-ensureRepo` | POST | `id` (string), `type` ("application" | "compose") |
| `patch-readRepoDirectories` | GET | `id` (string), `type` ("application" | "compose"), `repoPath` (string) |
| `patch-readRepoFile` | GET | `id` (string), `type` ("application" | "compose"), `filePath` (string) |
| `patch-saveFileAsPatch` | POST | `id` (string), `type` ("application" | "compose"), `filePath` (string), `content` (string), `patchType`? |
| `patch-markFileForDeletion` | POST | `id` (string), `type` ("application" | "compose"), `filePath` (string) |
| `patch-cleanPatchRepos` | POST | `serverId`? |

## port

| Tool | Method | Parameters |
|------|--------|------------|
| `port-create` | POST | `publishedPort` (number), `publishMode` ("ingress" | "host"), `targetPort` (number), `protocol` ("tcp" | "udp"), `applicationId` (string) |
| `port-one` | GET | `portId` (string) |
| `port-delete` | POST | `portId` (string) |
| `port-update` | POST | `portId` (string), `publishedPort` (number), `publishMode` ("ingress" | "host"), `targetPort` (number), `protocol` ("tcp" | "udp") |

## postgres

| Tool | Method | Parameters |
|------|--------|------------|
| `postgres-create` | POST | `name` (string), `databaseName` (string), `databaseUser` (string), `databasePassword` (string), `environmentId` (string), +4 optional |
| `postgres-one` | GET | `postgresId` (string) |
| `postgres-start` | POST | `postgresId` (string) |
| `postgres-stop` | POST | `postgresId` (string) |
| `postgres-saveExternalPort` | POST | `postgresId` (string), `externalPort` (number | null) |
| `postgres-deploy` | POST | `postgresId` (string) |
| `postgres-changeStatus` | POST | `postgresId` (string), `applicationStatus` ("idle" | "running" | "done" | "error") |
| `postgres-remove` | POST | `postgresId` (string) |
| `postgres-saveEnvironment` | POST | `postgresId` (string), `env` (string | null) |
| `postgres-reload` | POST | `postgresId` (string), `appName` (string) |
| `postgres-update` | POST | `postgresId` (string), +30 optional |
| `postgres-changePassword` | POST | `postgresId` (string), `password` (string) |
| `postgres-move` | POST | `postgresId` (string), `targetEnvironmentId` (string) |
| `postgres-rebuild` | POST | `postgresId` (string) |
| `postgres-search` | GET | +8 optional |

## previewDeployment

| Tool | Method | Parameters |
|------|--------|------------|
| `previewDeployment-all` | GET | `applicationId` (string) |
| `previewDeployment-one` | GET | `previewDeploymentId` (string) |
| `previewDeployment-delete` | POST | `previewDeploymentId` (string) |
| `previewDeployment-redeploy` | POST | `previewDeploymentId` (string), `title`?, `description`? |

## project

| Tool | Method | Parameters |
|------|--------|------------|
| `project-create` | POST | `name` (string), `description`?, `env`? |
| `project-one` | GET | `projectId` (string) |
| `project-all` | GET | None |
| `project-allForPermissions` | GET | None |
| `project-search` | GET | +5 optional |
| `project-remove` | POST | `projectId` (string) |
| `project-update` | POST | `projectId` (string), +5 optional |
| `project-duplicate` | POST | `sourceEnvironmentId` (string), `name` (string), +4 optional |

## redirects

| Tool | Method | Parameters |
|------|--------|------------|
| `redirects-create` | POST | `regex` (string), `replacement` (string), `permanent` (boolean), `applicationId` (string) |
| `redirects-one` | GET | `redirectId` (string) |
| `redirects-delete` | POST | `redirectId` (string) |
| `redirects-update` | POST | `redirectId` (string), `regex` (string), `replacement` (string), `permanent` (boolean) |

## redis

| Tool | Method | Parameters |
|------|--------|------------|
| `redis-create` | POST | `name` (string), `databasePassword` (string), `environmentId` (string), +4 optional |
| `redis-one` | GET | `redisId` (string) |
| `redis-start` | POST | `redisId` (string) |
| `redis-reload` | POST | `redisId` (string), `appName` (string) |
| `redis-stop` | POST | `redisId` (string) |
| `redis-saveExternalPort` | POST | `redisId` (string), `externalPort` (number | null) |
| `redis-deploy` | POST | `redisId` (string) |
| `redis-changeStatus` | POST | `redisId` (string), `applicationStatus` ("idle" | "running" | "done" | "error") |
| `redis-remove` | POST | `redisId` (string) |
| `redis-saveEnvironment` | POST | `redisId` (string), `env` (string | null) |
| `redis-update` | POST | `redisId` (string), +28 optional |
| `redis-changePassword` | POST | `redisId` (string), `password` (string) |
| `redis-move` | POST | `redisId` (string), `targetEnvironmentId` (string) |
| `redis-rebuild` | POST | `redisId` (string) |
| `redis-search` | GET | +8 optional |

## registry

| Tool | Method | Parameters |
|------|--------|------------|
| `registry-create` | POST | `registryName` (string), `username` (string), `password` (string), `registryUrl` (string), `registryType` ("cloud"), `imagePrefix` (string | null), `serverId`? |
| `registry-remove` | POST | `registryId` (string) |
| `registry-update` | POST | `registryId` (string), +9 optional |
| `registry-all` | GET | None |
| `registry-one` | GET | `registryId` (string) |
| `registry-testRegistry` | POST | `username` (string), `password` (string), `registryUrl` (string), `registryType` ("cloud"), `registryName`?, `imagePrefix`?, `serverId`? |
| `registry-testRegistryById` | POST | `registryId`?, `serverId`? |

## rollback

| Tool | Method | Parameters |
|------|--------|------------|
| `rollback-delete` | POST | `rollbackId` (string) |
| `rollback-rollback` | POST | `rollbackId` (string) |

## schedule

| Tool | Method | Parameters |
|------|--------|------------|
| `schedule-create` | POST | `name` (string), `cronExpression` (string), `command` (string), +13 optional |
| `schedule-update` | POST | `scheduleId` (string), `name` (string), `cronExpression` (string), `command` (string), +12 optional |
| `schedule-delete` | POST | `scheduleId` (string) |
| `schedule-list` | GET | `id` (string), `scheduleType` ("application" | "compose" | "server" | "dokploy-server") |
| `schedule-one` | GET | `scheduleId` (string) |
| `schedule-runManually` | POST | `scheduleId` (string) |

## security

| Tool | Method | Parameters |
|------|--------|------------|
| `security-create` | POST | `applicationId` (string), `username` (string), `password` (string) |
| `security-one` | GET | `securityId` (string) |
| `security-delete` | POST | `securityId` (string) |
| `security-update` | POST | `securityId` (string), `username` (string), `password` (string) |

## server

| Tool | Method | Parameters |
|------|--------|------------|
| `server-create` | POST | `name` (string), `description` (string | null), `ipAddress` (string), `port` (number), `username` (string), `sshKeyId` (string | null), `serverType` ("deploy" | "build") |
| `server-one` | GET | `serverId` (string) |
| `server-getDefaultCommand` | GET | `serverId` (string) |
| `server-all` | GET | None |
| `server-allForPermissions` | GET | None |
| `server-count` | GET | None |
| `server-withSSHKey` | GET | None |
| `server-buildServers` | GET | None |
| `server-setup` | POST | `serverId` (string) |
| `server-validate` | GET | `serverId` (string) |
| `server-security` | GET | `serverId` (string) |
| `server-setupMonitoring` | POST | `serverId` (string), `metricsConfig` (object) |
| `server-remove` | POST | `serverId` (string) |
| `server-update` | POST | `name` (string), `description` (string | null), `serverId` (string), `ipAddress` (string), `port` (number), `username` (string), `sshKeyId` (string | null), `serverType` ("deploy" | "build"), `command`? |
| `server-publicIp` | GET | None |
| `server-getServerTime` | GET | None |
| `server-getServerMetrics` | GET | `url` (string), `token` (string), `dataPoints` (string) |

## settings

| Tool | Method | Parameters |
|------|--------|------------|
| `settings-getWebServerSettings` | GET | None |
| `settings-reloadServer` | POST | None |
| `settings-cleanRedis` | POST | None |
| `settings-reloadRedis` | POST | None |
| `settings-cleanAllDeploymentQueue` | POST | None |
| `settings-reloadTraefik` | POST | `serverId`? |
| `settings-toggleDashboard` | POST | `enableDashboard`?, `serverId`? |
| `settings-cleanUnusedImages` | POST | `serverId`? |
| `settings-cleanUnusedVolumes` | POST | `serverId`? |
| `settings-cleanStoppedContainers` | POST | `serverId`? |
| `settings-cleanDockerBuilder` | POST | `serverId`? |
| `settings-cleanDockerPrune` | POST | `serverId`? |
| `settings-cleanAll` | POST | `serverId`? |
| `settings-cleanMonitoring` | POST | None |
| `settings-getDockerDiskUsage` | GET | None |
| `settings-saveSSHPrivateKey` | POST | `sshPrivateKey` (string) |
| `settings-assignDomainServer` | POST | `host` (string), `certificateType` ("letsencrypt" | "none" | "custom"), `letsEncryptEmail`?, `https`? |
| `settings-cleanSSHPrivateKey` | POST | None |
| `settings-updateDockerCleanup` | POST | `enableDockerCleanup` (boolean), `serverId`? |
| `settings-readTraefikConfig` | GET | None |
| `settings-updateTraefikConfig` | POST | `traefikConfig` (string) |
| `settings-readWebServerTraefikConfig` | GET | None |
| `settings-updateWebServerTraefikConfig` | POST | `traefikConfig` (string) |
| `settings-readMiddlewareTraefikConfig` | GET | None |
| `settings-updateMiddlewareTraefikConfig` | POST | `traefikConfig` (string) |
| `settings-getUpdateData` | POST | None |
| `settings-updateServer` | POST | None |
| `settings-getDokployVersion` | GET | None |
| `settings-getReleaseTag` | GET | None |
| `settings-readDirectories` | GET | `serverId`? |
| `settings-updateTraefikFile` | POST | `path` (string), `traefikConfig` (string), `serverId`? |
| `settings-readTraefikFile` | GET | `path` (string), `serverId`? |
| `settings-getIp` | GET | None |
| `settings-updateServerIp` | POST | `serverIp` (string) |
| `settings-getOpenApiDocument` | GET | None |
| `settings-readTraefikEnv` | GET | `serverId`? |
| `settings-writeTraefikEnv` | POST | `env` (string), `serverId`? |
| `settings-haveTraefikDashboardPortEnabled` | GET | `serverId`? |
| `settings-haveActivateRequests` | GET | None |
| `settings-toggleRequests` | POST | `enable` (boolean) |
| `settings-isCloud` | GET | None |
| `settings-isUserSubscribed` | GET | None |
| `settings-health` | GET | None |
| `settings-checkInfrastructureHealth` | GET | None |
| `settings-setupGPU` | POST | `serverId`? |
| `settings-checkGPUStatus` | GET | `serverId`? |
| `settings-updateTraefikPorts` | POST | `additionalPorts` (object[]), `serverId`? |
| `settings-getTraefikPorts` | GET | `serverId`? |
| `settings-updateLogCleanup` | POST | `cronExpression` (string | null) |
| `settings-getLogCleanupStatus` | GET | None |
| `settings-getDokployCloudIps` | GET | None |

## sshKey

| Tool | Method | Parameters |
|------|--------|------------|
| `sshKey-create` | POST | `name` (string), `privateKey` (string), `publicKey` (string), `organizationId` (string), `description`? |
| `sshKey-remove` | POST | `sshKeyId` (string) |
| `sshKey-one` | GET | `sshKeyId` (string) |
| `sshKey-all` | GET | None |
| `sshKey-allForApps` | GET | None |
| `sshKey-generate` | POST | `type`? |
| `sshKey-update` | POST | `sshKeyId` (string), `name`?, `description`?, `lastUsedAt`? |

## sso

| Tool | Method | Parameters |
|------|--------|------------|
| `sso-showSignInWithSSO` | GET | None |
| `sso-listProviders` | GET | None |
| `sso-getTrustedOrigins` | GET | None |
| `sso-one` | GET | `providerId` (string) |
| `sso-update` | POST | `providerId` (string), `issuer` (string), `domains` (string[]), +4 optional |
| `sso-deleteProvider` | POST | `providerId` (string) |
| `sso-register` | POST | `providerId` (string), `issuer` (string), `domains` (string[]), +4 optional |
| `sso-addTrustedOrigin` | POST | `origin` (string) |
| `sso-removeTrustedOrigin` | POST | `origin` (string) |
| `sso-updateTrustedOrigin` | POST | `oldOrigin` (string), `newOrigin` (string) |

## stripe

| Tool | Method | Parameters |
|------|--------|------------|
| `stripe-getCurrentPlan` | GET | None |
| `stripe-getProducts` | GET | None |
| `stripe-createCheckoutSession` | POST | `tier` ("legacy" | "hobby" | "startup"), `productId` (string), `serverQuantity` (number), `isAnnual` (boolean) |
| `stripe-createCustomerPortalSession` | POST | None |
| `stripe-upgradeSubscription` | POST | `tier` ("hobby" | "startup"), `serverQuantity` (number), `isAnnual` (boolean) |
| `stripe-canCreateMoreServers` | GET | None |
| `stripe-getInvoices` | GET | None |

## swarm

| Tool | Method | Parameters |
|------|--------|------------|
| `swarm-getNodes` | GET | `serverId`? |
| `swarm-getNodeInfo` | GET | `nodeId` (string), `serverId`? |
| `swarm-getNodeApps` | GET | `serverId`? |
| `swarm-getContainerStats` | GET | `serverId`? |

## tag

| Tool | Method | Parameters |
|------|--------|------------|
| `tag-create` | POST | `name` (string), `color`? |
| `tag-all` | GET | None |
| `tag-one` | GET | `tagId` (string) |
| `tag-update` | POST | `tagId` (string), +4 optional |
| `tag-remove` | POST | `tagId` (string) |
| `tag-assignToProject` | POST | `projectId` (string), `tagId` (string) |
| `tag-removeFromProject` | POST | `projectId` (string), `tagId` (string) |
| `tag-bulkAssign` | POST | `projectId` (string), `tagIds` (string[]) |

## user

| Tool | Method | Parameters |
|------|--------|------------|
| `user-all` | GET | None |
| `user-one` | GET | `userId` (string) |
| `user-session` | GET | None |
| `user-get` | GET | None |
| `user-getPermissions` | GET | None |
| `user-haveRootAccess` | GET | None |
| `user-getBackups` | GET | None |
| `user-getServerMetrics` | GET | None |
| `user-update` | POST | +24 optional |
| `user-getUserByToken` | GET | `token` (string) |
| `user-getMetricsToken` | GET | None |
| `user-remove` | POST | `userId` (string) |
| `user-assignPermissions` | POST | `id` (string), `accessedProjects` (string[]), `accessedEnvironments` (string[]), `accessedServices` (string[]), `accessedGitProviders` (string[]), `accessedServers` (string[]), `canCreateProjects` (boolean), `canCreateServices` (boolean), `canDeleteProjects` (boolean), `canDeleteServices` (boolean), `canAccessToDocker` (boolean), `canAccessToTraefikFiles` (boolean), `canAccessToAPI` (boolean), `canAccessToSSHKeys` (boolean), `canAccessToGitProviders` (boolean), `canDeleteEnvironments` (boolean), `canCreateEnvironments` (boolean) |
| `user-getInvitations` | GET | None |
| `user-getContainerMetrics` | GET | `url` (string), `token` (string), `appName` (string), `dataPoints` (string) |
| `user-generateToken` | POST | None |
| `user-deleteApiKey` | POST | `apiKeyId` (string) |
| `user-createApiKey` | POST | `name` (string), `metadata` (object), +8 optional |
| `user-checkUserOrganizations` | GET | `userId` (string) |
| `user-createUserWithCredentials` | POST | `email` (string), `password` (string), `role` (string) |
| `user-sendInvitation` | POST | `invitationId` (string), `notificationId` (string) |
| `user-getBookmarkedTemplates` | GET | None |
| `user-toggleTemplateBookmark` | POST | `templateId` (string) |

## volumeBackups

| Tool | Method | Parameters |
|------|--------|------------|
| `volumeBackups-list` | GET | `id` (string), `volumeBackupType` ("application" | "postgres" | "mysql" | "mariadb" | "mongo" | "redis" | "compose" | "libsql") |
| `volumeBackups-create` | POST | `name` (string), `volumeName` (string), `prefix` (string), `cronExpression` (string), `destinationId` (string), +15 optional |
| `volumeBackups-one` | GET | `volumeBackupId` (string) |
| `volumeBackups-delete` | POST | `volumeBackupId` (string) |
| `volumeBackups-update` | POST | `name` (string), `volumeName` (string), `prefix` (string), `cronExpression` (string), `destinationId` (string), `volumeBackupId` (string), +15 optional |
| `volumeBackups-runManually` | POST | `volumeBackupId` (string) |

## whitelabeling

| Tool | Method | Parameters |
|------|--------|------------|
| `whitelabeling-get` | GET | None |
| `whitelabeling-update` | POST | `whitelabelingConfig` (object) |
| `whitelabeling-reset` | POST | None |
| `whitelabeling-getPublic` | GET | None |

## Annotations

All tools include semantic annotations to help MCP clients understand their behavior:

- **readOnlyHint**: GET endpoints that only retrieve data
- **destructiveHint**: Operations that delete or remove resources
- **idempotentHint**: Safe to repeat without side effects
- **openWorldHint**: All tools interact with the external Dokploy API
