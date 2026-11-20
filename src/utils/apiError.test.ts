import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { getServerErrorMessage } from "./apiError.js";

const makeAxiosError = (data: unknown) =>
  new AxiosError("Request failed with status code 400", "ERR_BAD_REQUEST", undefined, undefined, {
    data,
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: {} as never,
  });

describe("getServerErrorMessage", () => {
  it("returns the server's validation messages", () => {
    const error = makeAxiosError({
      message: "Input validation failed",
      code: "BAD_REQUEST",
      issues: [
        {
          code: "invalid_format",
          path: ["password"],
          message:
            "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character",
        },
      ],
    });

    expect(getServerErrorMessage(error)).toBe(
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character",
    );
  });

  it("returns the server's error message", () => {
    const error = makeAxiosError({
      message: "Current password is incorrect",
      code: "BAD_REQUEST",
    });

    expect(getServerErrorMessage(error)).toBe("Current password is incorrect");
  });

  it("ignores a message that is only the error code", () => {
    const error = makeAxiosError({ message: "FORBIDDEN", code: "FORBIDDEN" });

    expect(getServerErrorMessage(error)).toBeUndefined();
  });

  it("returns undefined when the server sent no message", () => {
    expect(getServerErrorMessage(makeAxiosError("<html>"))).toBeUndefined();
    expect(getServerErrorMessage(new Error("Network Error"))).toBeUndefined();
  });
});
