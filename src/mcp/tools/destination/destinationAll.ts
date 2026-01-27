import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const destinationAll = createTool({
  name: "destination-all",
  description: "Gets all backup destinations in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "List All Destinations",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const destinations = await apiClient.get("/destination.all");

    return ResponseFormatter.success(
      "Successfully fetched all destinations",
      destinations.data,
    );
  },
});
