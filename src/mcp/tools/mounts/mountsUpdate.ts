import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mountsUpdate = createTool({
  name: "mounts-update",
  description:
    "Updates an existing mount configuration in Dokploy. Can modify the mount type, paths, and content. For file mounts, you can update the file content directly. Use this to edit configuration files, scripts, or any mounted file content. IMPORTANT: For file mounts, mountPath must include the filename.",
  schema: z.object({
    mountId: z
      .string()
      .min(1)
      .describe("The unique identifier of the mount to update. Required."),
    type: z
      .enum(["bind", "volume", "file"])
      .optional()
      .describe("New mount type: 'file', 'bind', or 'volume'."),
    mountPath: z
      .string()
      .min(1)
      .optional()
      .describe(
        "New destination path inside the container. For file mounts: MUST include the filename."
      ),
    hostPath: z
      .string()
      .nullable()
      .optional()
      .describe("New host path for bind mounts."),
    volumeName: z
      .string()
      .nullable()
      .optional()
      .describe("New volume name for volume mounts."),
    content: z
      .string()
      .nullable()
      .optional()
      .describe("New file content for file mounts. Use this to edit the file contents."),
    filePath: z
      .string()
      .nullable()
      .optional()
      .describe("New filename reference for file mounts."),
    serviceType: z
      .enum(["application", "postgres", "mysql", "mariadb", "mongo", "redis", "compose"])
      .default("application")
      .optional()
      .describe("Service type this mount belongs to."),
    applicationId: z
      .string()
      .nullable()
      .optional()
      .describe("Application ID if reassigning to a different application."),
    postgresId: z
      .string()
      .nullable()
      .optional()
      .describe("PostgreSQL database ID if reassigning to a different database."),
    mariadbId: z
      .string()
      .nullable()
      .optional()
      .describe("MariaDB database ID if reassigning to a different database."),
    mongoId: z
      .string()
      .nullable()
      .optional()
      .describe("MongoDB database ID if reassigning to a different database."),
    mysqlId: z
      .string()
      .nullable()
      .optional()
      .describe("MySQL database ID if reassigning to a different database."),
    redisId: z
      .string()
      .nullable()
      .optional()
      .describe("Redis database ID if reassigning to a different database."),
    composeId: z
      .string()
      .nullable()
      .optional()
      .describe("Compose stack ID if reassigning to a different compose stack."),
  }),
  annotations: {
    title: "Update Mount",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mounts.update", input);

    return ResponseFormatter.success(
      `Successfully updated mount ${input.mountId}`,
      response?.data ?? { updated: true }
    );
  },
});
