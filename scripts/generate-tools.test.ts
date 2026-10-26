import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const temporaryDirectories: string[] = [];

function generate(paths: Record<string, unknown>) {
  const directory = mkdtempSync(join(tmpdir(), "dokploy-generate-"));
  temporaryDirectories.push(directory);
  mkdirSync(join(directory, "scripts"));
  mkdirSync(join(directory, "src/generated"), { recursive: true });
  symlinkSync(join(projectRoot, "node_modules"), join(directory, "node_modules"), "junction");
  copyFileSync(
    join(projectRoot, "scripts/generate-tools.ts"),
    join(directory, "scripts/generate-tools.ts"),
  );
  writeFileSync(join(directory, "package.json"), JSON.stringify({ type: "module" }));
  writeFileSync(join(directory, "src/generated/openapi.json"), JSON.stringify({ paths }));
  writeFileSync(join(directory, "src/generated/tools.ts"), "original tools\n");
  writeFileSync(join(directory, "TOOLS.md"), "original docs\n");
  const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/generate-tools.ts"], {
    cwd: directory,
    encoding: "utf8",
    timeout: 15000,
    env: { PATH: process.env.PATH ?? "" },
  });
  if (result.error) throw result.error;
  return {
    ...result,
    tools: readFileSync(join(directory, "src/generated/tools.ts"), "utf8"),
    docs: readFileSync(join(directory, "TOOLS.md"), "utf8"),
  };
}

const validOperation = { get: { operationId: "project-all", tags: ["project"] } };

describe("tool generator failure handling", () => {
  afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("writes both artifacts for a valid specification", () => {
    const result = generate({ "/project.all": validOperation });
    expect(result.status).toBe(0);
    expect(result.tools).toContain('name: "project-all"');
    expect(result.docs).toContain("**Total Tools**: 1");
  });

  it("fails without replacing either artifact when one schema cannot be converted", () => {
    const result = generate({
      "/project.all": validOperation,
      "/broken": {
        post: {
          operationId: "broken-create",
          requestBody: {
            content: {
              "application/json": { schema: { type: "object", properties: { invalid: null } } },
            },
          },
        },
      },
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broken-create");
    expect(result.tools).toBe("original tools\n");
    expect(result.docs).toBe("original docs\n");
  });
});
