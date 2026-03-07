import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeDeploy = createTool({
  name: "compose-deploy",
  description: "Deploys a compose stack in Dokploy.",
  schema: z.object({
    composeId: z
      .string()
      .describe("The ID of the compose stack to deploy."),
  }),
  annotations: {
    title: "Deploy Compose Stack",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.deploy", input);

    return ResponseFormatter.success(
      `Compose stack "${input.composeId}" deployment started successfully`,
      response.data
    );
  },
});
