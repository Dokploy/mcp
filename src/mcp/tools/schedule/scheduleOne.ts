import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const scheduleOne = createTool({
  name: "schedule-one",
  description: "Gets a specific scheduled task by its ID in Dokploy.",
  schema: z.object({
    scheduleId: z.string().describe("The unique identifier of the schedule to retrieve. Required."),
  }),
  annotations: {
    title: "Get Schedule Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const schedule = await apiClient.get(
      `/schedule.one?scheduleId=${input.scheduleId}`,
    );

    if (!schedule?.data) {
      return ResponseFormatter.error(
        "Failed to fetch schedule",
        `Schedule with ID "${input.scheduleId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched schedule "${input.scheduleId}"`,
      schedule.data,
    );
  },
});
