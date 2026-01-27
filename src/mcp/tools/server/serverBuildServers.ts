import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverBuildServers = createTool({
  name: "server-build-servers",
  description: "Gets all build servers in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List Build Servers",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/server.buildServers");

    return ResponseFormatter.success(
      "Successfully fetched build servers",
      response.data
    );
  },
});
