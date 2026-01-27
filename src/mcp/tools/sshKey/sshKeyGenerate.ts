import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const sshKeyGenerate = createTool({
  name: "ssh-key-generate",
  description: "Generates a new SSH key pair in Dokploy.",
  schema: z.object({
    type: z
      .enum(["rsa", "ed25519"])
      .optional()
      .describe("The type of SSH key to generate. Either 'rsa' (2048-bit) or 'ed25519' (more secure, recommended). Optional."),
  }),
  annotations: {
    title: "Generate SSH Key",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/sshKey.generate", input);

    return ResponseFormatter.success(
      "SSH key pair generated successfully",
      response.data,
    );
  },
});
