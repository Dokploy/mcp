import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const scheduleRunManually = createTool({
  name: "schedule-run-manually",
  description: "Manually triggers a scheduled task to run immediately.",
  schema: z.object({
    scheduleId: z
      .string()
      .min(1)
      .describe("The unique identifier of the schedule to trigger immediately. Required."),
  }),
  annotations: {
    title: "Run Schedule Manually",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/schedule.runManually", input);

    return ResponseFormatter.success(
      `Schedule "${input.scheduleId}" triggered successfully`,
      response.data,
    );
  },
});
