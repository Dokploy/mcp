import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const portUpdate = createTool({
  name: "port-update",
  description: "Updates an existing port mapping in Dokploy.",
  schema: z.object({
    portId: z.string().min(1).describe("The ID of the port mapping to update. Required."),
    publishedPort: z
      .number()
      .describe("The external port to expose on the host machine. Required."),
    targetPort: z
      .number()
      .describe("The internal port the container is listening on. Required."),
    publishMode: z
      .enum(["ingress", "host"])
      .default("ingress")
      .optional()
      .describe(
        "Port publish mode: 'ingress' for load-balanced routing across swarm nodes, 'host' for direct host port binding. Defaults to 'ingress'."
      ),
    protocol: z
      .enum(["tcp", "udp"])
      .default("tcp")
      .optional()
      .describe("Network protocol for the port mapping: 'tcp' or 'udp'. Defaults to 'tcp'."),
  }),
  annotations: {
    title: "Update Port Mapping",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/port.update", input);

    return ResponseFormatter.success(
      `Port mapping "${input.portId}" updated successfully`,
      response.data,
    );
  },
});
