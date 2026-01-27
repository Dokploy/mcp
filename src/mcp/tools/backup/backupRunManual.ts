import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const backupTypeEnum = z.enum([
  "postgres",
  "mysql",
  "mariadb",
  "mongo",
  "compose",
  "webServer",
]);

type BackupType = z.infer<typeof backupTypeEnum>;

const endpointMap: Record<BackupType, string> = {
  postgres: "/backup.manualBackupPostgres",
  mysql: "/backup.manualBackupMySql",
  mariadb: "/backup.manualBackupMariadb",
  mongo: "/backup.manualBackupMongo",
  compose: "/backup.manualBackupCompose",
  webServer: "/backup.manualBackupWebServer",
};

const typeLabels: Record<BackupType, string> = {
  postgres: "PostgreSQL",
  mysql: "MySQL",
  mariadb: "MariaDB",
  mongo: "MongoDB",
  compose: "Compose",
  webServer: "Web Server",
};

export const backupRunManual = createTool({
  name: "backup-run-manual",
  description:
    "Triggers an immediate manual backup using an existing backup configuration. Runs the backup outside of the scheduled cron time. Supports PostgreSQL, MySQL, MariaDB, MongoDB, Compose, and Web Server backups.",
  schema: z.object({
    backupId: z
      .string()
      .describe("The unique ID of the backup configuration to execute."),
    type: backupTypeEnum.describe(
      "The database type for the backup. Must match the backup configuration type: 'postgres', 'mysql', 'mariadb', 'mongo', 'compose', or 'webServer'.",
    ),
  }),
  annotations: {
    title: "Run Manual Backup",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const endpoint = endpointMap[input.type];
    const label = typeLabels[input.type];

    const response = await apiClient.post(endpoint, { backupId: input.backupId });

    return ResponseFormatter.success(
      `Manual ${label} backup triggered successfully for backup "${input.backupId}"`,
      response.data,
    );
  },
});
