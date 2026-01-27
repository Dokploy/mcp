import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

interface Mount {
  mountId: string;
  type: "file" | "bind" | "volume";
  hostPath: string | null;
  volumeName: string | null;
  filePath: string | null;
  content: string | null;
  serviceType: string;
  mountPath: string;
  applicationId: string | null;
  postgresId: string | null;
  mariadbId: string | null;
  mongoId: string | null;
  mysqlId: string | null;
  redisId: string | null;
  composeId: string | null;
}

export const mountsAllByApplicationId = createTool({
  name: "mounts-allByApplicationId",
  description:
    "Retrieves all mounts associated with a specific application. Returns a list of all file mounts, bind mounts, and volume mounts configured for the application. Useful for viewing what files and volumes are attached to an app.",
  schema: z.object({
    applicationId: z
      .string()
      .min(1)
      .describe("The application ID to list mounts for. Required."),
  }),
  annotations: {
    title: "List Application Mounts",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    // Mounts are embedded in the application.one response
    const response = await apiClient.get(
      `/application.one?applicationId=${input.applicationId}`
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch application",
        `Application with ID "${input.applicationId}" not found`
      );
    }

    const mounts: Mount[] = response.data.mounts ?? [];

    // Group by type for easier reading
    const grouped = {
      file: mounts.filter((m) => m.type === "file"),
      bind: mounts.filter((m) => m.type === "bind"),
      volume: mounts.filter((m) => m.type === "volume"),
    };

    // For file mounts, truncate content in summary but include full in data
    const summary = mounts.map((m) => ({
      mountId: m.mountId,
      type: m.type,
      mountPath: m.mountPath,
      ...(m.type === "file" && m.content
        ? { contentPreview: m.content.slice(0, 100) + (m.content.length > 100 ? "..." : "") }
        : {}),
      ...(m.type === "volume" ? { volumeName: m.volumeName } : {}),
      ...(m.type === "bind" ? { hostPath: m.hostPath } : {}),
    }));

    return ResponseFormatter.success(
      `Found ${mounts.length} mount(s): ${grouped.file.length} file, ${grouped.bind.length} bind, ${grouped.volume.length} volume`,
      { total: mounts.length, grouped, summary, mounts }
    );
  },
});
