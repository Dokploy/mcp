import { URL } from "node:url";
import WebSocket, { RawData } from "ws";
import { getClientConfig } from "./clientConfig.js";
import { createLogger } from "./logger.js";

const logger = createLogger("WebSocketLogs");

export interface WebSocketLogOptions {
  path: "/docker-container-logs" | "/listen-deployment";
  query: Record<string, string | undefined>;
  timeoutMs?: number;
  maxChars?: number;
}

export interface WebSocketLogResult {
  logs: string;
  timedOut: boolean;
  truncated: boolean;
  messageCount: number;
}

function getWebSocketBaseUrl(): string {
  const config = getClientConfig();
  const base = new URL(config.dokployUrl);

  if (base.pathname.endsWith("/api")) {
    base.pathname = base.pathname.slice(0, -4) || "/";
  }

  base.pathname = base.pathname.replace(/\/+$/, "") || "/";
  base.search = "";
  base.hash = "";
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";

  return base.toString().replace(/\/$/, "");
}

export async function collectWebSocketLogs(
  options: WebSocketLogOptions
): Promise<WebSocketLogResult> {
  const config = getClientConfig();
  const timeoutMs = options.timeoutMs ?? 5000;
  const maxChars = options.maxChars ?? 30000;

  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(options.query)) {
    if (value !== undefined && value !== "") {
      queryParams.set(key, value);
    }
  }

  const baseUrl = getWebSocketBaseUrl();
  const wsUrl = `${baseUrl}${options.path}?${queryParams.toString()}`;

  return await new Promise<WebSocketLogResult>((resolve, reject) => {
    let logs = "";
    let truncated = false;
    let timedOut = false;
    let messageCount = 0;

    logger.info("Opening logs websocket", {
      path: options.path,
      timeoutMs,
      maxChars,
      hasApiKey: !!config.authToken,
      queryKeys: Object.keys(options.query),
    });

    const ws = new WebSocket(wsUrl, {
      headers: {
        "x-api-key": config.authToken,
      },
    });

    const timer = setTimeout(() => {
      timedOut = true;
      ws.close(1000, "timeout reached");
    }, timeoutMs);

    ws.on("message", (message: RawData) => {
      messageCount += 1;
      const chunk = message.toString();

      if (logs.length + chunk.length > maxChars) {
        const remaining = Math.max(0, maxChars - logs.length);
        logs += chunk.slice(0, remaining);
        truncated = true;
        ws.close(1000, "max chars reached");
        return;
      }

      logs += chunk;
    });

    ws.on("close", () => {
      clearTimeout(timer);
      resolve({
        logs: logs.trim(),
        timedOut,
        truncated,
        messageCount,
      });
    });

    ws.on("error", (error: Error) => {
      clearTimeout(timer);
      logger.error("WebSocket logs collection failed", {
        path: options.path,
        error: error.message,
      });
      reject(error);
    });
  });
}
