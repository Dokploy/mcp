import { setTimeout as delay } from "node:timers/promises";
import axios from "axios";

interface RetryOptions {
  method: string;
  attempts: number;
  delayMs: number;
  budgetMs: number;
  signal?: AbortSignal;
}

function retryDelay(error: unknown, fallback: number): number | null {
  if (!axios.isAxiosError(error) || error.code === "ERR_CANCELED") return null;
  const status = error.response?.status;
  // Never retry credential/permission/validation/not-found errors, or ambiguous
  // timeouts/resets after request dispatch. Only explicit transient responses.
  if (![429, 502, 503, 504].includes(status ?? 0)) return null;
  const header = error.response?.headers?.["retry-after"];
  if (header === undefined) return fallback;
  if (typeof header !== "string") return null;
  if (/^\d{1,9}$/.test(header)) return Number(header) * 1000;
  if (!/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(header)) return null;
  const timestamp = Date.parse(header);
  return Number.isFinite(timestamp) ? Math.max(0, timestamp - Date.now()) : null;
}

// A total deadline bounds attempts AND backoff. The caller must apply the given
// remaining timeout to each HTTP request (and propagate cancellation if present).
export async function withReadRetries<T>(
  request: (timeoutMs: number) => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  if (!Number.isFinite(options.budgetMs) || options.budgetMs < 1)
    throw new Error("Request budget must be positive");
  const deadline = Date.now() + options.budgetMs;
  const attempts = Number.isFinite(options.attempts)
    ? Math.min(5, Math.max(0, Math.floor(options.attempts)))
    : 0;
  const baseDelay = Number.isFinite(options.delayMs)
    ? Math.max(0, Math.min(30000, options.delayMs))
    : 1000;
  let retries = 0;
  for (;;) {
    options.signal?.throwIfAborted();
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("Request budget exhausted");
    try {
      return await request(remaining);
    } catch (error) {
      if (options.method.toUpperCase() !== "GET" || retries >= attempts) throw error;
      const wait = retryDelay(error, Math.min(30000, baseDelay * 2 ** retries));
      // Do not shorten Retry-After and retry too early, or exceed the deadline.
      if (wait === null || wait >= deadline - Date.now()) throw error;
      await delay(wait, undefined, { ...(options.signal ? { signal: options.signal } : {}) });
      if (Date.now() >= deadline) throw error;
      retries++;
    }
  }
}
