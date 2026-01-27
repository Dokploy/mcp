import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userHaveRootAccess = createTool({
  name: "user-have-root-access",
  description: "Checks if the current user has root access in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Check Root Access",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/user.haveRootAccess");

    return ResponseFormatter.success(
      "Successfully checked root access status",
      response.data,
    );
  },
});
