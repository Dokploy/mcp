import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { type JsonSchema, jsonSchemaToZod } from "json-schema-to-zod";
import { zodToJsonSchema } from "zod-to-json-schema";

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
        schema: JsonSchema;
      };
    };
  };
}

interface ParameterObject {
  name: string;
  in: string;
  schema: JsonSchema;
  required?: boolean;
  description?: string;
}

const SPEC_PATH = resolve(import.meta.dirname, "../src/generated/openapi.json");
const OUTPUT_PATH = resolve(import.meta.dirname, "../src/generated/tools.ts");
const TOOLS_MD_PATH = resolve(import.meta.dirname, "../TOOLS.md");
const JSON_SCHEMA_2020_12 = "https://json-schema.org/draft/2020-12/schema";

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
      const paramSchema =
        typeof param.schema === "object" && param.schema !== null
          ? { ...param.schema, ...(param.description ? { description: param.description } : {}) }
          : param.schema;
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

interface JsonSchemaObject {
  type?: string;
  properties?: Record<string, JsonSchemaObject>;
  required?: string[];
  anyOf?: JsonSchemaObject[];
  enum?: string[];
  items?: JsonSchemaObject;
}

interface ToolMdEntry {
  operationId: string;
  method: string;
  tag: string;
  description: string;
  params: { name: string; type: string; required: boolean }[];
}

interface GeneratedToolSource {
  name: string;
  description: string;
  tag: string;
  method: "GET" | "POST";
  path: string;
  zodSchema: string;
  title: string;
  annotations: string;
}

interface GeneratedToolRuntime {
  name: string;
  schema: Parameters<typeof zodToJsonSchema>[0];
}

function stripNestedSchemaKeys(value: unknown): void {
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) stripNestedSchemaKeys(item);
    return;
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key === "$schema") {
      delete record[key];
    } else {
      stripNestedSchemaKeys(record[key]);
    }
  }
}

function schemaTypeToString(schema: JsonSchemaObject): string {
  if (schema.enum) {
    return schema.enum.map((v) => `"${v}"`).join(" | ");
  }
  if (schema.anyOf) {
    return schema.anyOf.map((s) => s.type || "unknown").join(" | ");
  }
  if (schema.type === "array" && schema.items) {
    return `${schemaTypeToString(schema.items)}[]`;
  }
  return schema.type || "unknown";
}

function extractParams(op: OperationObject, method: string): ToolMdEntry["params"] {
  const params: ToolMdEntry["params"] = [];

  if (method === "post" && op.requestBody?.content?.["application/json"]?.schema) {
    const schema = op.requestBody.content["application/json"].schema;
    if (typeof schema === "object" && schema !== null && "properties" in schema) {
      const s = schema as JsonSchemaObject;
      const requiredSet = new Set(s.required || []);
      for (const [name, propSchema] of Object.entries(s.properties || {})) {
        params.push({
          name,
          type: schemaTypeToString(propSchema),
          required: requiredSet.has(name),
        });
      }
    }
  }

  if (op.parameters) {
    for (const param of op.parameters) {
      const pSchema = typeof param.schema === "object" && param.schema !== null ? param.schema : {};
      params.push({
        name: param.name,
        type: schemaTypeToString(pSchema as JsonSchemaObject),
        required: param.required ?? false,
      });
    }
  }

  return params;
}

function generateToolsMd(entries: ToolMdEntry[]): string {
  const grouped = new Map<string, ToolMdEntry[]>();
  for (const entry of entries) {
    const list = grouped.get(entry.tag) || [];
    list.push(entry);
    grouped.set(entry.tag, list);
  }

  const lines: string[] = [
    "# Dokploy MCP Server - Tools Documentation",
    "",
    "> Auto-generated from the [Dokploy OpenAPI spec](https://docs.dokploy.com/openapi.json). Run `pnpm generate` to update.",
    "",
    `- **Total Tools**: ${entries.length}`,
    `- **Categories**: ${grouped.size}`,
    "",
    "## Categories",
    "",
  ];

  // Table of contents
  const sortedTags = [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [tag, tools] of sortedTags) {
    lines.push(`- [${tag}](#${tag}) (${tools.length} tools)`);
  }
  lines.push("");

  // Each category
  for (const [tag, tools] of sortedTags) {
    lines.push(`## ${tag}`, "");
    lines.push("| Tool | Method | Parameters |");
    lines.push("|------|--------|------------|");

    for (const tool of tools) {
      const requiredParams = tool.params.filter((p) => p.required);
      const optionalParams = tool.params.filter((p) => !p.required);

      const parts: string[] = [];
      if (requiredParams.length > 0) {
        parts.push(requiredParams.map((p) => `\`${p.name}\` (${p.type})`).join(", "));
      }
      if (optionalParams.length > 0) {
        const optCount = optionalParams.length;
        if (optCount <= 3) {
          parts.push(optionalParams.map((p) => `\`${p.name}\`?`).join(", "));
        } else {
          parts.push(`+${optCount} optional`);
        }
      }
      if (parts.length === 0) {
        parts.push("None");
      }

      lines.push(`| \`${tool.operationId}\` | ${tool.method} | ${parts.join(", ")} |`);
    }
    lines.push("");
  }

  lines.push(
    "## Annotations",
    "",
    "All tools include semantic annotations to help MCP clients understand their behavior:",
    "",
    "- **readOnlyHint**: GET endpoints that only retrieve data",
    "- **destructiveHint**: Operations that delete or remove resources",
    "- **idempotentHint**: Safe to repeat without side effects",
    "- **openWorldHint**: All tools interact with the external Dokploy API",
    "",
  );

  return lines.join("\n");
}

