import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const portDelete = createTool({
  name: "port-delete",
  description: "Deletes a port mapping from Dokploy.",
  schema: z.object({
    portId: z
      .string()
      .min(1)
      .describe("The unique identifier of the port mapping to delete. Required."),
  }),
  annotations: {
    title: "Delete Port Mapping",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/port.delete", input);

    return ResponseFormatter.success(
      `Port mapping "${input.portId}" deleted successfully`,
      response.data,
    );
  },
});
