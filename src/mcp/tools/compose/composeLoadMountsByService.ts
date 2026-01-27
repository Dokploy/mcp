import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeLoadMountsByService = createTool({
  name: "compose-loadMountsByService",
  description:
    "Loads the mounts/volumes for a specific service in a Docker Compose project.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose project."),
    serviceName: z
      .string()
      .min(1)
      .describe("The name of the service to load mounts for."),
  }),
  annotations: {
    title: "Load Compose Service Mounts",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const params = new URLSearchParams();
    params.append("composeId", input.composeId);
    params.append("serviceName", input.serviceName);

    const mounts = await apiClient.get(
      `/compose.loadMountsByService?${params.toString()}`,
    );

    if (!mounts?.data) {
      return ResponseFormatter.error(
        "Failed to load mounts",
        `Could not load mounts for service "${input.serviceName}" in compose project "${input.composeId}"`,
      );
    }

    return ResponseFormatter.success(
      `Successfully loaded mounts for service "${input.serviceName}" in compose project "${input.composeId}"`,
      mounts.data,
    );
  },
});
