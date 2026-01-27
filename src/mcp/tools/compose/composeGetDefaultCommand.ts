import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeGetDefaultCommand = createTool({
  name: "compose-getDefaultCommand",
  description: "Gets the default docker-compose command for a compose project.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose project."),
  }),
  annotations: {
    title: "Get Default Compose Command",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const command = await apiClient.get(
      `/compose.getDefaultCommand?composeId=${input.composeId}`,
    );

    if (!command?.data) {
      return ResponseFormatter.error(
        "Failed to get default command",
        `Could not get default command for compose project "${input.composeId}"`,
      );
    }

    return ResponseFormatter.success(
      `Successfully retrieved default command for compose project "${input.composeId}"`,
      command.data,
    );
  },
});
