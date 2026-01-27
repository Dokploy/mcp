import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetReleaseTag = createTool({
  name: "settings-get-release-tag",
  description: "Gets the current release tag for Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Release Tag",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.getReleaseTag");

    return ResponseFormatter.success(
      "Successfully fetched release tag",
      response.data,
    );
  },
});
