import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const providerSchema = z.enum(["github", "gitlab", "gitea", "bitbucket"]);

export const gitBranches = createTool({
  name: "git-branches",
  description:
    "Lists all branches for a repository from a git provider (GitHub, GitLab, Gitea, or Bitbucket) in Dokploy.",
  schema: z.object({
    provider: providerSchema.describe(
      "The git provider type: github, gitlab, gitea, or bitbucket.",
    ),
    owner: z
      .string()
      .min(1)
      .describe("The repository owner (username or organization)."),
    repo: z
      .string()
      .min(1)
      .describe(
        "The repository name. For Gitea, this maps to 'repositoryName' in the API.",
      ),
    providerId: z
      .string()
      .optional()
      .describe(
        "The provider-specific ID (githubId, gitlabId, giteaId, or bitbucketId). Optional for all providers.",
      ),
    // GitLab specific
    id: z
      .number()
      .optional()
      .describe("The GitLab project ID (optional, GitLab only)."),
  }),
  annotations: {
    title: "List Git Branches",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { provider, owner, repo, providerId, id } = input;
    const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Build endpoint and params based on provider
    let endpoint: string;
    const params = new URLSearchParams();

    switch (provider) {
      case "github":
        endpoint = "/github.getGithubBranches";
        params.append("repo", repo);
        params.append("owner", owner);
        if (providerId) params.append("githubId", providerId);
        break;
      case "gitlab":
        endpoint = "/gitlab.getGitlabBranches";
        params.append("repo", repo);
        params.append("owner", owner);
        if (providerId) params.append("gitlabId", providerId);
        if (id !== undefined) params.append("id", id.toString());
        break;
      case "gitea":
        endpoint = "/gitea.getGiteaBranches";
        params.append("repositoryName", repo);
        params.append("owner", owner);
        if (providerId) params.append("giteaId", providerId);
        break;
      case "bitbucket":
        endpoint = "/bitbucket.getBitbucketBranches";
        params.append("repo", repo);
        params.append("owner", owner);
        if (providerId) params.append("bitbucketId", providerId);
        break;
    }

    const response = await apiClient.get(`${endpoint}?${params.toString()}`);

    if (!response?.data) {
      return ResponseFormatter.error(
        `Failed to fetch ${providerLabel} branches`,
        `Unable to retrieve branches for repository "${owner}/${repo}"`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched branches for repository "${owner}/${repo}" from ${providerLabel}`,
      response.data,
    );
  },
});
