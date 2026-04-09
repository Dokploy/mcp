import type { ZodObject, ZodRawShape } from "zod";

export interface ToolAnnotations {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  tag: string;
  method: "GET" | "POST";
  path: string;
  schema: ZodObject<ZodRawShape>;
  annotations?: ToolAnnotations;
}
