import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const domainGenerateDomain = createTool({
  name: "domain-generateDomain",
  description:
    "Generates a suggested domain for a given application name, optionally scoped to a server.",
  schema: z.object({
    appName: z
      .string()
      .min(1)
      .describe("The application name to generate a domain for."),
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to use when generating the domain."),
  }),
  annotations: {
    title: "Generate Domain",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/domain.generateDomain", input);

    return ResponseFormatter.success(
      `Successfully generated domain for app \"${input.appName}\"`,
      response.data
    );
  },
});
