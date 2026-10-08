import { describe, expect, it } from "vitest";
import { deriveAnnotations } from "./derive-annotations.js";

describe("deriveAnnotations", () => {
  it("marks GET operations read-only and idempotent", () => {
    expect(deriveAnnotations("get", "application-one")).toEqual({
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    });
  });

  it.each([
    "application-delete",
    "mounts-remove",
    "settings-cleanAll",
    "settings-cleanUnusedVolumes",
    "docker-killContainer",
    "dockerDiskUsage-pruneBuildCache",
    "application-clearDeployments",
    "whitelabeling-reset",
    "user-revokeSession",
  ])("marks %s destructive and not idempotent", (operationId) => {
    expect(deriveAnnotations("post", operationId)).toEqual({
      destructiveHint: true,
      openWorldHint: true,
    });
  });

  it("matches destructive verbs as whole words only", () => {
    expect(
      deriveAnnotations("post", "settings-updateDockerCleanup").destructiveHint,
    ).toBeUndefined();
    expect(deriveAnnotations("post", "settings-updateLogCleanup").destructiveHint).toBeUndefined();
  });

  it("does not treat dropDeployment (zip upload) as destructive", () => {
    expect(deriveAnnotations("post", "application-dropDeployment").destructiveHint).toBeUndefined();
  });

  it("never marks a GET operation destructive", () => {
    expect(
      deriveAnnotations("get", "settings-getLogCleanupStatus").destructiveHint,
    ).toBeUndefined();
  });

  it.each([
    "application-update",
    "application-saveEnvironment",
    "organization-setDefault",
    "postgres-changeStatus",
  ])("marks %s idempotent", (operationId) => {
    expect(deriveAnnotations("post", operationId).idempotentHint).toBe(true);
  });

  it.each([
    "application-create",
    "application-deploy",
    "application-redeploy",
    "application-start",
    "application-stop",
    "settings-toggleDashboard",
    "user-generateToken",
    "schedule-runManually",
    "environment-duplicate",
    "settings-setupGPU",
  ])("does not claim %s is idempotent", (operationId) => {
    expect(deriveAnnotations("post", operationId).idempotentHint).toBeUndefined();
  });
});
