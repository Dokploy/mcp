import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mountsCreate = createTool({
  name: "mounts-create",
  description: `Creates a new mount for a service in Dokploy. Supports three mount types:

- **file**: Creates a file with inline content. Requires: filePath (filename only), mountPath (FULL path INCLUDING filename), content (file content). IMPORTANT: For file mounts, mountPath must be the complete path including the filename (e.g., '/app/config.json') because Docker mounts files to files, not files to directories.
- **bind**: Maps a host directory to container. Requires: hostPath (host path), mountPath (container path)
- **volume**: Uses a Docker volume. Requires: volumeName, mountPath (container path)`,
  schema: z.object({
    type: z
      .enum(["bind", "volume", "file"])
      .describe(
        "Mount type. 'file': inline file content, 'bind': host path mapping, 'volume': Docker volume. Required."
      ),
    mountPath: z
      .string()
      .min(1)
      .describe(
        "Destination path inside the container. For file mounts: MUST include the filename (e.g., '/app/config.json'). For bind/volume: the directory path. Required."
      ),
    serviceId: z
      .string()
      .min(1)
      .describe(
        "ID of the service (application, database, or compose) to attach this mount to. Required."
      ),
    serviceType: z
      .enum(["application", "postgres", "mysql", "mariadb", "mongo", "redis", "compose"])
      .default("application")
      .optional()
      .describe(
        "Type of service this mount belongs to. Defaults to 'application'."
      ),
    filePath: z
      .string()
      .nullable()
      .optional()
      .describe(
        "For 'file' type: The filename (e.g., 'config.json'). This is just the name, not a path."
      ),
    content: z
      .string()
      .nullable()
      .optional()
      .describe("For 'file' type: The actual file content to be written."),
    hostPath: z
      .string()
      .nullable()
      .optional()
      .describe("For 'bind' type: Absolute path on the host server to mount from."),
    volumeName: z
      .string()
      .nullable()
      .optional()
      .describe("For 'volume' type: Name of the Docker volume to mount."),
  }),
  annotations: {
    title: "Create Mount",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    // Validate type-specific required fields
    if (input.type === "file") {
      if (!input.filePath) {
        return ResponseFormatter.error(
          "Missing required field",
          "filePath is required for 'file' type mounts"
        );
      }
      if (!input.content) {
        return ResponseFormatter.error(
          "Missing required field",
          "content is required for 'file' type mounts"
        );
      }
    } else if (input.type === "bind") {
      if (!input.hostPath) {
        return ResponseFormatter.error(
          "Missing required field",
          "hostPath is required for 'bind' type mounts"
        );
      }
    } else if (input.type === "volume") {
      if (!input.volumeName) {
        return ResponseFormatter.error(
          "Missing required field",
          "volumeName is required for 'volume' type mounts"
        );
      }
    }

    const response = await apiClient.post("/mounts.create", input);

    return ResponseFormatter.success(
      `Successfully created ${input.type} mount at ${input.mountPath}`,
      response?.data ?? { created: true }
    );
  },
});
