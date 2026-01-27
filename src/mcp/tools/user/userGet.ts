import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGet = createTool({
  name: "user-get",
  description: "Gets the current authenticated user information in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Current User",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/user.get");

    return ResponseFormatter.success(
      "Successfully fetched current user",
      response.data,
    );
  },
});
