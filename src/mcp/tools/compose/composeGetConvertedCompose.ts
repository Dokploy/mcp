import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeGetConvertedCompose = createTool({
  name: "compose-getConvertedCompose",
  description:
    "Gets the converted/processed compose file with environment variables substituted.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose project."),
  }),
  annotations: {
    title: "Get Converted Compose File",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const converted = await apiClient.get(
      `/compose.getConvertedCompose?composeId=${input.composeId}`,
    );

    if (!converted?.data) {
      return ResponseFormatter.error(
        "Failed to get converted compose",
        `Could not get converted compose file for project "${input.composeId}"`,
      );
    }

    return ResponseFormatter.success(
      `Successfully retrieved converted compose file for project "${input.composeId}"`,
      converted.data,
    );
  },
});
