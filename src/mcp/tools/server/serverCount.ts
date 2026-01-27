import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverCount = createTool({
  name: "server-count",
  description: "Gets the count of servers in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Server Count",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/server.count");

    return ResponseFormatter.success(
      "Successfully fetched server count",
      response.data
    );
  },
});
