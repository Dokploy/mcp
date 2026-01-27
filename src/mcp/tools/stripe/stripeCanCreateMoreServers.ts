import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const stripeCanCreateMoreServers = createTool({
  name: "stripe-can-create-more-servers",
  description:
    "Checks if the user can create more servers based on their Stripe subscription in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Check Server Creation Limit",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/stripe.canCreateMoreServers");

    return ResponseFormatter.success(
      "Successfully checked server creation limit",
      response.data,
    );
  },
});
