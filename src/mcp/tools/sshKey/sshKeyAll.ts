import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const sshKeyAll = createTool({
  name: "ssh-key-all",
  description: "Gets all SSH keys in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List All SSH Keys",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const sshKeys = await apiClient.get("/sshKey.all");

    return ResponseFormatter.success(
      "Successfully fetched all SSH keys",
      sshKeys.data,
    );
  },
});
