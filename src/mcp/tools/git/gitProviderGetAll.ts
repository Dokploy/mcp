import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const gitProviderGetAll = createTool({
  name: "git-provider-get-all",
  description:
    "Lists all git providers configured in Dokploy across all provider types (GitHub, GitLab, Gitea, Bitbucket). Returns a combined list of all provider configurations.",
  schema: z.object({}),
  annotations: {
    title: "List All Git Providers",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/gitProvider.getAll");

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch git providers",
        "No git providers found or unable to retrieve the list",
      );
    }

    return ResponseFormatter.success(
      "Successfully fetched all git providers",
      response.data,
    );
  },
});
