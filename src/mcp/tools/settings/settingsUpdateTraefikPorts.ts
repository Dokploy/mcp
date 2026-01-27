import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const settingsUpdateTraefikPorts = createTool({
  name: "settings-update-traefik-ports",
  description: "Updates Traefik ports configuration in Dokploy.",
  schema: z.object({
    serverId: z
      .string()
      .optional()
      .describe("Optional server ID to update ports on a specific server."),
    additionalPorts: z
      .array(
        z.object({
          targetPort: z
            .number()
            .describe("The target port inside the container."),
          publishedPort: z
            .number()
            .describe("The published port exposed on the host."),
          protocol: z
            .enum(["tcp", "udp", "sctp"])
            .describe("The protocol for the port mapping: tcp, udp, or sctp."),
        }),
      )
      .describe("List of additional ports to configure for Traefik."),
  }),
  annotations: {
    title: "Update Traefik Ports",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post(
      "/settings.updateTraefikPorts",
      input,
    );

    return ResponseFormatter.success(
      "Traefik ports updated successfully",
      response.data,
    );
  },
});
