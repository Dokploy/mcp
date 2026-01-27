import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const stripeCreateCustomerPortalSession = createTool({
  name: "stripe-create-customer-portal-session",
  description: "Creates a Stripe customer portal session in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Create Stripe Customer Portal Session",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.post(
      "/stripe.createCustomerPortalSession",
      {},
    );

    return ResponseFormatter.success(
      "Successfully created Stripe customer portal session",
      response.data,
    );
  },
});
