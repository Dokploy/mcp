import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const registryAll = createTool({
  name: "registry-all",
  description: "Lists all container registries in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List All Registries",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const registries = await apiClient.get("/registry.all");

    if (!registries?.data) {
      return ResponseFormatter.error(
        "Failed to fetch registries",
        "No registries found",
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched all registries`,
      registries.data,
    );
  },
});
