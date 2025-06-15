import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeReload = createTool({
  name: "compose-reload",
  description: "Reloads a compose service in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose service to reload."),
    appName: z.string().describe("The app name of the compose service to reload."),
  }),
  annotations: {
    title: "Reload Compose Service",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.reload", input);

    return ResponseFormatter.success(
      `Compose service "${input.composeId}" reloaded successfully`,
      response.data
    );
  },
});
