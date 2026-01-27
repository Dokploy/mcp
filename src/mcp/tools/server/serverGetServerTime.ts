import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverGetServerTime = createTool({
  name: "server-get-server-time",
  description: "Gets the current time of the Dokploy server.",
  schema: z.object({}),
  annotations: {
    title: "Get Server Time",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/server.getServerTime");

    return ResponseFormatter.success(
      "Successfully fetched server time",
      response.data
    );
  },
});
