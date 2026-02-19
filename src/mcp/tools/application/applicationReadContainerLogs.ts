import { z } from "zod";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { collectWebSocketLogs } from "../../../utils/websocketLogs.js";
import { createTool } from "../toolFactory.js";

export const applicationReadContainerLogs = createTool({
  name: "application-readContainerLogs",
  description:
    "Reads real-time container logs via Dokploy websocket and returns a snapshot.",
  schema: z.object({
    containerId: z
      .string()
      .describe("Container ID to stream logs from (required)."),
    runType: z
      .enum(["native", "swarm"])
      .optional()
      .describe("Container runtime mode. Defaults to 'native'."),
    serverId: z
      .string()
      .optional()
      .describe("Optional Dokploy server ID for remote hosts."),
    tail: z
      .string()
      .optional()
      .describe("Number of lines to read from end before follow (default: 100)."),
    since: z
      .string()
      .optional()
      .describe("Time window, e.g. 'all', '10m', '1h' (default: all)."),
    search: z
      .string()
      .optional()
      .describe("Optional case-insensitive text filter."),
    timeoutMs: z
      .number()
      .int()
      .min(1000)
      .max(30000)
      .optional()
      .describe("How long to collect log stream before returning (default: 5000)."),
    maxChars: z
      .number()
      .int()
      .min(500)
      .max(200000)
      .optional()
      .describe("Maximum number of log characters to return (default: 30000)."),
  }),
  annotations: {
    title: "Read Application Container Logs",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await collectWebSocketLogs({
      path: "/docker-container-logs",
      query: {
        containerId: input.containerId,
        runType: input.runType ?? "native",
        serverId: input.serverId,
        tail: input.tail ?? "100",
        since: input.since ?? "all",
        search: input.search ?? "",
      },
      ...(input.timeoutMs !== undefined ? { timeoutMs: input.timeoutMs } : {}),
      ...(input.maxChars !== undefined ? { maxChars: input.maxChars } : {}),
    });

    if (!result.logs) {
      return ResponseFormatter.success(
        `No logs received for container "${input.containerId}" in the selected time window.`,
        {
          containerId: input.containerId,
          messageCount: result.messageCount,
          timedOut: result.timedOut,
        }
      );
    }

    return ResponseFormatter.success(
      `Collected logs for container "${input.containerId}".`,
      {
        containerId: input.containerId,
        messageCount: result.messageCount,
        timedOut: result.timedOut,
        truncated: result.truncated,
        logs: result.logs,
      }
    );
  },
});
