import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const registryOne = createTool({
  name: "registry-one",
  description: "Gets a specific container registry by its ID in Dokploy.",
  schema: z.object({
    registryId: z
      .string()
      .min(1)
      .describe("The unique identifier of the registry to retrieve. Required."),
  }),
  annotations: {
    title: "Get Registry Details",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const registry = await apiClient.get(
      `/registry.one?registryId=${encodeURIComponent(input.registryId)}`,
    );

    if (!registry?.data) {
      return ResponseFormatter.error(
        "Failed to fetch registry",
        `Registry with ID "${input.registryId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched registry "${input.registryId}"`,
      registry.data,
    );
  },
});
