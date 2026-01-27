import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const backupListFiles = createTool({
  name: "backup-list-files",
  description:
    "Lists backup files stored at a specific destination. Allows searching and filtering backup files by name or prefix.",
  schema: z.object({
    destinationId: z
      .string()
      .describe("The ID of the backup destination to list files from."),
    search: z
      .string()
      .describe("Search string to filter backup files by name or prefix."),
    serverId: z
      .string()
      .optional()
      .describe("Server ID to filter backups for multi-server deployments."),
  }),
  annotations: {
    title: "List Backup Files",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    let url = `/backup.listBackupFiles?destinationId=${encodeURIComponent(input.destinationId)}&search=${encodeURIComponent(input.search)}`;
    if (input.serverId) {
      url += `&serverId=${encodeURIComponent(input.serverId)}`;
    }

    const backups = await apiClient.get(url);

    if (!backups?.data) {
      return ResponseFormatter.error(
        "Failed to fetch backup files",
        "No backup files found",
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched backup files`,
      backups.data,
    );
  },
});
