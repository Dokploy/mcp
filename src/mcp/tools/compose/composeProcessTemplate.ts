import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const composeProcessTemplate = createTool({
  name: "compose-processTemplate",
  description: "Processes a compose template with base64-encoded content.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose project."),
    base64: z.string().describe("Base64-encoded compose template content."),
  }),
  annotations: {
    title: "Process Compose Template",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/compose.processTemplate", input);

    return ResponseFormatter.success(
      `Template processed successfully for compose project "${input.composeId}"`,
      response.data,
    );
  },
});
