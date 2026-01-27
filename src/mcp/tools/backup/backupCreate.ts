import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const backupCreate = createTool({
  name: "backup-create",
  description:
    "Creates a new backup configuration for a database or compose service in Dokploy. Supports PostgreSQL, MySQL, MariaDB, MongoDB, and web server backups.",
  schema: z.object({
    schedule: z
      .string()
      .describe("Cron schedule expression for automated backups (e.g., '0 2 * * *' for daily at 2 AM)."),
    enabled: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether the backup schedule is enabled. Defaults to true if not specified."),
    prefix: z
      .string()
      .min(1)
      .describe("Prefix for backup file names. Used to identify and organize backup files."),
    destinationId: z
      .string()
      .describe("ID of the backup destination (S3, local storage, etc.) where backups will be stored."),
    keepLatestCount: z
      .number()
      .nullable()
      .optional()
      .describe("Number of most recent backups to retain. Older backups are automatically deleted."),
    database: z
      .string()
      .min(1)
      .describe("Name of the database to backup. Must match the database name in the service."),
    mariadbId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the MariaDB service. Required when databaseType is 'mariadb'."),
    mysqlId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the MySQL service. Required when databaseType is 'mysql'."),
    postgresId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the PostgreSQL service. Required when databaseType is 'postgres'."),
    mongoId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the MongoDB service. Required when databaseType is 'mongo'."),
    databaseType: z
      .enum(["postgres", "mariadb", "mysql", "mongo", "web-server"])
      .describe(
        "Type of database to backup: 'postgres', 'mariadb', 'mysql', 'mongo', or 'web-server'.",
      ),
    userId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the user who owns this backup configuration."),
    backupType: z
      .enum(["database", "compose"])
      .optional()
      .describe("Type of backup: 'database' for standalone databases, 'compose' for compose service databases."),
    composeId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the compose deployment. Required when backupType is 'compose'."),
    serviceName: z
      .string()
      .nullable()
      .optional()
      .describe("Name of the service within the compose deployment to backup."),
    metadata: z
      .unknown()
      .nullable()
      .optional()
      .describe("Additional metadata to associate with the backup configuration."),
  }),
  annotations: {
    title: "Create Backup",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/backup.create", input);

    return ResponseFormatter.success(
      `Backup configuration created successfully`,
      response.data,
    );
  },
});
