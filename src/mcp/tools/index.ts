import * as applicationTools from "./application/index.js";
import * as domainTools from "./domain/index.js";
import * as mysqlTools from "./mysql/index.js";
import * as postgresTools from "./postgres/index.js";
import * as projectTools from "./project/index.js";

export const allTools = [
  ...Object.values(projectTools),
  ...Object.values(applicationTools),
  ...Object.values(domainTools),
  ...Object.values(mysqlTools),
  ...Object.values(postgresTools),
];
