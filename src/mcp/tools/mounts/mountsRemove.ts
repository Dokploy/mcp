import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mountsRemove = createTool({
  name: "mounts-remove",
  description:
    "Removes/deletes a mount from a service in Dokploy. This will detach the mount from the service. For file mounts, the file will no longer be available inside the container after the next deployment.",
  schema: z.object({
    mountId: z
      .string()
      .describe("The unique identifier of the mount to remove. Required."),
  }),
  annotations: {
    title: "Remove Mount",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mounts.remove", input);

    return ResponseFormatter.success(
      `Successfully removed mount ${input.mountId}`,
      response?.data ?? { removed: true }
    );
  },
});
