import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeOne = createTool({
  name: "compose-one",
  description: "Retrieves details of a specific compose stack in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose stack to retrieve."),
  }),
  annotations: {
    title: "Get Compose Stack",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get("/compose.one", {
      params: input,
    });

    return ResponseFormatter.success(
      `Compose stack "${input.composeId}" retrieved successfully`,
      response.data
    );
  },
});
