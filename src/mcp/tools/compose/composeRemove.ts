import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeRemove = createTool({
  name: "compose-remove",
  description: "Removes/deletes a compose service from Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose service to remove."),
  }),
  annotations: {
    title: "Remove Compose Service",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.remove", input);

    return ResponseFormatter.success(
      `Compose service "${input.composeId}" removed successfully`,
      response.data
    );
  },
});
