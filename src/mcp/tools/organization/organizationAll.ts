import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const organizationAll = createTool({
  name: "organization-all",
  description: "Gets all organizations in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get All Organizations",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/organization.all");

    return ResponseFormatter.success(
      "Successfully fetched all organizations",
      response.data,
    );
  },
});
