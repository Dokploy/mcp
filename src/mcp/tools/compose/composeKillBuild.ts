import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const composeKillBuild = createTool({
  name: "compose-killBuild",
  description: "Kills the build process for a compose stack in Dokploy.",
  schema: z.object({
    composeId: z.string().min(1).describe("The ID of the compose stack to kill build for."),
  }),
  annotations: {
    title: "Kill Compose Build",
    readOnlyHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await apiClient.post("/compose.killBuild", input);
    if (!result?.data) {
      return ResponseFormatter.error("Failed to kill build", `Could not kill build for compose stack "${input.composeId}"`);
    }
    return ResponseFormatter.success(`Successfully killed build for compose stack "${input.composeId}"`, result.data);
  },
});
