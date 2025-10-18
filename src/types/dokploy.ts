// Basic types for Dokploy API responses
// These are minimal interfaces to avoid 'any' usage while maintaining flexibility

export interface DokployProject {
  projectId: string;
  name: string;
  description?: string | null;
  createdAt: string;
  organizationId: string;
  env?: string;
  environments?: DokployEnvironment[];
  // Legacy fields for backward compatibility
  applications?: DokployApplication[];
  postgres?: DokployPostgres[];
  mysql?: DokployMysql[];
  mariadb?: DokployMariadb[];
  mongo?: DokployMongo[];
  redis?: DokployRedis[];
  compose?: DokployCompose[];
  [key: string]: unknown; // Allow additional properties
}

export interface DokployEnvironment {
  environmentId: string;
  name: string;
  description?: string | null;
  createdAt: string;
  env?: string;
  projectId: string;
  applications?: DokployApplication[];
  postgres?: DokployPostgres[];
  mysql?: DokployMysql[];
  mariadb?: DokployMariadb[];
  mongo?: DokployMongo[];
  redis?: DokployRedis[];
  compose?: DokployCompose[];
  [key: string]: unknown; // Allow additional properties
}

export interface DokployApplication {
  applicationId: string;
  name: string;
  appName: string;
  applicationStatus: string;
  sourceType: string;
  buildType: string;
  repository?: string | null;
  branch?: string | null;
  domains?: { length?: number }[];
  [key: string]: unknown; // Allow additional properties
}

export interface DokployPostgres {
  postgresId: string;
  name: string;
  appName: string;
  applicationStatus: string;
  databaseName: string;
  [key: string]: unknown; // Allow additional properties
}

export interface DokployCompose {
  composeId: string;
  name: string;
  appName: string;
  composeStatus: string;
  sourceType: string;
  repository?: string | null;
  branch?: string | null;
  domains?: { length?: number }[];
  [key: string]: unknown; // Allow additional properties
}

export interface DokployMysql {
  mysqlId: string;
  name: string;
  appName: string;
  applicationStatus: string;
  databaseName: string;
  [key: string]: unknown; // Allow additional properties
}

export interface DokployMariadb {
  mariadbId: string;
  name: string;
  appName: string;
  applicationStatus: string;
  databaseName: string;
  [key: string]: unknown; // Allow additional properties
}

export interface DokployMongo {
  mongoId: string;
  name: string;
  appName: string;
  applicationStatus: string;
  databaseName: string;
  [key: string]: unknown; // Allow additional properties
}

export interface DokployRedis {
  redisId: string;
  name: string;
  appName: string;
  applicationStatus: string;
  [key: string]: unknown; // Allow additional properties
}

// Utility type for external API responses where we can't guarantee full typing
export type ExternalApiResponse<T = Record<string, unknown>> = T & {
  [key: string]: unknown;
};

// Type for completely unknown API responses
export type UnknownApiData = Record<string, unknown>;
