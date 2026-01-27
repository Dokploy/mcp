import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userGenerateToken = createTool({
  name: "user-generate-token",
  description: "Generates a new token for the current user in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Generate User Token",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/user.generateToken", {});

    return ResponseFormatter.success(
      "Token generated successfully",
      response.data,
    );
  },
});
