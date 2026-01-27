import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const scheduleList = createTool({
  name: "schedule-list",
  description: "Lists all scheduled tasks for a specific resource in Dokploy.",
  schema: z.object({
    id: z
      .string()
      .describe(
        "The ID of the resource (applicationId, composeId, or serverId) to list schedules for. Required.",
      ),
    scheduleType: z
      .enum(["application", "compose", "server", "dokploy-server"])
      .describe("The type of schedules to list: 'application', 'compose', 'server', or 'dokploy-server'. Required."),
  }),
  annotations: {
    title: "List Schedules",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const schedules = await apiClient.get(
      `/schedule.list?id=${input.id}&scheduleType=${input.scheduleType}`,
    );

    return ResponseFormatter.success(
      `Successfully fetched schedules for ${input.scheduleType} "${input.id}"`,
      schedules.data,
    );
  },
});
