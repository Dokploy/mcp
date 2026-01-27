import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsSaveSSHPrivateKey = createTool({
  name: "settings-save-ssh-private-key",
  description: "Saves an SSH private key in Dokploy.",
  schema: z.object({
    sshPrivateKey: z
      .string()
      .nullable()
      .describe(
        "The SSH private key to save. Set to null to clear the existing key.",
      ),
  }),
  annotations: {
    title: "Save SSH Private Key",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/settings.saveSSHPrivateKey", input);

    return ResponseFormatter.success(
      "SSH private key saved successfully",
      response.data,
    );
  },
});
