import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { type JsonSchema, jsonSchemaToZod } from "json-schema-to-zod";

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
      "application/json"?: {
        schema: JsonSchema;
      };
      "multipart/form-data"?: {
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

const FILE_FIELD_DESCRIPTION = "Absolute path to a local file, read by the MCP server";

const MULTIPART_SCHEMA_OVERRIDES: Record<string, JsonSchemaObject> = {
  "application-dropDeployment": {
    type: "object",
    properties: {
      applicationId: { type: "string" },
      zip: { type: "string", format: "binary" },
      dropBuildPath: { type: "string" },
    },
    required: ["applicationId", "zip"],
  },
  "docker-uploadFileToContainer": {
    type: "object",
    properties: {
      containerId: { type: "string", minLength: 1 },
      file: { type: "string", format: "binary" },
      destinationPath: { type: "string", minLength: 1 },
      serverId: { type: "string" },
    },
    required: ["containerId", "file", "destinationPath"],
  },
};

function resolveMultipartSchema(
  op: OperationObject,
  method: string,
): { schema: JsonSchemaObject; fileFields: Record<string, string> } | null {
  if (method !== "post" || op.requestBody?.content?.["application/json"]?.schema) {
    return null;
  }

  const rawMultipart = op.requestBody?.content?.["multipart/form-data"]?.schema as
    | JsonSchemaObject
    | undefined;
  const hasSpecProperties =
    rawMultipart &&
    typeof rawMultipart === "object" &&
    rawMultipart.properties &&
    Object.keys(rawMultipart.properties).length > 0;

  const sourceSchema = hasSpecProperties
    ? rawMultipart
    : MULTIPART_SCHEMA_OVERRIDES[op.operationId];

  if (!sourceSchema?.properties) {
    return null;
  }

  const properties: Record<string, JsonSchemaObject> = {};
  const fileFields: Record<string, string> = {};
  const requiredSet = new Set(sourceSchema.required || []);
  const required: string[] = [];

  for (const [propName, propSchema] of Object.entries(sourceSchema.properties)) {
    if (propSchema.type === "string" && propSchema.format === "binary") {
      const inputName = `${propName}Path`;
      fileFields[inputName] = propName;
      properties[inputName] = {
        type: "string",
        minLength: 1,
        description: FILE_FIELD_DESCRIPTION,
      };
      if (requiredSet.has(propName)) {
        required.push(inputName);
      }
    } else {
      properties[propName] = propSchema;
      if (requiredSet.has(propName)) {
        required.push(propName);
      }
    }
  }

  return {
    schema: {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
    },
    fileFields,
  };
}

function deriveAnnotations(method: string, operationId: string, isMultipart = false): string {
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
  if (isMultipart) {
    annotations.idempotentHint = false;
  } else if (isRead || (!isCreate && !isDelete)) {
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
    return jsonSchemaToZod(schema, { zodVersion: 3 });
  }

  const multipart = resolveMultipartSchema(op, method);
  if (multipart) {
    return jsonSchemaToZod(multipart.schema as JsonSchema, { zodVersion: 3 });
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

    return jsonSchemaToZod(
      {
        type: "object",
        properties,
        ...(required.length > 0 ? { required } : {}),
      },
      { zodVersion: 3 },
    );
  }

  return "z.object({})";
}

interface JsonSchemaObject {
  type?: string;
  format?: string;
  minLength?: number;
  description?: string;
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
  } else {
    const multipart = resolveMultipartSchema(op, method);
    if (multipart?.schema.properties) {
      const requiredSet = new Set(multipart.schema.required || []);
      for (const [name, propSchema] of Object.entries(multipart.schema.properties)) {
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

function main() {
  console.log("Reading OpenAPI spec...");
  const spec: OpenAPISpec = JSON.parse(readFileSync(SPEC_PATH, "utf-8"));
  const paths = Object.entries(spec.paths);
  console.log(`Processing ${paths.length} paths...`);

  const tools: string[] = [];
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
        const multipart = resolveMultipartSchema(op, method);
        const zodSchema = getZodSchema(op, method);
        const description = (op.summary || op.description || `${method.toUpperCase()} ${path}`)
          .replace(/`/g, "'")
          .replace(/\\/g, "\\\\");
        const title = formatTitle(operationId);
        const annotations = deriveAnnotations(method, operationId, Boolean(multipart));
        const tag = op.tags?.[0] || "unknown";
        const multipartFields = multipart
          ? `\n    bodyType: "multipart",\n    fileFields: ${JSON.stringify(multipart.fileFields)},`
          : "";

        tools.push(`  {
    name: ${JSON.stringify(operationId)},
    description: ${JSON.stringify(description)},
    tag: ${JSON.stringify(tag)},
    method: ${JSON.stringify(method.toUpperCase() as "GET" | "POST")},
    path: ${JSON.stringify(path)},
    schema: ${zodSchema},${multipartFields}
    annotations: {
      title: ${JSON.stringify(title)},
      ...${annotations},
    },
  }`);

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

  // Write generated tools.ts
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

  // Write TOOLS.md
  const md = generateToolsMd(mdEntries);
  writeFileSync(TOOLS_MD_PATH, md);
  console.log(`Generated TOOLS.md with ${mdEntries.length} tools -> ${TOOLS_MD_PATH}`);
}

main();
