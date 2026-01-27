import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const redirectsDelete = createTool({
  name: "redirects-delete",
  description: "Deletes a redirect rule from Dokploy.",
  schema: z.object({
    redirectId: z
      .string()
      .min(1)
      .describe("The unique identifier of the redirect rule to delete. Required."),
  }),
  annotations: {
    title: "Delete Redirect",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/redirects.delete", input);

    return ResponseFormatter.success(
      `Redirect "${input.redirectId}" deleted successfully`,
      response.data,
    );
  },
});
