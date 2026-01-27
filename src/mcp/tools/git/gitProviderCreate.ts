import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Note: GitHub uses app installation, not direct creation like the others
const providerSchema = z.enum(["gitlab", "gitea", "bitbucket"]);

export const gitProviderCreate = createTool({
  name: "git-provider-create",
  description:
    "Creates a new git provider (GitLab, Gitea, or Bitbucket) in Dokploy. Note: GitHub providers are created via app installation, not this endpoint.",
  schema: z.object({
    provider: providerSchema.describe(
      "The git provider type to create: gitlab, gitea, or bitbucket. GitHub uses app installation instead.",
    ),
    name: z
      .string()
      .min(1)
      .describe(
        "Display name for the git provider. Required for all providers.",
      ),
    // GitLab specific required fields
    gitlabUrl: z
      .string()
      .min(1)
      .optional()
      .describe(
        "The GitLab instance URL (e.g., https://gitlab.com). Required for GitLab.",
      ),
    authId: z
      .string()
      .min(1)
      .optional()
      .describe(
        "The authentication ID for OAuth. Required for GitLab and Bitbucket.",
      ),
    // GitLab optional fields
    gitlabId: z
      .string()
      .optional()
      .describe("The GitLab provider ID (optional, GitLab only)."),
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
    // Gitea specific required fields
    giteaUrl: z
      .string()
      .min(1)
      .optional()
      .describe(
        "The Gitea instance URL (e.g., https://gitea.example.com). Required for Gitea.",
      ),
    // Gitea optional fields
    giteaId: z
      .string()
      .optional()
      .describe("The Gitea provider ID (optional, Gitea only)."),
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
        "The Gitea organization name to filter repositories (optional, Gitea only).",
      ),
    // Bitbucket optional fields
    bitbucketId: z
      .string()
      .optional()
      .describe("The Bitbucket provider ID (optional, Bitbucket only)."),
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
    // Common optional fields
    gitProviderId: z
      .string()
      .optional()
      .describe("The parent git provider ID (optional)."),
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
    title: "Create Git Provider",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { provider, name } = input;
    const providerLabel = provider.charAt(0).toUpperCase() + provider.slice(1);

    // Build endpoint and payload based on provider
    let endpoint: string;
    let payload: Record<string, unknown>;

    switch (provider) {
      case "gitlab":
        // GitLab requires: gitlabUrl (min 1), authId (min 1), name (min 1)
        if (!input.gitlabUrl || input.gitlabUrl.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "GitLab requires gitlabUrl with at least 1 character",
          );
        }
        if (!input.authId || input.authId.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "GitLab requires authId with at least 1 character",
          );
        }
        endpoint = "/gitlab.create";
        payload = {
          name,
          gitlabUrl: input.gitlabUrl,
          authId: input.authId,
          gitlabId: input.gitlabId,
          applicationId: input.applicationId,
          redirectUri: input.redirectUri,
          secret: input.secret,
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          groupName: input.groupName,
          expiresAt: input.expiresAt,
          gitProviderId: input.gitProviderId,
        };
        break;
      case "gitea":
        // Gitea requires: giteaUrl (min 1), name (min 1)
        if (!input.giteaUrl || input.giteaUrl.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "Gitea requires giteaUrl with at least 1 character",
          );
        }
        endpoint = "/gitea.create";
        payload = {
          name,
          giteaUrl: input.giteaUrl,
          giteaId: input.giteaId,
          redirectUri: input.redirectUri,
          clientId: input.clientId,
          clientSecret: input.clientSecret,
          gitProviderId: input.gitProviderId,
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
        // Bitbucket requires: authId (min 1), name (min 1)
        if (!input.authId || input.authId.length < 1) {
          return ResponseFormatter.error(
            "Missing required parameter",
            "Bitbucket requires authId with at least 1 character",
          );
        }
        endpoint = "/bitbucket.create";
        payload = {
          name,
          authId: input.authId,
          bitbucketId: input.bitbucketId,
          bitbucketUsername: input.bitbucketUsername,
          bitbucketEmail: input.bitbucketEmail,
          appPassword: input.appPassword,
          apiToken: input.apiToken,
          bitbucketWorkspaceName: input.bitbucketWorkspaceName,
          gitProviderId: input.gitProviderId,
        };
        break;
    }

    // Remove undefined values
    payload = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined),
    );

    const response = await apiClient.post(endpoint, payload);

    return ResponseFormatter.success(
      `Successfully created ${providerLabel} provider "${name}"`,
      response.data,
    );
  },
});
