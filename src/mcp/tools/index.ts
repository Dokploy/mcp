import * as consolidatedTools from "./consolidated/index.js";
import * as domainTools from "./domain/index.js";

export const allTools = [
  ...Object.values(consolidatedTools),
  ...Object.values(domainTools),
];
