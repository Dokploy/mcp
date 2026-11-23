import { createHash, timingSafeEqual } from "node:crypto";

export interface RequestAuth {
  token?: string;
  fingerprint?: Buffer;
}

export function parseBearerAuthorization(
  authorization: string | undefined,
  enabled: boolean,
): RequestAuth | null {
  if (!enabled) return {};
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!match?.[1]) return null;
  const token = match[1];
  return {
    token,
    fingerprint: createHash("sha256").update(token).digest(),
  };
}

export function matchesSessionAuth(
  expected: Buffer | undefined,
  actual: Buffer | undefined,
  enabled: boolean,
): boolean {
  if (!enabled) return true;
  return Boolean(expected && actual && timingSafeEqual(expected, actual));
}
