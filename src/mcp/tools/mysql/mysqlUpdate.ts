import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlUpdate = createTool({
  name: "mysql-update",
  description: "Updates a MySQL database configuration in Dokploy.",
  schema: z.object({
    mysqlId: z
      .string()
      .min(1)
      .describe("The ID of the MySQL database to update."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("The name of the MySQL database."),
    appName: z
      .string()
      .min(1)
      .optional()
      .describe("The app name for the MySQL database."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("An optional description for the database."),
    databaseName: z
      .string()
      .min(1)
      .optional()
      .describe("The name of the database."),
    databaseUser: z
      .string()
      .min(1)
      .optional()
      .describe("The username for database access."),
    databasePassword: z
      .string()
      .optional()
      .describe("The password for database access."),
    databaseRootPassword: z
      .string()
      .optional()
      .describe("The root password for MySQL."),
    dockerImage: z
      .string()
      .optional()
      .default("mysql:8")
      .describe("Docker image to use for MySQL."),
    command: z
      .string()
      .nullable()
      .optional()
      .describe("Custom command to run in the container."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables for the database."),
    memoryReservation: z
      .string()
      .nullable()
      .optional()
      .describe("Memory reservation for the container."),
    memoryLimit: z
      .string()
      .nullable()
      .optional()
      .describe("Memory limit for the container."),
    cpuReservation: z
      .string()
      .nullable()
      .optional()
      .describe("CPU reservation for the container."),
    cpuLimit: z
      .string()
      .nullable()
      .optional()
      .describe("CPU limit for the container."),
    externalPort: z
      .number()
      .nullable()
      .optional()
      .describe("External port to expose the database on."),
    applicationStatus: z
      .enum(["idle", "running", "done", "error"])
      .optional()
      .describe("The status of the MySQL database."),
    createdAt: z.string().optional().describe("Creation timestamp."),
    projectId: z.string().optional().describe("The ID of the project."),
  }),
  annotations: {
    title: "Update MySQL Database",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.update", input);

    return ResponseFormatter.success(
      "MySQL database updated successfully",
      response.data
    );
  },
});
