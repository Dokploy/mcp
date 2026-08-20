import { describe, expect, it } from "vitest";
import { decodeBase64Text, throughBase64 } from "./base64Text.js";

const encode = (text: string) => Buffer.from(text, "utf8").toString("base64");

describe("decodeBase64Text", () => {
  it("decodes base64-encoded text", () => {
    const text = "DB_PASSWORD=hunter2\nPORT=3000\n";
    expect(decodeBase64Text(encode(text))).toBe(text);
  });

  it("tolerates the line breaks some encoders insert", () => {
    const text = "a".repeat(80);
    const wrapped = encode(text).replace(/(.{16})/g, "$1\n");
    expect(decodeBase64Text(wrapped)).toBe(text);
  });

  it("rejects plain text that is not base64", () => {
    expect(decodeBase64Text("DB_PASSWORD=hunter2")).toBeNull();
    expect(decodeBase64Text("2026-08-20 INFO server started")).toBeNull();
  });

  it("rejects strings too short to be a meaningful payload", () => {
    expect(decodeBase64Text(encode("hi"))).toBeNull();
  });

  it("rejects binary payloads", () => {
    const binary = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xff, 0xfe]).toString("base64");
    expect(decodeBase64Text(binary)).toBeNull();
  });

  it("rejects a word that happens to fit the base64 alphabet", () => {
    // Decodes to bytes that are not valid UTF-8, so the round-trip guard fires.
    expect(decodeBase64Text("VeryLongIdentifier")).toBeNull();
  });

  it("rejects anything with a character outside the alphabet", () => {
    expect(decodeBase64Text("sha256:754283fc7944b3d06064768c668e0a71")).toBeNull();
  });
});

describe("throughBase64", () => {
  const mask = (text: string) => text.replace(/hunter2/g, "[REDACTED]");

  it("masks inside a base64 payload and re-encodes it", () => {
    const result = throughBase64(encode("DB_PASSWORD=hunter2"), mask);
    expect(Buffer.from(result, "base64").toString("utf8")).toBe("DB_PASSWORD=[REDACTED]");
  });

  it("returns the original encoding byte for byte when nothing was masked", () => {
    const encoded = encode("PORT=3000\nLOG_LEVEL=debug\n");
    expect(throughBase64(encoded, mask)).toBe(encoded);
  });

  it("applies the transform directly to plain text", () => {
    expect(throughBase64("DB_PASSWORD=hunter2", mask)).toBe("DB_PASSWORD=[REDACTED]");
  });

  it("leaves a binary payload untouched", () => {
    const binary = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xff, 0xfe]).toString("base64");
    expect(throughBase64(binary, mask)).toBe(binary);
  });
});
