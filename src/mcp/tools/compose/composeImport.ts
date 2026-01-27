import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeImport = createTool({
  name: "compose-import",
  description: "Imports a compose file from base64-encoded content.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose project."),
    base64: z
      .string()
      .describe("Base64-encoded compose file content to import."),
  }),
  annotations: {
    title: "Import Compose File",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.import", input);

    return ResponseFormatter.success(
      `Compose file imported successfully for project "${input.composeId}"`,
      response.data,
    );
  },
});
