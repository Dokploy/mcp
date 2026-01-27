import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const providerSchema = z.enum(["github", "gitlab", "gitea", "bitbucket"]);

export const gitTestConnection = createTool({
  name: "git-test-connection",
  description:
    "Tests the connection to a git provider (GitHub, GitLab, Gitea, or Bitbucket) in Dokploy.",
  schema: z.object({
    provider: providerSchema.describe(
      "The git provider type: github, gitlab, gitea, or bitbucket.",
    ),
    // GitHub requires providerId with min 1 char, others have it optional
    providerId: z
      .string()
      .optional()
      .describe(
        "The provider-specific ID. Required for GitHub (min 1 char) and Bitbucket (min 1 char). Optional for GitLab and Gitea.",
      ),
    // GitLab specific
    groupName: z
      .string()
      .optional()
      .describe("The GitLab group name to filter repositories (GitLab only)."),
    // Gitea specific
    organizationName: z
      .string()
      .optional()
      .describe(
        "The Gitea organization name to filter repositories (Gitea only).",
      ),
    // Bitbucket specific
    bitbucketUsername: z
      .string()
      .optional()
      .describe("The Bitbucket username for authentication (Bitbucket only)."),
    bitbucketEmail: z
      .string()
      .email()
      .optional()
      .describe(
        "The Bitbucket email address for authentication (Bitbucket only).",
      ),
    workspaceName: z
      .string()
      .optional()
      .describe("The Bitbucket workspace name (Bitbucket only)."),
    apiToken: z
      .string()
      .optional()
      .describe("The Bitbucket API token for authentication (Bitbucket only)."),
    appPassword: z
      .string()
      .optional()
      .describe(
        "The Bitbucket app password for authentication (Bitbucket only).",
      ),
  }),
  annotations: {
    title: "Test Git Connection",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const {
      provider,
      providerId,
      groupName,
      organizationName,
      bitbucketUsername,
      bitbucketEmail,
      workspaceName,
      apiToken,
      appPassword,
    } = input;
    const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Build endpoint and payload based on provider
    let endpoint: string;
    let payload: Record<string, unknown>;

    switch (provider) {
      case "github":
        // GitHub requires githubId with minLength 1
        if (!providerId || providerId.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "GitHub requires providerId (githubId) with at least 1 character",
          );
        }
        endpoint = "/github.testConnection";
        payload = { githubId: providerId };
        break;
      case "gitlab":
        // GitLab: gitlabId and groupName are both optional
        endpoint = "/gitlab.testConnection";
        payload = {};
        if (providerId) payload.gitlabId = providerId;
        if (groupName) payload.groupName = groupName;
        break;
      case "gitea":
        // Gitea: giteaId and organizationName are both optional
        endpoint = "/gitea.testConnection";
        payload = {};
        if (providerId) payload.giteaId = providerId;
        if (organizationName) payload.organizationName = organizationName;
        break;
      case "bitbucket":
        // Bitbucket requires bitbucketId with minLength 1
        if (!providerId || providerId.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "Bitbucket requires providerId (bitbucketId) with at least 1 character",
          );
        }
        endpoint = "/bitbucket.testConnection";
        payload = { bitbucketId: providerId };
        if (bitbucketUsername) payload.bitbucketUsername = bitbucketUsername;
        if (bitbucketEmail) payload.bitbucketEmail = bitbucketEmail;
        if (workspaceName) payload.workspaceName = workspaceName;
        if (apiToken) payload.apiToken = apiToken;
        if (appPassword) payload.appPassword = appPassword;
        break;
    }

    const response = await apiClient.post(endpoint, payload);

    const providerIdDisplay = providerId || "(default)";
    return ResponseFormatter.success(
      `Successfully tested connection for ${providerLabel} provider "${providerIdDisplay}"`,
      response.data,
    );
  },
});
