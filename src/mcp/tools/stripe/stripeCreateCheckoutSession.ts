import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const stripeCreateCheckoutSession = createTool({
  name: "stripe-create-checkout-session",
  description: "Creates a Stripe checkout session in Dokploy.",
  schema: z.object({
    productId: z.string().describe("The Stripe product ID to purchase. Required."),
    serverQuantity: z
      .number()
      .min(1)
      .describe("The number of servers to purchase. Must be at least 1. Required."),
    isAnnual: z.boolean().describe("Whether this is an annual subscription (true) or monthly (false). Required."),
  }),
  annotations: {
    title: "Create Stripe Checkout Session",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/stripe.createCheckoutSession", {
      productId: input.productId,
      serverQuantity: input.serverQuantity,
      isAnnual: input.isAnnual,
    });

    return ResponseFormatter.success(
      "Successfully created Stripe checkout session",
      response.data,
    );
  },
});
