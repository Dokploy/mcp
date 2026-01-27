import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const providerSchema = z.enum(["github", "gitlab", "gitea", "bitbucket"]);

export const gitRepositories = createTool({
  name: "git-repositories",
  description:
    "Lists all repositories available from a git provider (GitHub, GitLab, Gitea, or Bitbucket) in Dokploy.",
  schema: z.object({
    provider: providerSchema.describe(
      "The git provider type: github, gitlab, gitea, or bitbucket.",
    ),
    providerId: z
      .string()
      .min(1)
      .describe(
        "The provider-specific ID. Required. Maps to githubId, gitlabId, giteaId, or bitbucketId based on provider.",
      ),
  }),
  annotations: {
    title: "List Git Repositories",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { provider, providerId } = input;
    const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Build endpoint based on provider
    let endpoint: string;
    let paramName: string;

    switch (provider) {
      case "github":
        endpoint = "/github.getGithubRepositories";
        paramName = "githubId";
        break;
      case "gitlab":
        endpoint = "/gitlab.getGitlabRepositories";
        paramName = "gitlabId";
        break;
      case "gitea":
        endpoint = "/gitea.getGiteaRepositories";
        paramName = "giteaId";
        break;
      case "bitbucket":
        endpoint = "/bitbucket.getBitbucketRepositories";
        paramName = "bitbucketId";
        break;
    }

    const response = await apiClient.get(
      `${endpoint}?${paramName}=${encodeURIComponent(providerId)}`,
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        `Failed to fetch ${providerLabel} repositories`,
        `Unable to retrieve repositories for ${providerLabel} provider "${providerId}"`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched repositories for ${providerLabel} provider "${providerId}"`,
      response.data,
    );
  },
});
