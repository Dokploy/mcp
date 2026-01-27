import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const backupUpdate = createTool({
  name: "backup-update",
  description:
    "Updates an existing backup configuration in Dokploy. Allows modifying schedule, destination, retention settings, and other backup parameters.",
  schema: z.object({
    backupId: z
      .string()
      .describe("The unique ID of the backup configuration to update."),
    schedule: z
      .string()
      .describe("Cron schedule expression for automated backups (e.g., '0 2 * * *' for daily at 2 AM)."),
    enabled: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether the backup schedule is enabled."),
    prefix: z
      .string()
      .min(1)
      .describe("Prefix for backup file names. Used to identify and organize backup files."),
    destinationId: z
      .string()
      .describe("ID of the backup destination (S3, local storage, etc.) where backups will be stored."),
    database: z
      .string()
      .min(1)
      .describe("Name of the database to backup. Must match the database name in the service."),
    keepLatestCount: z
      .number()
      .nullable()
      .optional()
      .describe("Number of most recent backups to retain. Older backups are automatically deleted."),
    serviceName: z
      .string()
      .nullable()
      .describe("Name of the service within the compose deployment. Required for compose backups."),
    metadata: z
      .unknown()
      .nullable()
      .optional()
      .describe("Additional metadata to associate with the backup configuration."),
    databaseType: z
      .enum(["postgres", "mariadb", "mysql", "mongo", "web-server"])
      .describe(
        "Type of database to backup: 'postgres', 'mariadb', 'mysql', 'mongo', or 'web-server'.",
      ),
  }),
  annotations: {
    title: "Update Backup",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/backup.update", input);

    return ResponseFormatter.success(
      `Backup "${input.backupId}" updated successfully`,
      response.data,
    );
  },
});
