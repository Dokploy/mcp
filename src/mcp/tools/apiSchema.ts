import { z } from "zod";
import apiClient from "../../utils/apiClient.js";
import { createLogger } from "../../utils/logger.js";
import { ResponseFormatter } from "../../utils/responseFormatter.js";

const logger = createLogger("DokployApiSchema");

let cachedSpec: Record<string, unknown> | null = null;

async function getOpenApiSpec(): Promise<Record<string, unknown>> {
  if (cachedSpec) return cachedSpec;

  logger.info("Fetching OpenAPI spec from Dokploy server");
  const response = await apiClient.get("/settings.getOpenApiDocument");
  cachedSpec = response.data;
  return cachedSpec!;
}

interface OperationInfo {
  name: string;
  method: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

function extractOperations(spec: Record<string, unknown>): OperationInfo[] {
  const paths = (spec as any).paths || {};
  const operations: OperationInfo[] = [];

  for (const [path, methods] of Object.entries(paths)) {
    const operationName = path.replace(/^\//, "");
    const methodsObj = methods as Record<string, any>;

    for (const [method, details] of Object.entries(methodsObj)) {
      if (!["get", "post"].includes(method)) continue;

      const op: OperationInfo = {
        name: operationName,
        method: method.toUpperCase(),
        description: details.summary || details.description,
      };

      // Extract request body schema for POST
      if (method === "post" && details.requestBody) {
        const content = details.requestBody.content;
        const jsonSchema = content?.["application/json"]?.schema;
        if (jsonSchema) {
          op.parameters = resolveSchema(spec, jsonSchema);
        }
      }

      // Extract query parameters for GET
      if (method === "get" && details.parameters) {
        const params: Record<string, unknown> = {};
        for (const param of details.parameters) {
          if (param.in === "query") {
            params[param.name] = {
              type: param.schema?.type || "string",
              required: param.required || false,
              description: param.description,
            };
          }
        }
        if (Object.keys(params).length > 0) {
          op.parameters = params;
        }
      }

      operations.push(op);
    }
  }

  return operations;
}

function resolveSchema(
  spec: Record<string, unknown>,
  schema: Record<string, any>,
  depth = 0
): Record<string, unknown> {
  // Guard against circular references
  if (depth > 10) return { note: "Max resolution depth reached" };

  // Handle $ref
  if (schema.$ref) {
    const refPath = schema.$ref.replace("#/", "").split("/");
    let resolved: any = spec;
    for (const segment of refPath) {
      resolved = resolved?.[segment];
    }
    if (resolved) {
      return resolveSchema(spec, resolved, depth + 1);
    }
    return { $ref: schema.$ref, note: "Could not resolve reference" };
  }

  // Handle allOf (merge all sub-schemas)
  if (schema.allOf) {
    let merged: Record<string, unknown> = {};
    for (const sub of schema.allOf) {
      const resolved = resolveSchema(spec, sub, depth + 1);
      merged = { ...merged, ...resolved };
    }
    return merged;
  }

  // Handle oneOf/anyOf (list variants)
  if (schema.oneOf || schema.anyOf) {
    const variants = schema.oneOf || schema.anyOf;
    return {
      oneOf: variants.map((v: any) => resolveSchema(spec, v, depth + 1)),
    };
  }

  // Handle object with properties
  if (schema.type === "object" && schema.properties) {
    const result: Record<string, unknown> = {};
    const required = new Set(schema.required || []);
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const prop = propSchema as Record<string, any>;
      if (prop.$ref || prop.allOf || prop.oneOf || prop.anyOf) {
        // Recursively resolve nested schemas
        const resolved = resolveSchema(spec, prop, depth + 1);
        result[propName] = {
          ...resolved,
          required: required.has(propName),
        };
      } else {
        result[propName] = {
          type: prop.type || "unknown",
          required: required.has(propName),
          ...(prop.description && { description: prop.description }),
          ...(prop.enum && { enum: prop.enum }),
          ...(prop.nullable && { nullable: true }),
          ...(prop.default !== undefined && { default: prop.default }),
        };
      }
    }
    return result;
  }

  return schema;
}

function getCategory(operationName: string): string {
  const dotIndex = operationName.indexOf(".");
  return dotIndex > 0 ? operationName.substring(0, dotIndex) : operationName;
}

export const schema = {
  category: z
    .string()
    .optional()
    .describe(
      'Filter by category, e.g. "application", "server", "postgres"'
    ),
  operation: z
    .string()
    .optional()
    .describe(
      'Get details for a specific operation, e.g. "application.create"'
    ),
};

export const name = "dokploy-api-schema";

export const description =
  "Get parameter details for Dokploy API operations. Returns operation schemas from the OpenAPI spec. Call with no params for a category summary, with category to list operations, or with operation for full parameter details.";

export const annotations = {
  title: "Dokploy API Schema",
  readOnlyHint: true,
  idempotentHint: true,
};

export async function handler(input: {
  category?: string;
  operation?: string;
}) {
  try {
    const spec = await getOpenApiSpec();
    const operations = extractOperations(spec);

    // Specific operation requested
    if (input.operation) {
      const op = operations.find((o) => o.name === input.operation);
      if (!op) {
        return ResponseFormatter.error(
          "Operation not found",
          `No operation named "${input.operation}". Use without params to see available categories.`
        );
      }
      return ResponseFormatter.success(
        `Schema for ${input.operation}`,
        op
      );
    }

    // Category filter
    if (input.category) {
      const categoryOps = operations.filter(
        (o) => getCategory(o.name) === input.category
      );
      if (categoryOps.length === 0) {
        return ResponseFormatter.error(
          "Category not found",
          `No operations in category "${input.category}". Use without params to see available categories.`
        );
      }
      return ResponseFormatter.success(
        `Operations in ${input.category}`,
        {
          category: input.category,
          operations: categoryOps,
        }
      );
    }

    // No filter — return category summary
    const categories: Record<string, number> = {};
    for (const op of operations) {
      const cat = getCategory(op.name);
      categories[cat] = (categories[cat] || 0) + 1;
    }
    return ResponseFormatter.success("Available categories", {
      totalOperations: operations.length,
      categories,
    });
  } catch (error) {
    logger.error("Failed to fetch API schema", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return ResponseFormatter.error(
      "Failed to fetch API schema",
      `Could not retrieve OpenAPI spec: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
