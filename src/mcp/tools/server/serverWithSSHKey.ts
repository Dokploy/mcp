import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverWithSSHKey = createTool({
  name: "server-with-ssh-key",
  description: "Gets all servers that have SSH keys configured in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List Servers With SSH Keys",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/server.withSSHKey");

    return ResponseFormatter.success(
      "Successfully fetched servers with SSH keys",
      response.data
    );
  },
});
