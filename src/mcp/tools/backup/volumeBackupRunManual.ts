import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const volumeBackupRunManual = createTool({
  name: "volume-backup-run-manual",
  description:
    "Triggers an immediate manual volume backup using an existing backup configuration. Runs the backup outside of the scheduled cron time.",
  schema: z.object({
    volumeBackupId: z
      .string()
      .min(1)
      .describe("The unique ID of the volume backup configuration to execute."),
  }),
  annotations: {
    title: "Run Volume Backup Manually",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/volumeBackups.runManually", input);

    return ResponseFormatter.success(
      `Manual volume backup triggered successfully for "${input.volumeBackupId}"`,
      response.data,
    );
  },
});
