import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverPublicIp = createTool({
  name: "server-public-ip",
  description: "Gets the public IP address of the Dokploy server.",
  schema: z.object({}),
  annotations: {
    title: "Get Server Public IP",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/server.publicIp");

    return ResponseFormatter.success(
      "Successfully fetched server public IP",
      response.data
    );
  },
});
