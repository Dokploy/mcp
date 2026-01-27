import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const serverValidate = createTool({
  name: "server-validate",
  description: "Validates a server connection in Dokploy.",
  schema: z.object({
    serverId: z.string().min(1).describe("The ID of the server to validate."),
  }),
  annotations: {
    title: "Validate Server",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      `/server.validate?serverId=${input.serverId}`
    );

    return ResponseFormatter.success(
      `Server "${input.serverId}" validated successfully`,
      response.data
    );
  },
});
