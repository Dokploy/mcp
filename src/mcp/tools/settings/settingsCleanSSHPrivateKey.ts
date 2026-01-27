import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsCleanSSHPrivateKey = createTool({
  name: "settings-clean-ssh-private-key",
  description: "Removes the SSH private key from Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Clean SSH Private Key",
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post("/settings.cleanSSHPrivateKey", {});

    return ResponseFormatter.success(
      "SSH private key removed successfully",
      response.data,
    );
  },
});
