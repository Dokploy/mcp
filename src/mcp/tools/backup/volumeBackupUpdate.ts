import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const volumeBackupUpdate = createTool({
  name: "volume-backup-update",
  description:
    "Updates an existing volume backup configuration in Dokploy. Allows modifying schedule, destination, retention settings, and other backup parameters.",
  schema: z.object({
    volumeBackupId: z
      .string()
      .min(1)
      .describe("The unique ID of the volume backup configuration to update."),
    name: z
      .string()
      .describe("Descriptive name for the volume backup configuration."),
    volumeName: z
      .string()
      .describe("Name of the Docker volume to backup."),
    prefix: z
      .string()
      .describe("Prefix for backup file names. Used to identify and organize backup files."),
    cronExpression: z
      .string()
      .describe("Cron expression for scheduling backups (e.g., '0 2 * * *' for daily at 2 AM)."),
    destinationId: z
      .string()
      .describe("ID of the backup destination (S3, local storage, etc.) where backups will be stored."),
    serviceType: z
      .enum([
        "application",
        "postgres",
        "mysql",
        "mariadb",
        "mongo",
        "redis",
        "compose",
      ])
      .optional()
      .describe("Type of the service that owns the volume."),
    appName: z
      .string()
      .optional()
      .describe("Name of the application (used for labeling and identification)."),
    serviceName: z
      .string()
      .nullable()
      .optional()
      .describe("Name of the service within a compose deployment."),
    turnOff: z
      .boolean()
      .optional()
      .describe("Whether to stop the service during backup to ensure data consistency."),
    keepLatestCount: z
      .number()
      .nullable()
      .optional()
      .describe("Number of most recent backups to retain. Older backups are automatically deleted."),
    enabled: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether the backup schedule is enabled."),
    applicationId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the application. Required when serviceType is 'application'."),
    postgresId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the PostgreSQL service. Required when serviceType is 'postgres'."),
    mariadbId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the MariaDB service. Required when serviceType is 'mariadb'."),
    mongoId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the MongoDB service. Required when serviceType is 'mongo'."),
    mysqlId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the MySQL service. Required when serviceType is 'mysql'."),
    redisId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the Redis service. Required when serviceType is 'redis'."),
    composeId: z
      .string()
      .nullable()
      .optional()
      .describe("ID of the compose deployment. Required when serviceType is 'compose'."),
    createdAt: z
      .string()
      .optional()
      .describe("Creation timestamp."),
  }),
  annotations: {
    title: "Update Volume Backup",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/volumeBackups.update", input);

    return ResponseFormatter.success(
      `Volume backup "${input.volumeBackupId}" updated successfully`,
      response.data,
    );
  },
});
