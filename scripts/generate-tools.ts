import { readFileSync, writeFileSync } from "fs";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { resolve } from "path";

interface OpenAPISpec {
  paths: Record<string, Record<string, OperationObject>>;
}

interface OperationObject {
  operationId: string;
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: ParameterObject[];
  requestBody?: {
    content: {
      "application/json": {
        schema: Record<string, unknown>;
      };
    };
  };
}

interface ParameterObject {
  name: string;
  in: string;
  schema: Record<string, unknown>;
  required?: boolean;
  description?: string;
}

const SPEC_PATH = resolve(import.meta.dirname, "../src/generated/openapi.json");
const OUTPUT_PATH = resolve(import.meta.dirname, "../src/generated/tools.ts");

function deriveAnnotations(method: string, operationId: string): string {
  const id = operationId.toLowerCase();
  const isRead = method === "get";
  const isDelete = id.includes("delete") || id.includes("remove");
  const isCreate = id.includes("create");

  const annotations: Record<string, boolean> = {};

  if (isRead) {
    annotations.readOnlyHint = true;
  }
  if (isDelete) {
    annotations.destructiveHint = true;
  }
  if (isRead || (!isCreate && !isDelete)) {
    annotations.idempotentHint = true;
  }
  annotations.openWorldHint = true;

  return JSON.stringify(annotations);
}

function formatTitle(operationId: string): string {
  // "application-create" -> "Application Create"
  return operationId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getZodSchema(op: OperationObject, method: string): string {
  if (method === "post" && op.requestBody?.content?.["application/json"]?.schema) {
    const schema = op.requestBody.content["application/json"].schema;
    return jsonSchemaToZod(schema);
  }

  if (op.parameters && op.parameters.length > 0) {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const param of op.parameters) {
      const paramSchema: Record<string, unknown> = { ...param.schema };
      if (param.description) {
        paramSchema.description = param.description;
      }
      properties[param.name] = paramSchema;
      if (param.required) {
        required.push(param.name);
      }
    }

    return jsonSchemaToZod({
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
    });
  }

  return "z.object({})";
}

function main() {
  console.log("Reading OpenAPI spec...");
  const spec: OpenAPISpec = JSON.parse(readFileSync(SPEC_PATH, "utf-8"));
  const paths = Object.entries(spec.paths);
  console.log(`Processing ${paths.length} paths...`);

  const tools: string[] = [];
  let errorCount = 0;

  for (const [path, methods] of paths) {
    for (const [method, op] of Object.entries(methods)) {
      const operationId = op.operationId;
      if (!operationId) {
        console.warn(`Skipping ${method.toUpperCase()} ${path}: no operationId`);
        continue;
      }

      try {
        const zodSchema = getZodSchema(op, method);
        const description = (op.summary || op.description || `${method.toUpperCase()} ${path}`)
          .replace(/`/g, "'")
          .replace(/\\/g, "\\\\");
        const title = formatTitle(operationId);
        const annotations = deriveAnnotations(method, operationId);
        const tag = op.tags?.[0] || "unknown";

        tools.push(`  {
    name: ${JSON.stringify(operationId)},
    description: ${JSON.stringify(description)},
    tag: ${JSON.stringify(tag)},
    method: ${JSON.stringify(method.toUpperCase() as "GET" | "POST")},
    path: ${JSON.stringify(path)},
    schema: ${zodSchema},
    annotations: {
      title: ${JSON.stringify(title)},
      ...${annotations},
    },
  }`);
      } catch (err) {
        errorCount++;
        console.error(`Error processing ${operationId}:`, (err as Error).message);
      }
    }
  }

  const output = `// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Generated from openapi.json on ${new Date().toISOString().split("T")[0]}
// Run \`pnpm generate\` to regenerate

import { z } from "zod";
import type { ToolDefinition } from "../types.js";

export const generatedTools: ToolDefinition[] = [
${tools.join(",\n")},
];
`;

  writeFileSync(OUTPUT_PATH, output);
  console.log(`Generated ${tools.length} tools (${errorCount} errors) -> ${OUTPUT_PATH}`);
}

main();
