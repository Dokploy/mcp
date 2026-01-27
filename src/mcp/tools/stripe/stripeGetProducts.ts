import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const stripeGetProducts = createTool({
  name: "stripe-get-products",
  description: "Gets all Stripe products available in Dokploy.",
  schema: z.object({}),
  annotations: {
    title: "Get Stripe Products",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/stripe.getProducts");

    return ResponseFormatter.success(
      "Successfully fetched Stripe products",
      response.data,
    );
  },
});
