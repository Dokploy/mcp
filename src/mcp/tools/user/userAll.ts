import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const userAll = createTool({
  name: "user-all",
  description: "Gets all users in the Dokploy instance.",
  schema: z.object({}),
  annotations: {
    title: "Get All Users",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/user.all");

    return ResponseFormatter.success(
      "Successfully fetched all users",
      response.data,
    );
  },
});
