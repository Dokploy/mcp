import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import type { ToolDefinition } from "./types.js";

const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock("./utils/apiClient.js", () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

vi.mock("./utils/clientConfig.js", () => ({
  getClientConfig: () => ({
    url: "https://dokploy.example.com",
    apiKey: "test-key",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    customHeaders: {},
    redactEnv: false,
    redactFields: [],
  }),
}));

const { createHandler } = await import("./handler.js");

describe("createHandler", () => {
  let tempDir: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    tempDir = await mkdtemp(join(tmpdir(), "dokploy-mcp-test-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("sends FormData with file blob and multipart content-type for multipart tools", async () => {
    const zipFilePath = join(tempDir, "bundle.zip");
    const payload = Buffer.from("PK\x03\x04fake-zip-content");
    await writeFile(zipFilePath, payload);

    mockPost.mockResolvedValueOnce({ data: { deployed: true } });

    const multipartTool: ToolDefinition = {
      name: "application-dropDeployment",
      description: "POST /application.dropDeployment",
      tag: "application",
      method: "POST",
      path: "/application.dropDeployment",
      bodyType: "multipart",
      fileFields: { zipPath: "zip" },
      schema: z.object({
        applicationId: z.string(),
        zipPath: z.string().min(1),
        dropBuildPath: z.string().optional(),
      }),
    };

    const handler = createHandler(multipartTool);
    const result = await handler({
      applicationId: "app-123",
      zipPath: zipFilePath,
      dropBuildPath: undefined,
    });

    expect(result.isError).toBeUndefined();
    expect(mockPost).toHaveBeenCalledTimes(1);

    const [calledPath, calledBody, calledConfig] = mockPost.mock.calls[0];
    expect(calledPath).toBe("/application.dropDeployment");
    expect(calledBody).toBeInstanceOf(FormData);
    expect(calledConfig).toEqual({
      headers: { "Content-Type": "multipart/form-data" },
    });

    const form = calledBody as FormData;
    expect(form.get("applicationId")).toBe("app-123");
    expect(form.get("dropBuildPath")).toBeNull();

    const zipEntry = form.get("zip") as File;
    expect(zipEntry).toBeInstanceOf(Blob);
    expect(zipEntry.name).toBe("bundle.zip");
    expect(zipEntry.size).toBe(payload.byteLength);
  });

  it("returns a clear File not found error without making an HTTP call when file is missing", async () => {
    const missingPath = join(tempDir, "does-not-exist.zip");

    const multipartTool: ToolDefinition = {
      name: "application-dropDeployment",
      description: "POST /application.dropDeployment",
      tag: "application",
      method: "POST",
      path: "/application.dropDeployment",
      bodyType: "multipart",
      fileFields: { zipPath: "zip" },
      schema: z.object({
        applicationId: z.string(),
        zipPath: z.string().min(1),
      }),
    };

    const handler = createHandler(multipartTool);
    const result = await handler({
      applicationId: "app-123",
      zipPath: missingPath,
    });

    expect(result.isError).toBe(true);
    const parsedError = JSON.parse(result.content[0]?.text ?? "{}") as { details?: string };
    expect(parsedError.details).toBe(`File not found: ${missingPath}`);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("keeps standard JSON POST behavior for non-multipart tools", async () => {
    mockPost.mockResolvedValueOnce({ data: { ok: true } });

    const jsonTool: ToolDefinition = {
      name: "application-deploy",
      description: "POST /application.deploy",
      tag: "application",
      method: "POST",
      path: "/application.deploy",
      schema: z.object({
        applicationId: z.string(),
      }),
    };

    const handler = createHandler(jsonTool);
    const result = await handler({ applicationId: "app-456" });

    expect(result.isError).toBeUndefined();
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith("/application.deploy", {
      applicationId: "app-456",
    });
  });
});
