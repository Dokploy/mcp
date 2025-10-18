import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const postgresUpdate = createTool({
  name: "postgres-update",
  description: "Updates an existing PostgreSQL database in Dokploy.",
  schema: z.object({
    postgresId: z
      .string()
      .min(1)
      .describe("The ID of the PostgreSQL database to update."),
    name: z
      .string()
      .min(1)
      .optional()
      .describe("The new name of the PostgreSQL database."),
    appName: z
      .string()
      .optional()
      .describe("The new app name of the PostgreSQL database."),
    databaseName: z
      .string()
      .min(1)
      .optional()
      .describe("The new database name."),
    databaseUser: z
      .string()
      .min(1)
      .optional()
      .describe("The new database username."),
    databasePassword: z
      .string()
      .regex(/^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/)
      .optional()
      .describe("The new database password."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("The new description for the PostgreSQL database."),
    dockerImage: z
      .string()
      .default("postgres:15")
      .optional()
      .describe("The new Docker image for PostgreSQL."),
    command: z
      .string()
      .nullable()
      .optional()
      .describe("Custom command to run the PostgreSQL database."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables for the PostgreSQL database."),
    memoryReservation: z
      .string()
      .nullable()
      .optional()
      .describe("Memory reservation for the PostgreSQL database."),
    externalPort: z
      .number()
      .nullable()
      .optional()
      .describe("External port for the PostgreSQL database."),
    memoryLimit: z
      .string()
      .nullable()
      .optional()
      .describe("Memory limit for the PostgreSQL database."),
    cpuReservation: z
      .string()
      .nullable()
      .optional()
      .describe("CPU reservation for the PostgreSQL database."),
    cpuLimit: z
      .string()
      .nullable()
      .optional()
      .describe("CPU limit for the PostgreSQL database."),
    applicationStatus: z
      .enum(["idle", "running", "done", "error"])
      .optional()
      .describe("Application status."),
    healthCheckSwarm: z
      .object({
        Test: z.array(z.string()),
        Interval: z.number(),
        Timeout: z.number(),
        StartPeriod: z.number(),
        Retries: z.number(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm health check configuration."),
    restartPolicySwarm: z
      .object({
        Condition: z.string(),
        Delay: z.number(),
        MaxAttempts: z.number(),
        Window: z.number(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm restart policy configuration."),
    placementSwarm: z
      .object({
        Constraints: z.array(z.string()),
        Preferences: z.array(
          z.object({
            Spread: z.object({
              SpreadDescriptor: z.string(),
            }),
          })
        ),
        MaxReplicas: z.number(),
        Platforms: z.array(
          z.object({
            Architecture: z.string(),
            OS: z.string(),
          })
        ),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm placement configuration."),
    updateConfigSwarm: z
      .object({
        Parallelism: z.number(),
        Delay: z.number(),
        FailureAction: z.string(),
        Monitor: z.number(),
        MaxFailureRatio: z.number(),
        Order: z.string(),
      })
      .nullable()
      .optional()
      .describe("Docker Swarm update configuration."),
    rollbackConfigSwarm: z
      .object({
        Parallelism: z.number(),
        Delay: z.number(),
        FailureAction: z.string(),
        Monitor: z.number(),
        MaxFailureRatio: z.number(),
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
            MaxConcurrent: z.number(),
            TotalCompletions: z.number(),
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
          Target: z.string(),
          Aliases: z.array(z.string()),
          DriverOpts: z.object({}),
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
    createdAt: z.string().optional().describe("Creation date."),
    environmentId: z.string().optional().describe("Environment ID."),
  }),
  annotations: {
    title: "Update PostgreSQL Database",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/postgres.update", input);

    return ResponseFormatter.success(
      `PostgreSQL database "${input.postgresId}" updated successfully`,
      response.data
    );
  },
});
