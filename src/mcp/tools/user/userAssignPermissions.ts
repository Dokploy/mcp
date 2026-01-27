import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userAssignPermissions = createTool({
  name: "user-assign-permissions",
  description:
    "Assigns permissions to a user in Dokploy. All fields are required.",
  schema: z.object({
    id: z
      .string()
      .min(1)
      .describe(
        "The ID of the user to assign permissions. Must be at least 1 character.",
      ),
    accessedProjects: z
      .array(z.string())
      .describe(
        "List of project IDs the user can access. Required, can be empty array.",
      ),
    accessedEnvironments: z
      .array(z.string())
      .describe(
        "List of environment IDs the user can access. Required, can be empty array.",
      ),
    accessedServices: z
      .array(z.string())
      .describe(
        "List of service IDs the user can access. Required, can be empty array.",
      ),
    canCreateProjects: z
      .boolean()
      .describe("Whether the user can create new projects. Required."),
    canCreateServices: z
      .boolean()
      .describe(
        "Whether the user can create new services within projects. Required.",
      ),
    canDeleteProjects: z
      .boolean()
      .describe("Whether the user can delete projects. Required."),
    canDeleteServices: z
      .boolean()
      .describe("Whether the user can delete services. Required."),
    canAccessToDocker: z
      .boolean()
      .describe(
        "Whether the user can access Docker management features. Required.",
      ),
    canAccessToTraefikFiles: z
      .boolean()
      .describe(
        "Whether the user can access and modify Traefik configuration files. Required.",
      ),
    canAccessToAPI: z
      .boolean()
      .describe("Whether the user can access the Dokploy API. Required."),
    canAccessToSSHKeys: z
      .boolean()
      .describe("Whether the user can access and manage SSH keys. Required."),
    canAccessToGitProviders: z
      .boolean()
      .describe(
        "Whether the user can access and configure Git providers. Required.",
      ),
    canDeleteEnvironments: z
      .boolean()
      .describe("Whether the user can delete environments. Required."),
    canCreateEnvironments: z
      .boolean()
      .describe("Whether the user can create new environments. Required."),
  }),
  annotations: {
    title: "Assign User Permissions",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/user.assignPermissions", input);

    return ResponseFormatter.success(
      `Permissions assigned to user "${input.id}" successfully`,
      response.data,
    );
  },
});
