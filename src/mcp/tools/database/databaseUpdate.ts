import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const dbTypes = ["postgres", "mysql", "mongo", "mariadb", "redis"] as const;
type DbType = (typeof dbTypes)[number];

const dbTypeLabels: Record<DbType, string> = {
  postgres: "PostgreSQL",
  mysql: "MySQL",
  mongo: "MongoDB",
  mariadb: "MariaDB",
  redis: "Redis",
};

const idParamNames: Record<DbType, string> = {
  postgres: "postgresId",
  mysql: "mysqlId",
  mongo: "mongoId",
  mariadb: "mariadbId",
  redis: "redisId",
};

const defaultImages: Record<DbType, string> = {
  postgres: "postgres:15",
  mysql: "mysql:8",
  mongo: "mongo:15",
  mariadb: "mariadb:6",
  redis: "redis:8",
};

const passwordRegex = /^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/;

// Docker Swarm configuration schemas matching OpenAPI spec
const healthCheckSwarmSchema = z
  .object({
    Test: z.array(z.string()).optional(),
    Interval: z.number().optional(),
    Timeout: z.number().optional(),
    StartPeriod: z.number().optional(),
    Retries: z.number().optional(),
  })
  .nullable()
  .optional()
  .describe("Docker Swarm health check configuration");

const restartPolicySwarmSchema = z
  .object({
    Condition: z.string().optional(),
    Delay: z.number().optional(),
    MaxAttempts: z.number().optional(),
    Window: z.number().optional(),
  })
  .nullable()
  .optional()
  .describe("Docker Swarm restart policy configuration");

const placementSwarmSchema = z
  .object({
    Constraints: z.array(z.string()).optional(),
    Preferences: z
      .array(
        z.object({
          Spread: z.object({
            SpreadDescriptor: z.string(),
          }),
        })
      )
      .optional(),
    MaxReplicas: z.number().optional(),
    Platforms: z
      .array(
        z.object({
          Architecture: z.string(),
          OS: z.string(),
        })
      )
      .optional(),
  })
  .nullable()
  .optional()
  .describe("Docker Swarm placement constraints and preferences");

const updateConfigSwarmSchema = z
  .object({
    Parallelism: z.number(),
    Delay: z.number().optional(),
    FailureAction: z.string().optional(),
    Monitor: z.number().optional(),
    MaxFailureRatio: z.number().optional(),
    Order: z.string(),
  })
  .nullable()
  .optional()
  .describe("Docker Swarm rolling update configuration");

const rollbackConfigSwarmSchema = z
  .object({
    Parallelism: z.number(),
    Delay: z.number().optional(),
    FailureAction: z.string().optional(),
    Monitor: z.number().optional(),
    MaxFailureRatio: z.number().optional(),
    Order: z.string(),
  })
  .nullable()
  .optional()
  .describe("Docker Swarm rollback configuration");

const modeSwarmSchema = z
  .object({
    Replicated: z
      .object({
        Replicas: z.number().optional(),
      })
      .optional(),
    Global: z.object({}).optional(),
    ReplicatedJob: z
      .object({
        MaxConcurrent: z.number().optional(),
        TotalCompletions: z.number().optional(),
      })
      .optional(),
    GlobalJob: z.object({}).optional(),
  })
  .nullable()
  .optional()
  .describe("Docker Swarm service mode (Replicated, Global, ReplicatedJob, GlobalJob)");

const labelsSwarmSchema = z
  .record(z.string())
  .nullable()
  .optional()
  .describe("Docker Swarm service labels as key-value pairs");

const networkSwarmSchema = z
  .array(
    z.object({
      Target: z.string().optional(),
      Aliases: z.array(z.string()).optional(),
      DriverOpts: z.object({}).optional(),
    })
  )
  .nullable()
  .optional()
  .describe("Docker Swarm network attachment configuration");

