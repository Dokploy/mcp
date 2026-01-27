import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const backupRemove = createTool({
  name: "backup-remove",
  description:
    "Permanently deletes a backup configuration from Dokploy. This stops scheduled backups but does not delete existing backup files.",
  schema: z.object({
    backupId: z
      .string()
      .describe("The unique ID of the backup configuration to delete."),
  }),
  annotations: {
    title: "Remove Backup",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/backup.remove", input);

    return ResponseFormatter.success(
      `Backup "${input.backupId}" removed successfully`,
      response.data,
    );
  },
});
