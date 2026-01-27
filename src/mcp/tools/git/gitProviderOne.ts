import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const providerSchema = z.enum(["github", "gitlab", "gitea", "bitbucket"]);

export const gitProviderOne = createTool({
  name: "git-provider-one",
  description:
    "Gets a specific git provider configuration by its ID (GitHub, GitLab, Gitea, or Bitbucket) in Dokploy.",
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
    title: "Get Git Provider Details",
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
        endpoint = "/github.one";
        paramName = "githubId";
        break;
      case "gitlab":
        endpoint = "/gitlab.one";
        paramName = "gitlabId";
        break;
      case "gitea":
        endpoint = "/gitea.one";
        paramName = "giteaId";
        break;
      case "bitbucket":
        endpoint = "/bitbucket.one";
        paramName = "bitbucketId";
        break;
    }

    const response = await apiClient.get(
      `${endpoint}?${paramName}=${encodeURIComponent(providerId)}`,
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        `Failed to fetch ${providerLabel} provider`,
        `${providerLabel} provider with ID "${providerId}" not found`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched ${providerLabel} provider "${providerId}"`,
      response.data,
    );
  },
});
