import { describe, expect, it } from "vitest";
import { ResponseFormatter } from "./responseFormatter.js";

describe("ResponseFormatter.success", () => {
  it("returns success true and message when no data", () => {
    const result = ResponseFormatter.success("done");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
    expect(parsed.message).toBe("done");
    expect(parsed.data).toBeUndefined();
  });

  it("includes string data (readLogs response)", () => {
    const logs = "2024-01-01 INFO app started\n2024-01-01 INFO listening on :3000";
    const result = ResponseFormatter.success("application-readLogs completed successfully", logs);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toBe(logs);
  });

  it("includes object data", () => {
    const data = { applicationId: "abc", status: "running" };
    const result = ResponseFormatter.success("ok", data);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toEqual(data);
  });

  it("includes numeric data", () => {
    const result = ResponseFormatter.success("ok", 42);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toBe(42);
  });

  it("includes boolean data", () => {
    const result = ResponseFormatter.success("ok", false);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toBe(false);
  });

  it("omits data when null", () => {
    const result = ResponseFormatter.success("ok", null);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toBeUndefined();
  });

  it("omits data when undefined", () => {
    const result = ResponseFormatter.success("ok", undefined);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toBeUndefined();
  });

  it("includes empty string data", () => {
    const result = ResponseFormatter.success("ok", "");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toBe("");
  });

  it("is not marked as error", () => {
    const result = ResponseFormatter.success("ok");
    expect(result.isError).toBeUndefined();
  });
});

describe("ResponseFormatter.error", () => {
  it("returns success false and error message", () => {
    const result = ResponseFormatter.error("something went wrong");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.error).toBe("something went wrong");
    expect(parsed.details).toBeUndefined();
  });

  it("includes details when provided", () => {
    const result = ResponseFormatter.error("failed", "timeout after 30s");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.details).toBe("timeout after 30s");
  });

  it("is marked as error", () => {
    const result = ResponseFormatter.error("failed");
    expect(result.isError).toBe(true);
  });
});
