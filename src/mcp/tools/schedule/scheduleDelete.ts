import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const scheduleDelete = createTool({
  name: "schedule-delete",
  description: "Deletes a scheduled task from Dokploy.",
  schema: z.object({
    scheduleId: z.string().describe("The unique identifier of the schedule to delete. Required."),
  }),
  annotations: {
    title: "Delete Schedule",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/schedule.delete", input);

    return ResponseFormatter.success(
      `Schedule "${input.scheduleId}" deleted successfully`,
      response.data,
    );
  },
});
