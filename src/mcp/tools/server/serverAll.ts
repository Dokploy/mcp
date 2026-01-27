import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverAll = createTool({
  name: "server-all",
  description: "Gets all servers in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List All Servers",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/server.all");

    return ResponseFormatter.success(
      "Successfully fetched all servers",
      response.data
    );
  },
});
