import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const registryRemove = createTool({
  name: "registry-remove",
  description: "Removes/deletes a container registry from Dokploy.",
  schema: z.object({
    registryId: z.string().min(1).describe("The unique identifier of the registry to remove. Required."),
  }),
  annotations: {
    title: "Remove Registry",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/registry.remove", input);

    return ResponseFormatter.success(
      `Registry "${input.registryId}" removed successfully`,
      response.data,
    );
  },
});
