import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const scheduleCreate = createTool({
  name: "schedule-create",
  description: "Creates a new scheduled task in Dokploy.",
  schema: z.object({
    name: z.string().describe("The name of the scheduled task. Required."),
    cronExpression: z
      .string()
      .describe("The cron expression defining when the task runs (e.g., '0 0 * * *' for daily at midnight). Required."),
    command: z.string().describe("The command to execute when the schedule runs. Required."),
    scheduleId: z.string().optional().describe("Optional schedule ID. If not provided, one will be generated."),
    appName: z.string().optional().describe("The application name for the scheduled task."),
    serviceName: z
      .string()
      .nullable()
      .optional()
      .describe("The service name for compose applications. Only applicable when scheduleType is 'compose'."),
    shellType: z
      .enum(["bash", "sh"])
      .optional()
      .describe("The shell type to use for command execution. Either 'bash' or 'sh'."),
    scheduleType: z
      .enum(["application", "compose", "server", "dokploy-server"])
      .optional()
      .describe("The type of schedule: 'application' for app-level, 'compose' for compose services, 'server' for remote servers, or 'dokploy-server' for the Dokploy server itself."),
    script: z
      .string()
      .nullable()
      .optional()
      .describe("The script content to execute. Can be used instead of or in addition to command."),
    applicationId: z
      .string()
      .nullable()
      .optional()
      .describe("The application ID. Required when scheduleType is 'application'."),
    composeId: z
      .string()
      .nullable()
      .optional()
      .describe("The compose ID. Required when scheduleType is 'compose'."),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("The server ID. Required when scheduleType is 'server'."),
    userId: z.string().nullable().optional().describe("The user ID who owns this schedule."),
    enabled: z
      .boolean()
      .optional()
      .describe("Whether the schedule is enabled and will run. Defaults to true."),
    createdAt: z.string().optional().describe("The creation timestamp. Usually auto-generated."),
  }),
  annotations: {
    title: "Create Schedule",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/schedule.create", input);

    return ResponseFormatter.success(
      `Schedule "${input.name}" created successfully`,
      response.data,
    );
  },
});
