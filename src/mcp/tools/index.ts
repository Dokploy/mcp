import * as applicationTools from "./application/index.js";
import * as composeTools from "./compose/index.js";
import * as postgresTools from "./postgres/index.js";
import * as projectTools from "./project/index.js";

export const allTools = [
  ...Object.values(projectTools),
  ...Object.values(applicationTools),
  ...Object.values(composeTools),
  ...Object.values(postgresTools),
];
