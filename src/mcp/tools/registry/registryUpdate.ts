import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const registryUpdate = createTool({
  name: "registry-update",
  description: "Updates an existing container registry in Dokploy.",
  schema: z.object({
    registryId: z.string().min(1).describe("The unique identifier of the registry to update. Required."),
    registryName: z
      .string()
      .min(1)
      .optional()
      .describe("New friendly name for the registry. Optional."),
    imagePrefix: z
      .string()
      .nullable()
      .optional()
      .describe("New prefix for images in this registry (e.g., 'myorg' for 'myorg/image:tag'). Optional, can be null."),
    username: z
      .string()
      .min(1)
      .optional()
      .describe("New username for registry authentication. Optional."),
    password: z
      .string()
      .min(1)
      .optional()
      .describe("New password or access token for registry authentication. Optional."),
    registryUrl: z
      .string()
      .optional()
      .describe("New URL of the container registry. Optional."),
    createdAt: z.string().optional().describe("Creation timestamp. Usually not modified. Optional."),
    registryType: z
      .enum(["cloud"])
      .optional()
      .describe("Type of the registry. Currently only 'cloud' is supported. Optional."),
    organizationId: z
      .string()
      .min(1)
      .optional()
      .describe("Organization ID for the registry. Optional."),
    serverId: z
      .string()
      .optional()
      .describe("Server ID to associate the registry with. Optional."),
  }),
  annotations: {
    title: "Update Registry",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/registry.update", input);

    return ResponseFormatter.success(
      `Registry "${input.registryId}" updated successfully`,
      response.data,
    );
  },
});
