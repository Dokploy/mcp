import { z } from "zod";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { collectWebSocketLogs } from "../../../utils/websocketLogs.js";
import { createTool } from "../toolFactory.js";

export const applicationReadDeploymentLogs = createTool({
  name: "application-readDeploymentLogs",
  description:
    "Reads deployment logs via Dokploy websocket and returns a snapshot.",
  schema: z.object({
    logPath: z
      .string()
      .describe("Deployment log path provided by Dokploy deployment metadata."),
    serverId: z
      .string()
      .optional()
      .describe("Optional Dokploy server ID for remote hosts."),
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
    title: "Read Application Deployment Logs",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const result = await collectWebSocketLogs({
      path: "/listen-deployment",
      query: {
        logPath: input.logPath,
        serverId: input.serverId,
      },
      ...(input.timeoutMs !== undefined ? { timeoutMs: input.timeoutMs } : {}),
      ...(input.maxChars !== undefined ? { maxChars: input.maxChars } : {}),
    });

    if (!result.logs) {
      return ResponseFormatter.success(
        `No deployment logs received for path "${input.logPath}" in the selected time window.`,
        {
          logPath: input.logPath,
          messageCount: result.messageCount,
          timedOut: result.timedOut,
        }
      );
    }

    return ResponseFormatter.success(
      `Collected deployment logs for path "${input.logPath}".`,
      {
        logPath: input.logPath,
        messageCount: result.messageCount,
        timedOut: result.timedOut,
        truncated: result.truncated,
        logs: result.logs,
      }
    );
  },
});
