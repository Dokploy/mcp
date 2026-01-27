import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const volumeBackupList = createTool({
  name: "volume-backup-list",
  description:
    "Lists all volume backup configurations for a specific resource in Dokploy. Filter by resource ID and type.",
  schema: z.object({
    id: z
      .string()
      .min(1)
      .describe("The ID of the resource (application, database, or compose deployment) to list volume backups for."),
    volumeBackupType: z
      .enum([
        "application",
        "postgres",
        "mysql",
        "mariadb",
        "mongo",
        "redis",
        "compose",
      ])
      .describe("The type of resource: 'application', 'postgres', 'mysql', 'mariadb', 'mongo', 'redis', or 'compose'."),
  }),
  annotations: {
    title: "List Volume Backups",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const volumeBackups = await apiClient.get(
      `/volumeBackups.list?id=${encodeURIComponent(input.id)}&volumeBackupType=${encodeURIComponent(input.volumeBackupType)}`,
    );

    if (!volumeBackups?.data) {
      return ResponseFormatter.error(
        "Failed to fetch volume backups",
        "No volume backups found",
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched volume backups`,
      volumeBackups.data,
    );
  },
});
