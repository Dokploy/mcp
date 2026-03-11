import apiClient from "./apiClient.js";
import { createLogger } from "./logger.js";

const logger = createLogger("OpenApiSpec");

let cachedSpec: Record<string, unknown> | null = null;
let cachedGetOps: Set<string> | null = null;
let cachedOpsList: string | null = null;

/**
 * Fetches and caches the OpenAPI spec from the Dokploy server.
 */
export async function getOpenApiSpec(): Promise<Record<string, unknown>> {
  if (cachedSpec) return cachedSpec;

  logger.info("Fetching OpenAPI spec from Dokploy server");
  const response = await apiClient.get("/settings.getOpenApiDocument");
  cachedSpec = response.data;
  return cachedSpec!;
}

/**
 * Derives the set of GET operations from the OpenAPI spec.
 * Any path with a "get" method is a GET operation; everything else is POST.
 */
export async function getGetOperations(): Promise<Set<string>> {
  if (cachedGetOps) return cachedGetOps;

  const spec = await getOpenApiSpec();
  const paths = (spec as any).paths || {};
  const getOps = new Set<string>();

  for (const [path, methods] of Object.entries(paths)) {
    const operationName = path.replace(/^\//, "");
    const methodsObj = methods as Record<string, any>;
    if ("get" in methodsObj) {
      getOps.add(operationName);
    }
  }

  cachedGetOps = getOps;
  logger.info(`Derived ${getOps.size} GET operations from OpenAPI spec`);
  return cachedGetOps;
}

/**
 * Builds the operations list string for the tool description.
 * Groups operations by category (the part before the dot).
 */
export async function getOperationsList(): Promise<string> {
  if (cachedOpsList) return cachedOpsList;

  const spec = await getOpenApiSpec();
  const paths = (spec as any).paths || {};
  const categories: Record<string, string[]> = {};

  for (const path of Object.keys(paths)) {
    const operationName = path.replace(/^\//, "");
    const dotIndex = operationName.indexOf(".");
    if (dotIndex <= 0) continue;
    const category = operationName.substring(0, dotIndex);
    const action = operationName.substring(dotIndex + 1);
    if (!categories[category]) categories[category] = [];
    categories[category].push(action);
  }

  const lines = Object.entries(categories)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([cat, actions]) => `${cat}: ${actions.sort().join(", ")}`);

  cachedOpsList =
    "Available operations (use dokploy-api-schema for parameter details):\n" +
    lines.join("\n");
  return cachedOpsList;
}
