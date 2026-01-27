import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const portOne = createTool({
  name: "port-one",
  description: "Gets a specific port mapping by its ID in Dokploy.",
  schema: z.object({
    portId: z
      .string()
      .min(1)
      .describe("The unique identifier of the port mapping to retrieve. Required."),
  }),
  annotations: {
    title: "Get Port Mapping Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const port = await apiClient.get(`/port.one?portId=${input.portId}`);

    if (!port?.data) {
      return ResponseFormatter.error(
        "Failed to fetch port mapping",
        `Port mapping with ID "${input.portId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched port mapping "${input.portId}"`,
      port.data,
    );
  },
});
