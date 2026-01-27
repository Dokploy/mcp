import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const gitProviderGetUrl = createTool({
  name: "git-provider-get-url",
  description:
    "Gets the instance URL for a Gitea provider in Dokploy. This is useful for retrieving the base URL of a self-hosted Gitea instance.",
  schema: z.object({
    giteaId: z
      .string()
      .min(1)
      .describe(
        "The Gitea provider ID. Required. Used to identify which Gitea provider's URL to retrieve.",
      ),
  }),
  annotations: {
    title: "Get Gitea URL",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/gitea.getGiteaUrl?giteaId=${encodeURIComponent(input.giteaId)}`,
    );

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch Gitea URL",
        `Unable to retrieve URL for Gitea provider "${input.giteaId}"`,
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched URL for Gitea provider "${input.giteaId}"`,
      response.data,
    );
  },
});
