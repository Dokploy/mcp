import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const volumeBackupOne = createTool({
  name: "volume-backup-one",
  description:
    "Retrieves details of a specific volume backup configuration by its ID. Returns backup schedule, volume name, destination, and status.",
  schema: z.object({
    volumeBackupId: z
      .string()
      .min(1)
      .describe("The unique ID of the volume backup configuration to retrieve."),
  }),
  annotations: {
    title: "Get Volume Backup Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const volumeBackup = await apiClient.get(
      `/volumeBackups.one?volumeBackupId=${encodeURIComponent(input.volumeBackupId)}`,
    );

    if (!volumeBackup?.data) {
      return ResponseFormatter.error(
        "Failed to fetch volume backup",
        `Volume backup with ID "${input.volumeBackupId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched volume backup "${input.volumeBackupId}"`,
      volumeBackup.data,
    );
  },
});
