import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const backupOne = createTool({
  name: "backup-one",
  description:
    "Retrieves details of a specific backup configuration by its ID. Returns backup schedule, destination, database settings, and status.",
  schema: z.object({
    backupId: z
      .string()
      .describe("The unique ID of the backup configuration to retrieve."),
  }),
  annotations: {
    title: "Get Backup Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const backup = await apiClient.get(
      `/backup.one?backupId=${input.backupId}`,
    );

    if (!backup?.data) {
      return ResponseFormatter.error(
        "Failed to fetch backup",
        `Backup with ID "${input.backupId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched backup "${input.backupId}"`,
      backup.data,
    );
  },
});
