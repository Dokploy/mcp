import { AsyncLocalStorage } from "node:async_hooks";

const requestAuth = new AsyncLocalStorage<{ token: string; mode: "api-key" | "oauth" }>();

export function runWithRequestAuth<T>(
  token: string,
  mode: "api-key" | "oauth",
  callback: () => T,
): T {
  return requestAuth.run({ token, mode }, callback);
}

export function getRequestAuth(): { token: string; mode: "api-key" | "oauth" } | undefined {
  return requestAuth.getStore();
}