async function main() {
  console.log("Reading OpenAPI spec...");
  const spec: OpenAPISpec = JSON.parse(readFileSync(SPEC_PATH, "utf-8"));
  const paths = Object.entries(spec.paths);
  console.log(`Processing ${paths.length} paths...`);

  const tools: GeneratedToolSource[] = [];
  const mdEntries: ToolMdEntry[] = [];
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

        tools.push({
          name: operationId,
          description,
          tag,
          method: method.toUpperCase() as "GET" | "POST",
          path,
          zodSchema,
          title,
          annotations,
        });

        mdEntries.push({
          operationId,
          method: method.toUpperCase(),
          tag,
          description,
          params: extractParams(op, method),
        });
      } catch (err) {
        errorCount++;
        console.error(`Error processing ${operationId}:`, (err as Error).message);
      }
    }
  }

  const runtimeOutputPath = resolve(import.meta.dirname, `.tools-runtime-${process.pid}.ts`);
  const runtimeOutput = `import { z } from "zod";

export const generatedTools = [
${tools
  .map(
    (tool) => `  {
    name: ${JSON.stringify(tool.name)},
    schema: ${tool.zodSchema},
  }`,
  )
  .join(",\n")},
];
`;

  writeFileSync(runtimeOutputPath, runtimeOutput);

  let runtimeTools: GeneratedToolRuntime[];
  try {
    const generatedModule = (await import(
      `${pathToFileURL(runtimeOutputPath).href}?generated=${Date.now()}`
    )) as { generatedTools: GeneratedToolRuntime[] };
    runtimeTools = generatedModule.generatedTools;
  } finally {
    unlinkSync(runtimeOutputPath);
  }

  const runtimeToolsByName = new Map(runtimeTools.map((tool) => [tool.name, tool]));
  const renderedTools = tools.map((tool) => {
    const runtimeTool = runtimeToolsByName.get(tool.name);
    if (!runtimeTool) {
      throw new Error(`Generated runtime tool ${tool.name} is missing`);
    }

    const inputSchema = zodToJsonSchema(runtimeTool.schema, {
      target: "jsonSchema2019-09",
      strictUnions: true,
    }) as Record<string, unknown>;
    stripNestedSchemaKeys(inputSchema);
    inputSchema.$schema = JSON_SCHEMA_2020_12;

    return `  {
    name: ${JSON.stringify(tool.name)},
    description: ${JSON.stringify(tool.description)},
    tag: ${JSON.stringify(tool.tag)},
    method: ${JSON.stringify(tool.method)},
    path: ${JSON.stringify(tool.path)},
    schema: lazySchema(() => ${tool.zodSchema}),
    inputSchemaJson: ${JSON.stringify(JSON.stringify(inputSchema))},
    annotations: {
      title: ${JSON.stringify(tool.title)},
      ...${tool.annotations},
    },
  }`;
  });

  // Write generated tools.ts
  const output = `// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Generated from openapi.json on ${new Date().toISOString().split("T")[0]}
// Run \`pnpm generate\` to regenerate

import { z } from "zod";
import type { ToolDefinition } from "../types.js";

function lazySchema<T extends z.ZodTypeAny>(factory: () => T): z.ZodLazy<T> {
  let schema: T | undefined;
  return z.lazy(() => (schema ??= factory()));
}

export const generatedTools: ToolDefinition[] = [
${renderedTools.join(",\n")},
];
`;

  writeFileSync(OUTPUT_PATH, output);
  console.log(`Generated ${tools.length} tools (${errorCount} errors) -> ${OUTPUT_PATH}`);

  // Write TOOLS.md
  const md = generateToolsMd(mdEntries);
  writeFileSync(TOOLS_MD_PATH, md);
  console.log(`Generated TOOLS.md with ${mdEntries.length} tools -> ${TOOLS_MD_PATH}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
