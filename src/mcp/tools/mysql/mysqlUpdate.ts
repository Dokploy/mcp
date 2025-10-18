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
      .regex(
        /^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/,
        "Password contains invalid characters"
      )
      .optional()
      .describe("The password for database access."),
    databaseRootPassword: z
      .string()
      .regex(
        /^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/,
        "Root password contains invalid characters"
      )
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
    healthCheckSwarm: z
      .object({
        Test: z.array(z.string()).optional(),
        Interval: z.number().optional(),
        Timeout: z.number().optional(),
        StartPeriod: z.number().optional(),
        Retries: z.number().optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm health check configuration."),
    restartPolicySwarm: z
      .object({
        Condition: z.string().optional(),
        Delay: z.number().optional(),
        MaxAttempts: z.number().optional(),
        Window: z.number().optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm restart policy configuration."),
    placementSwarm: z
      .object({
        Constraints: z.array(z.string()).optional(),
        Preferences: z
          .array(
            z.object({
              Spread: z.object({
                SpreadDescriptor: z.string(),
              }),
            })
          )
          .optional(),
        Platforms: z
          .array(
            z.object({
              Architecture: z.string(),
              OS: z.string(),
            })
          )
          .optional(),
        MaxReplicas: z.number().optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm placement configuration."),
    updateConfigSwarm: z
      .object({
        Parallelism: z.number(),
        Delay: z.number().optional(),
        FailureAction: z.string().optional(),
        Monitor: z.number().optional(),
        MaxFailureRatio: z.number().optional(),
        Order: z.string(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm update configuration."),
    rollbackConfigSwarm: z
      .object({
        Parallelism: z.number(),
        Delay: z.number().optional(),
        FailureAction: z.string().optional(),
        Monitor: z.number().optional(),
        MaxFailureRatio: z.number().optional(),
        Order: z.string(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm rollback configuration."),
    modeSwarm: z
      .object({
        Replicated: z
          .object({
            Replicas: z.number(),
          })
          .optional(),
        Global: z.object({}).optional(),
        ReplicatedJob: z
          .object({
            MaxConcurrent: z.number().optional(),
            TotalCompletions: z.number().optional(),
          })
          .optional(),
        GlobalJob: z.object({}).optional(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm mode configuration."),
    labelsSwarm: z
      .record(z.string())
      .nullable()
      .optional()
      .describe("Docker Swarm labels."),
    networkSwarm: z
      .array(
        z.object({
          Target: z.string().optional(),
          Aliases: z.array(z.string()).optional(),
          DriverOpts: z.object({}).optional(),
        })
      )
      .nullable()
      .optional()
      .describe("Docker Swarm network configuration."),
    stopGracePeriodSwarm: z
      .number()
      .int()
      .nullable()
      .optional()
      .describe("Docker Swarm stop grace period in seconds."),
    replicas: z.number().optional().describe("Number of replicas."),
    createdAt: z.string().optional().describe("Creation timestamp."),
    environmentId: z.string().optional().describe("The ID of the environment."),
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
