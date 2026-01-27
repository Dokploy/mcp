import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const providerSchema = z.enum(["github", "gitlab", "gitea", "bitbucket"]);

export const gitProviderUpdate = createTool({
  name: "git-provider-update",
  description:
    "Updates a git provider configuration (GitHub, GitLab, Gitea, or Bitbucket) in Dokploy.",
  schema: z.object({
    provider: providerSchema.describe(
      "The git provider type to update: github, gitlab, gitea, or bitbucket.",
    ),
    providerId: z
      .string()
      .min(1)
      .describe(
        "The provider-specific ID. Required. Maps to githubId, gitlabId, giteaId, or bitbucketId based on provider.",
      ),
    gitProviderId: z
      .string()
      .describe(
        "The parent git provider ID. Required for all providers. GitHub requires min 1 char.",
      ),
    name: z
      .string()
      .min(1)
      .describe(
        "Display name for the git provider. Required for all providers.",
      ),
    // GitHub specific
    githubAppName: z
      .string()
      .min(1)
      .optional()
      .describe("The GitHub App name. Required for GitHub updates."),
    githubAppId: z
      .number()
      .nullable()
      .optional()
      .describe("The GitHub App numeric ID (optional, GitHub only)."),
    githubClientId: z
      .string()
      .nullable()
      .optional()
      .describe("The GitHub OAuth Client ID (optional, GitHub only)."),
    githubClientSecret: z
      .string()
      .nullable()
      .optional()
      .describe("The GitHub OAuth Client Secret (optional, GitHub only)."),
    githubInstallationId: z
      .string()
      .nullable()
      .optional()
      .describe("The GitHub App Installation ID (optional, GitHub only)."),
    githubPrivateKey: z
      .string()
      .nullable()
      .optional()
      .describe("The GitHub App Private Key (optional, GitHub only)."),
    githubWebhookSecret: z
      .string()
      .nullable()
      .optional()
      .describe("The GitHub Webhook Secret (optional, GitHub only)."),
    // GitLab specific
    gitlabUrl: z
      .string()
      .min(1)
      .optional()
      .describe(
        "The GitLab instance URL (e.g., https://gitlab.com). Required for GitLab updates.",
      ),
    applicationId: z
      .string()
      .optional()
      .describe("The OAuth application ID (optional, GitLab only)."),
    redirectUri: z
      .string()
      .optional()
      .describe("The OAuth redirect URI (optional, GitLab/Gitea)."),
    secret: z
      .string()
      .optional()
      .describe("The OAuth client secret (optional, GitLab only)."),
    groupName: z
      .string()
      .optional()
      .describe(
        "The GitLab group name to filter repositories (optional, GitLab only).",
      ),
    // Gitea specific
    giteaUrl: z
      .string()
      .min(1)
      .optional()
      .describe(
        "The Gitea instance URL (e.g., https://gitea.example.com). Required for Gitea updates.",
      ),
    clientId: z
      .string()
      .optional()
      .describe("The OAuth client ID (optional, Gitea only)."),
    clientSecret: z
      .string()
      .optional()
      .describe("The OAuth client secret (optional, Gitea only)."),
    scopes: z
      .string()
      .optional()
      .describe("OAuth scopes to request (optional, Gitea only)."),
    lastAuthenticatedAt: z
      .number()
      .optional()
      .describe(
        "Last authentication timestamp in milliseconds (optional, Gitea only).",
      ),
    giteaUsername: z
      .string()
      .optional()
      .describe("The Gitea username (optional, Gitea only)."),
    organizationName: z
      .string()
      .optional()
      .describe(
        "The organization name to filter repositories (optional, Gitea only).",
      ),
    // Bitbucket specific
    bitbucketUsername: z
      .string()
      .optional()
      .describe("The Bitbucket username (optional, Bitbucket only)."),
    bitbucketEmail: z
      .string()
      .email()
      .optional()
      .describe("The Bitbucket email address (optional, Bitbucket only)."),
    appPassword: z
      .string()
      .optional()
      .describe(
        "The Bitbucket app password for authentication (optional, Bitbucket only).",
      ),
    apiToken: z
      .string()
      .optional()
      .describe("The Bitbucket API token (optional, Bitbucket only)."),
    bitbucketWorkspaceName: z
      .string()
      .optional()
      .describe("The Bitbucket workspace name (optional, Bitbucket only)."),
    organizationId: z
      .string()
      .optional()
      .describe("The organization ID (optional, Bitbucket only)."),
    // Common token fields (GitLab only)
    accessToken: z
      .string()
      .nullable()
      .optional()
      .describe(
        "The OAuth access token (optional, GitLab only supports null).",
      ),
    refreshToken: z
      .string()
      .nullable()
      .optional()
      .describe(
        "The OAuth refresh token (optional, GitLab only supports null).",
      ),
    expiresAt: z
      .number()
      .nullable()
      .optional()
      .describe(
        "Token expiration timestamp in milliseconds (optional, GitLab only supports null).",
      ),
  }),
  annotations: {
    title: "Update Git Provider",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { provider, providerId, gitProviderId, name } = input;
    const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Build endpoint and payload based on provider
    let endpoint: string;
    let payload: Record<string, unknown>;

    switch (provider) {
      case "github":
        // GitHub requires: githubId (min 1), githubAppName (min 1), gitProviderId (min 1), name (min 1)
        if (!input.githubAppName || input.githubAppName.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "GitHub requires githubAppName with at least 1 character",
          );
        }
        if (!gitProviderId || gitProviderId.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "GitHub requires gitProviderId with at least 1 character",
          );
        }
        endpoint = "/github.update";
        payload = {
          githubId: providerId,
          gitProviderId,
          name,
          githubAppName: input.githubAppName,
          githubAppId: input.githubAppId,
          githubClientId: input.githubClientId,
          githubClientSecret: input.githubClientSecret,
          githubInstallationId: input.githubInstallationId,
          githubPrivateKey: input.githubPrivateKey,
          githubWebhookSecret: input.githubWebhookSecret,
        };
        break;
      case "gitlab":
        // GitLab requires: gitlabId (min 1), gitlabUrl (min 1), gitProviderId (required), name (min 1)
        if (!input.gitlabUrl || input.gitlabUrl.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "GitLab requires gitlabUrl with at least 1 character",
          );
        }
        if (gitProviderId === undefined) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "GitLab requires gitProviderId",
          );
        }
        endpoint = "/gitlab.update";
        payload = {
          gitlabId: providerId,
          gitProviderId,
          name,
          gitlabUrl: input.gitlabUrl,
          applicationId: input.applicationId,
          redirectUri: input.redirectUri,
          secret: input.secret,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          groupName: input.groupName,
          expiresAt: input.expiresAt,
        };
        break;
      case "gitea":
        // Gitea requires: giteaId (min 1), giteaUrl (min 1), gitProviderId (required), name (min 1)
        if (!input.giteaUrl || input.giteaUrl.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "Gitea requires giteaUrl with at least 1 character",
          );
        }
        if (gitProviderId === undefined) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "Gitea requires gitProviderId",
          );
        }
        endpoint = "/gitea.update";
        payload = {
          giteaId: providerId,
          gitProviderId,
          name,
          giteaUrl: input.giteaUrl,
          redirectUri: input.redirectUri,
          clientId: input.clientId,
          clientSecret: input.clientSecret,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          expiresAt: input.expiresAt,
          scopes: input.scopes,
          lastAuthenticatedAt: input.lastAuthenticatedAt,
          giteaUsername: input.giteaUsername,
          organizationName: input.organizationName,
        };
        break;
      case "bitbucket":
        // Bitbucket requires: bitbucketId (min 1), gitProviderId (required), name (min 1)
        if (gitProviderId === undefined) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "Bitbucket requires gitProviderId",
          );
        }
        endpoint = "/bitbucket.update";
        payload = {
          bitbucketId: providerId,
          gitProviderId,
          name,
          bitbucketUsername: input.bitbucketUsername,
          bitbucketEmail: input.bitbucketEmail,
          appPassword: input.appPassword,
          apiToken: input.apiToken,
          bitbucketWorkspaceName: input.bitbucketWorkspaceName,
          organizationId: input.organizationId,
        };
        break;
    }

    // Remove undefined values
    payload = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined),
    );

    const response = await apiClient.post(endpoint, payload);

    return ResponseFormatter.success(
      `Successfully updated ${providerLabel} provider "${name}"`,
      response.data,
    );
  },
});
