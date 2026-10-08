import { describe, expect, it } from "vitest";
import { describeOperation, resourceLabel } from "./describe-operation.js";

describe("describeOperation", () => {
  it("uses the shared template for common actions", () => {
    expect(
      describeOperation({
        operationId: "application-one",
        method: "get",
        path: "/application.one",
        requiredParams: ["applicationId"],
      }),
    ).toBe("Get an application by ID. Requires: applicationId. [GET /application.one]");
  });

  it("pluralizes list actions", () => {
    expect(
      describeOperation({ operationId: "registry-all", method: "get", path: "/registry.all" }),
    ).toBe("List Docker registries. [GET /registry.all]");
  });

  it("uses a readable resource name for database tags", () => {
    expect(
      describeOperation({
        operationId: "postgres-stop",
        method: "post",
        path: "/postgres.stop",
        requiredParams: ["postgresId"],
      }),
    ).toBe("Stop a PostgreSQL database. Requires: postgresId. [POST /postgres.stop]");
  });

  it("picks the article by sound for spelled-out acronyms", () => {
    expect(
      describeOperation({ operationId: "sshKey-create", method: "post", path: "/sshKey.create" }),
    ).toBe("Create an SSH key. [POST /sshKey.create]");
  });

  it('uses "a" before a consonant sound spelled with a vowel', () => {
    expect(describeOperation({ operationId: "user-one", method: "get", path: "/user.one" })).toBe(
      "Get a user by ID. [GET /user.one]",
    );
  });

  it("treats list like all", () => {
    expect(
      describeOperation({ operationId: "schedule-list", method: "get", path: "/schedule.list" }),
    ).toBe("List scheduled jobs. [GET /schedule.list]");
  });

  it("humanizes actions without a template and keeps the resource as context", () => {
    expect(
      describeOperation({
        operationId: "application-saveGithubProvider",
        method: "post",
        path: "/application.saveGithubProvider",
      }),
    ).toBe("Save GitHub provider (application). [POST /application.saveGithubProvider]");
  });

  it("warns that saveEnvironment replaces the whole block", () => {
    expect(
      describeOperation({
        operationId: "application-saveEnvironment",
        method: "post",
        path: "/application.saveEnvironment",
      }),
    ).toContain("Overwrites the whole block");
  });

  it("prefers an explicit override over the template", () => {
    expect(
      describeOperation({
        operationId: "application-deploy",
        method: "post",
        path: "/application.deploy",
      }),
    ).toContain("Returns before the build finishes");
  });

  it("falls back to the route when the operationId has no tag", () => {
    expect(describeOperation({ operationId: "health", method: "get", path: "/health" })).toBe(
      "GET /health",
    );
  });
});

describe("resourceLabel", () => {
  it("humanizes tags without an explicit label", () => {
    expect(resourceLabel("dockerDiskUsage")).toBe("Docker disk usage");
  });
});
