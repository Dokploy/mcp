import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGetBackups = createTool({
  name: "user-get-backups",
  description: "Gets the backups for the current user in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get User Backups",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/user.getBackups");

    return ResponseFormatter.success(
      "Successfully fetched user backups",
      response.data,
    );
  },
});
