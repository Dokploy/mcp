import { writeFileSync } from "fs";
import { resolve } from "path";

const OPENAPI_URL = "https://docs.dokploy.com/openapi.json";
const OUTPUT_PATH = resolve(import.meta.dirname, "../src/generated/openapi.json");

async function main() {
  console.log(`Fetching OpenAPI spec from ${OPENAPI_URL}...`);
  const response = await fetch(OPENAPI_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const spec = await response.json();
  const paths = Object.keys(spec.paths || {});
  console.log(`Found ${paths.length} endpoints`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(spec, null, 2));
  console.log(`Written to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
