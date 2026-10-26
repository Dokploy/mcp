import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { classifyApiError } from "./apiError.js";

function failure(status: number | undefined, method = "get", code = "ERR_BAD_RESPONSE") {
  return {
    isAxiosError: true,
    message: "SECRET_BODY_OR_KEY",
    code,
    config: { method, headers: { "x-api-key": "SECRET_KEY" } },
    ...(status === undefined
      ? {}
      : {
          response: { status, data: { message: "SECRET_BODY" }, headers: { "retry-after": "12" } },
        }),
  };
}

describe("safe API diagnostics", () => {
  it.each([
    [401, "AUTHENTICATION_REQUIRED"],
    [403, "PERMISSION_DENIED"],
    [404, "NOT_FOUND"],
    [400, "INVALID_REQUEST"],
    [422, "INVALID_REQUEST"],
    [429, "RATE_LIMITED"],
    [503, "UPSTREAM_UNAVAILABLE"],
    [500, "UPSTREAM_ERROR"],
  ])("classifies HTTP %i by status rather than message", (status, code) => {
    expect(classifyApiError(failure(Number(status)))).toMatchObject({ code, httpStatus: status });
  });
  it("never misclassifies an arbitrary error containing 401 or Not Found", () => {
    expect(classifyApiError(new Error("401 Not Found SECRET"))).toMatchObject({
      code: "INTERNAL_ERROR",
      retryable: false,
    });
  });
  it.each([
    429, 502, 503, 504,
  ])("marks a transient GET, but never a POST, as retryable (%i)", (status) => {
    expect(classifyApiError(failure(status)).retryable).toBe(true);
    expect(classifyApiError(failure(status, "post")).retryable).toBe(false);
  });
  it("distinguishes timeout, cancellation and transport failure", () => {
    expect(classifyApiError(failure(undefined, "get", "ECONNABORTED")).code).toBe("TIMEOUT");
    expect(classifyApiError(failure(undefined, "post", "ETIMEDOUT")).retryable).toBe(false);
    expect(classifyApiError(new AxiosError("SECRET", "ERR_CANCELED")).code).toBe("CANCELLED");
    expect(classifyApiError(failure(undefined)).code).toBe("NETWORK_ERROR");
  });
  it("exposes only bounded numeric Retry-After and no raw secrets", () => {
    for (const status of [401, 403, 404, 422, 429, 503]) {
      expect(JSON.stringify(classifyApiError(failure(status)))).not.toContain("SECRET");
    }
    expect(classifyApiError(failure(429)).retryAfterSeconds).toBe(12);
    const malicious = failure(429);
    malicious.response!.headers["retry-after"] = "SECRET_HEADER";
    expect(classifyApiError(malicious)).not.toHaveProperty("retryAfterSeconds");
  });
});
