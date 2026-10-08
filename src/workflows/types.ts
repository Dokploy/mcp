import type { ZodObject, ZodRawShape } from "zod";
import type { ToolAnnotations } from "../types.js";

// The subset of the API client a workflow needs. Passed in so workflows can be
// tested without a Dokploy instance.
export interface WorkflowApi {
  get(path: string, config?: { params?: Record<string, unknown> }): Promise<{ data: unknown }>;
  post(path: string, body?: Record<string, unknown>): Promise<{ data: unknown }>;
}

export interface WorkflowResult {
  message: string;
  data: unknown;
}

// A hand-written tool that combines several Dokploy API calls. Generated tools
// map one-to-one to an endpoint; workflow tools cover tasks that otherwise take
// a model several calls and some polling to get right.
export interface WorkflowToolDefinition {
  name: string;
  description: string;
  tag: string;
  schema: ZodObject<ZodRawShape>;
  annotations?: ToolAnnotations;
  run: (input: Record<string, unknown>, api: WorkflowApi) => Promise<WorkflowResult>;
}
