import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsGetOpenApiDocument = createTool({
  name: "settings-get-openapi-document",
  description: "Gets the OpenAPI documentation for Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get OpenAPI Document",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/settings.getOpenApiDocument");

    return ResponseFormatter.success(
      "Successfully fetched OpenAPI document",
      response.data,
    );
  },
});
