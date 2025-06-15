import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeDeploy = createTool({
  name: "compose-deploy",
  description: "Deploys a compose service in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose service to deploy."),
  }),
  annotations: {
    title: "Deploy Compose Service",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.deploy", input);

    return ResponseFormatter.success(
      `Compose service "${input.composeId}" deployment started successfully`,
      response.data
    );
  },
});
