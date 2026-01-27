import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeLoadServices = createTool({
  name: "compose-loadServices",
  description:
    "Loads and lists the services defined in a Docker Compose project.",
  schema: z.object({
    composeId: z
      .string()
      .min(1)
      .describe("The ID of the compose project to load services from."),
    type: z
      .enum(["fetch", "cache"])
      .optional()
      .describe(
        "Whether to fetch fresh data or use cached data. Defaults to 'cache'.",
      ),
  }),
  annotations: {
    title: "Load Compose Services",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("composeId", input.composeId);
    if (input.type) {
      params.append("type", input.type);
    }

    const services = await apiClient.get(
      `/compose.loadServices?${params.toString()}`,
    );

    if (!services?.data) {
      return ResponseFormatter.error(
        "Failed to load services",
        `Could not load services for compose project "${input.composeId}"`,
      );
    }

    return ResponseFormatter.success(
      `Successfully loaded services for compose project "${input.composeId}"`,
      services.data,
    );
  },
});
