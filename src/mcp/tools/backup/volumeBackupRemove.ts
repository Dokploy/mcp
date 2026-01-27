import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const volumeBackupRemove = createTool({
  name: "volume-backup-remove",
  description:
    "Permanently deletes a volume backup configuration from Dokploy. This stops scheduled backups but does not delete existing backup files.",
  schema: z.object({
    volumeBackupId: z
      .string()
      .min(1)
      .describe("The unique ID of the volume backup configuration to delete."),
  }),
  annotations: {
    title: "Remove Volume Backup",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/volumeBackups.delete", input);

    return ResponseFormatter.success(
      `Volume backup "${input.volumeBackupId}" deleted successfully`,
      response.data,
    );
  },
});
