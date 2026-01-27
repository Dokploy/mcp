import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const aiGetAll = createTool({
  name: "ai-get-all",
  description: "Gets all AI configurations in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get All AI Configurations",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/ai.getAll");

    return ResponseFormatter.success(
      "Successfully fetched all AI configurations",
      response.data,
    );
  },
});
