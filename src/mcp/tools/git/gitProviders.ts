import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const providerSchema = z.enum(["github", "gitlab", "gitea", "bitbucket"]);

export const gitProviders = createTool({
  name: "git-providers",
  description:
    "Lists all configured git providers of a specific type (GitHub, GitLab, Gitea, or Bitbucket) in Dokploy. Returns all provider configurations for the specified type.",
  schema: z.object({
    provider: providerSchema.describe(
      "The git provider type to list: github, gitlab, gitea, or bitbucket.",
    ),
  }),
  annotations: {
    title: "List Git Providers by Type",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { provider } = input;
    const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Build endpoint based on provider
    let endpoint: string;

    switch (provider) {
      case "github":
        endpoint = "/github.githubProviders";
        break;
      case "gitlab":
        endpoint = "/gitlab.gitlabProviders";
        break;
      case "gitea":
        endpoint = "/gitea.giteaProviders";
        break;
      case "bitbucket":
        endpoint = "/bitbucket.bitbucketProviders";
        break;
    }

    const response = await apiClient.get(endpoint);

    if (!response?.data) {
      return ResponseFormatter.error(
        `Failed to fetch ${providerLabel} providers`,
        `No ${providerLabel} providers found or unable to retrieve the list`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched ${providerLabel} providers`,
      response.data,
    );
  },
});
