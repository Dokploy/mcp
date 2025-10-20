import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";

export const domainCanGenerateTraefikMeDomains = createTool({
  name: "domain-canGenerateTraefikMeDomains",
  description:
    "Checks whether Traefik.me domains can be generated for a specific server in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .min(1)
      .describe(
        "The server ID to verify Traefik.me domain generation support for."
      ),
  }),
  annotations: {
    title: "Can Generate Traefik.me Domains",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.get(
      "/domain.canGenerateTraefikMeDomains",
      {
        params: {
          serverId: input.serverId,
        },
      }
    );

    return ResponseFormatter.success(
      `Retrieved Traefik.me domain generation availability for server ${input.serverId}`,
      response.data
    );
  },
});
