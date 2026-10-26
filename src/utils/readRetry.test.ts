import { describe, expect, it, vi } from "vitest";
import { withReadRetries } from "./readRetry.js";

const options = { method: "GET", attempts: 3, delayMs: 0, budgetMs: 1000 };
const httpError = (status: number, after?: string) => ({
  isAxiosError: true,
  response: { status, headers: after === undefined ? {} : { "retry-after": after } },
});

describe("bounded GET retry", () => {
  it("recovers from a transient read and passes a remaining timeout", async () => {
    const request = vi.fn().mockRejectedValueOnce(httpError(503)).mockResolvedValue("ok");
    expect(await withReadRetries(request, options)).toBe("ok");
    expect(request).toHaveBeenCalledTimes(2);
    expect(
      request.mock.calls.every(([timeout]) => timeout > 0 && timeout <= options.budgetMs),
    ).toBe(true);
  });
  it.each([429, 502, 503, 504])("never retries a POST, even on %i", async (status) => {
    const error = httpError(status);
    const request = vi.fn().mockRejectedValue(error);
    await expect(withReadRetries(request, { ...options, method: "POST" })).rejects.toBe(error);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it.each([400, 401, 403, 404, 422, 500])("does not retry HTTP %i", async (status) => {
    const error = httpError(status);
    const request = vi.fn().mockRejectedValue(error);
    await expect(withReadRetries(request, options)).rejects.toBe(error);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("never retries an ambiguous transport timeout", async () => {
    const error = { isAxiosError: true, code: "ECONNABORTED" };
    const request = vi.fn().mockRejectedValue(error);
    await expect(withReadRetries(request, options)).rejects.toBe(error);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("bounds retries even with an excessive configured count", async () => {
    const error = httpError(503);
    const request = vi.fn().mockRejectedValue(error);
    await expect(withReadRetries(request, { ...options, attempts: 999 })).rejects.toBe(error);
    expect(request).toHaveBeenCalledTimes(6);
  });
  it.each([
    "120",
    "SECRET_OR_INVALID_HEADER",
    "1.5",
    new Date(Date.now() + 120000).toUTCString(),
  ])("does not retry earlier than Retry-After or retry malformed guidance: %s", async (header) => {
    const error = httpError(429, header);
    const request = vi.fn().mockRejectedValue(error);
    await expect(withReadRetries(request, options)).rejects.toBe(error);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("supports disabling retries", async () => {
    const error = httpError(503);
    const request = vi.fn().mockRejectedValue(error);
    await expect(withReadRetries(request, { ...options, attempts: 0 })).rejects.toBe(error);
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("cancels a wait before another request is sent", async () => {
    const controller = new AbortController();
    const request = vi.fn().mockImplementation(async () => {
      queueMicrotask(() => controller.abort());
      throw httpError(503);
    });
    await expect(
      withReadRetries(request, { ...options, delayMs: 100, signal: controller.signal }),
    ).rejects.toThrow();
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("does not start another attempt after the total budget expires", async () => {
    let now = 0;
    const clock = vi.spyOn(Date, "now").mockImplementation(() => now);
    const error = httpError(503);
    const request = vi.fn().mockImplementation(async () => {
      now = 1001;
      throw error;
    });
    try {
      await expect(withReadRetries(request, options)).rejects.toBe(error);
      expect(request).toHaveBeenCalledTimes(1);
    } finally {
      clock.mockRestore();
    }
  });
});
