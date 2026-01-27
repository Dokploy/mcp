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

const defaultImages: Record<DbType, string> = {
  postgres: "postgres:15",
  mysql: "mysql:8",
  mongo: "mongo:15",
  mariadb: "mariadb:6",
  redis: "redis:8",
};

const passwordRegex = /^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/;

export const databaseCreate = createTool({
  name: "database-create",
  description:
    "Creates a new database in Dokploy. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis. Each database type has different required fields - see parameter descriptions for details.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type to create"),
    name: z
      .string()
      .min(1)
      .describe("Display name for the database in Dokploy"),
    appName: z
      .string()
      .min(1)
      .describe("Application identifier used for container naming"),
    environmentId: z
      .string()
      .describe("ID of the environment where the database will be created"),
    // Required for postgres, mysql, mariadb - not used for mongo or redis
    databaseName: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Name of the database to create inside the instance (required for postgres, mysql, mariadb)"
      ),
    // Required for postgres, mysql, mongo, mariadb - not used for redis
    databaseUser: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Username for database access (required for postgres, mysql, mongo, mariadb)"
      ),
    // Required for all database types
    databasePassword: z
      .string()
      .regex(passwordRegex, "Password contains invalid characters")
      .describe(
        "Password for database access (required for all database types)"
      ),
    // Required for mysql, mariadb only
    databaseRootPassword: z
      .string()
      .regex(passwordRegex, "Root password contains invalid characters")
      .optional()
      .describe("Root password for administrative access (required for mysql, mariadb)"),
    // MongoDB specific - optional with default false
    replicaSets: z
      .boolean()
      .nullable()
      .optional()
      .default(false)
      .describe("Enable MongoDB replica sets for high availability (MongoDB only)"),
    dockerImage: z
      .string()
      .optional()
      .describe("Docker image to use (defaults vary by database type)"),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("Optional description for the database"),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the server where the database will be deployed (null for default server)"),
  }),
  annotations: {
    title: "Create Database",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, ...rest } = input;
    const label = dbTypeLabels[dbType];

    // Build the request payload based on database type
    const payload: Record<string, unknown> = {
      name: rest.name,
      appName: rest.appName,
      environmentId: rest.environmentId,
      dockerImage: rest.dockerImage || defaultImages[dbType],
      description: rest.description,
      serverId: rest.serverId,
    };

    // Add type-specific fields
    if (dbType === "postgres") {
      payload.databaseName = rest.databaseName;
      payload.databaseUser = rest.databaseUser;
      payload.databasePassword = rest.databasePassword;
    }

    if (dbType === "mysql" || dbType === "mariadb") {
      payload.databaseName = rest.databaseName;
      payload.databaseUser = rest.databaseUser;
      payload.databasePassword = rest.databasePassword;
      payload.databaseRootPassword = rest.databaseRootPassword;
    }

    if (dbType === "mongo") {
      payload.databaseUser = rest.databaseUser;
      payload.databasePassword = rest.databasePassword;
      payload.replicaSets = rest.replicaSets;
    }

    if (dbType === "redis") {
      payload.databasePassword = rest.databasePassword;
    }

    const response = await apiClient.post(`/${dbType}.create`, payload);

    return ResponseFormatter.success(
      `${label} database "${input.name}" created successfully`,
      response.data
    );
  },
});
