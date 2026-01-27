import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const dockerRestartContainer = createTool({
  name: "docker-restart-container",
  description: "Restarts a Docker container in Dokploy.",
  schema: z.object({
    containerId: z
      .string()
      .min(1)
      .regex(/^[a-zA-Z0-9.\-_]+$/)
      .describe("The ID of the container to restart."),
  }),
  annotations: {
    title: "Restart Docker Container",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/docker.restartContainer", {
      containerId: input.containerId,
    });

    return ResponseFormatter.success(
      `Successfully restarted container "${input.containerId}"`,
      response.data,
    );
  },
});
