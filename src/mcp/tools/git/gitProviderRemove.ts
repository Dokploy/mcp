import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const gitProviderRemove = createTool({
  name: "git-provider-remove",
  description:
    "Removes a git provider configuration from Dokploy. This deletes the provider regardless of type (GitHub, GitLab, Gitea, or Bitbucket).",
  schema: z.object({
    gitProviderId: z
      .string()
      .min(1)
      .describe(
        "The ID of the git provider to remove. Required. This is the parent gitProviderId, not the provider-specific ID.",
      ),
  }),
  annotations: {
    title: "Remove Git Provider",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/gitProvider.remove", {
      gitProviderId: input.gitProviderId,
    });

    return ResponseFormatter.success(
      `Successfully removed git provider "${input.gitProviderId}"`,
      response.data,
    );
  },
});
