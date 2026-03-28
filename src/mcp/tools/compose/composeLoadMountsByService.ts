import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeLoadMountsByService = createTool({
  name: "compose-loadMountsByService",
  description: "Loads mounts for a specific service in a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().describe("The ID of the compose stack."),
    serviceName: z.string().describe("The name of the service to load mounts for."),
  }),
  annotations: {
    title: "Load Compose Mounts By Service",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.get(`/compose.loadMountsByService?composeId=${input.composeId}&serviceName=${input.serviceName}`);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to load mounts", `Could not load mounts for service "${input.serviceName}" in compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully loaded mounts for service "${input.serviceName}"`, result.data);
  },
});