const endpointSpecSwarmSchema = z
  .object({
    Mode: z.string().optional(),
    Ports: z
      .array(
        z.object({
          Protocol: z.string().optional(),
          TargetPort: z.number().optional(),
          PublishedPort: z.number().optional(),
          PublishMode: z.string().optional(),
        })
      )
      .optional(),
  })
  .nullable()
  .optional()
  .describe("Docker Swarm endpoint specification for port publishing");

export const databaseUpdate = createTool({
  name: "database-update",
  description:
    "Updates an existing database in Dokploy. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis. Only the database ID is required - all other fields are optional.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type"),
    id: z.string().min(1).describe("The database ID to update"),
    // Common fields across all database types
    name: z
      .string()
      .min(1)
      .optional()
      .describe("Display name for the database in Dokploy"),
    appName: z
      .string()
      .min(1)
      .optional()
      .describe("Application identifier used for container naming"),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("Description for the database"),
    dockerImage: z
      .string()
      .optional()
      .describe("Docker image to use for the database"),
    command: z
      .string()
      .nullable()
      .optional()
      .describe("Custom command to run the database container"),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables as a string (KEY=value format, one per line)"),
    memoryReservation: z
      .string()
      .nullable()
      .optional()
      .describe("Memory reservation for the container (e.g., '256m', '1g')"),
    memoryLimit: z
      .string()
      .nullable()
      .optional()
      .describe("Memory limit for the container (e.g., '512m', '2g')"),
    cpuReservation: z
      .string()
      .nullable()
      .optional()
      .describe("CPU reservation for the container (e.g., '0.5', '1')"),
    cpuLimit: z
      .string()
      .nullable()
      .optional()
      .describe("CPU limit for the container (e.g., '1', '2')"),
    externalPort: z
      .number()
      .nullable()
      .optional()
      .describe("External port to expose the database on the host"),
    applicationStatus: z
      .enum(["idle", "running", "done", "error"])
      .optional()
      .describe("Current application status"),
    replicas: z
      .number()
      .optional()
      .describe("Number of container replicas to run"),
    createdAt: z
      .string()
      .optional()
      .describe("Creation timestamp (ISO 8601 format)"),
    environmentId: z
      .string()
      .optional()
      .describe("ID of the environment the database belongs to"),
    // Type-specific fields for postgres, mysql, mariadb
    databaseName: z
      .string()
      .min(1)
      .optional()
      .describe("Database name inside the instance (postgres, mysql, mariadb)"),
    // Type-specific fields for postgres, mysql, mongo, mariadb
    databaseUser: z
      .string()
      .min(1)
      .optional()
      .describe("Database username (postgres, mysql, mongo, mariadb)"),
    databasePassword: z
      .string()
      .regex(passwordRegex, "Password contains invalid characters")
      .optional()
      .describe("Database password"),
    // Type-specific fields for mysql, mariadb
    databaseRootPassword: z
      .string()
      .regex(passwordRegex, "Root password contains invalid characters")
      .optional()
      .describe("Root password (mysql, mariadb only)"),
    // MongoDB specific
    replicaSets: z
      .boolean()
      .nullable()
      .optional()
      .describe("Enable replica sets for high availability (MongoDB only)"),
    // Docker Swarm configurations
    healthCheckSwarm: healthCheckSwarmSchema,
    restartPolicySwarm: restartPolicySwarmSchema,
    placementSwarm: placementSwarmSchema,
    updateConfigSwarm: updateConfigSwarmSchema,
    rollbackConfigSwarm: rollbackConfigSwarmSchema,
    modeSwarm: modeSwarmSchema,
    labelsSwarm: labelsSwarmSchema,
    networkSwarm: networkSwarmSchema,
    stopGracePeriodSwarm: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe("Docker Swarm stop grace period in nanoseconds"),
    endpointSpecSwarm: endpointSpecSwarmSchema,
  }),
  annotations: {
    title: "Update Database",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id, ...rest } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    // Build payload with the correct ID parameter name
    const payload: Record<string, unknown> = {
      [idParam]: id,
    };

    // Add common fields if provided
    if (rest.name !== undefined) payload.name = rest.name;
    if (rest.appName !== undefined) payload.appName = rest.appName;
    if (rest.description !== undefined) payload.description = rest.description;
    if (rest.dockerImage !== undefined)
      payload.dockerImage = rest.dockerImage || defaultImages[dbType];
    if (rest.command !== undefined) payload.command = rest.command;
    if (rest.env !== undefined) payload.env = rest.env;
    if (rest.memoryReservation !== undefined)
      payload.memoryReservation = rest.memoryReservation;
    if (rest.memoryLimit !== undefined) payload.memoryLimit = rest.memoryLimit;
    if (rest.cpuReservation !== undefined)
      payload.cpuReservation = rest.cpuReservation;
    if (rest.cpuLimit !== undefined) payload.cpuLimit = rest.cpuLimit;
    if (rest.externalPort !== undefined) payload.externalPort = rest.externalPort;
    if (rest.applicationStatus !== undefined)
      payload.applicationStatus = rest.applicationStatus;
    if (rest.replicas !== undefined) payload.replicas = rest.replicas;
    if (rest.createdAt !== undefined) payload.createdAt = rest.createdAt;
    if (rest.environmentId !== undefined)
      payload.environmentId = rest.environmentId;

    // Add type-specific fields
    if (
      dbType === "postgres" ||
      dbType === "mysql" ||
      dbType === "mariadb"
    ) {
      if (rest.databaseName !== undefined)
        payload.databaseName = rest.databaseName;
    }

    if (
      dbType === "postgres" ||
      dbType === "mysql" ||
      dbType === "mongo" ||
      dbType === "mariadb"
    ) {
      if (rest.databaseUser !== undefined)
        payload.databaseUser = rest.databaseUser;
      if (rest.databasePassword !== undefined)
        payload.databasePassword = rest.databasePassword;
    }

    if (dbType === "mysql" || dbType === "mariadb") {
      if (rest.databaseRootPassword !== undefined)
        payload.databaseRootPassword = rest.databaseRootPassword;
    }

    if (dbType === "mongo") {
      if (rest.replicaSets !== undefined) payload.replicaSets = rest.replicaSets;
    }

    if (dbType === "redis") {
      if (rest.databasePassword !== undefined)
        payload.databasePassword = rest.databasePassword;
    }

    // Add Swarm configurations if provided
    if (rest.healthCheckSwarm !== undefined)
      payload.healthCheckSwarm = rest.healthCheckSwarm;
    if (rest.restartPolicySwarm !== undefined)
      payload.restartPolicySwarm = rest.restartPolicySwarm;
    if (rest.placementSwarm !== undefined)
      payload.placementSwarm = rest.placementSwarm;
    if (rest.updateConfigSwarm !== undefined)
      payload.updateConfigSwarm = rest.updateConfigSwarm;
    if (rest.rollbackConfigSwarm !== undefined)
      payload.rollbackConfigSwarm = rest.rollbackConfigSwarm;
    if (rest.modeSwarm !== undefined) payload.modeSwarm = rest.modeSwarm;
    if (rest.labelsSwarm !== undefined) payload.labelsSwarm = rest.labelsSwarm;
    if (rest.networkSwarm !== undefined) payload.networkSwarm = rest.networkSwarm;
    if (rest.stopGracePeriodSwarm !== undefined)
      payload.stopGracePeriodSwarm = rest.stopGracePeriodSwarm;
    if (rest.endpointSpecSwarm !== undefined)
      payload.endpointSpecSwarm = rest.endpointSpecSwarm;

    const response = await apiClient.post(`/${dbType}.update`, payload);

    return ResponseFormatter.success(
      `${label} database "${id}" updated successfully`,
      response.data
    );
  },
});
