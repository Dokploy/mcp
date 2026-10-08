import { deploymentWorkflowTools } from "./deployment.js";
import type { WorkflowToolDefinition } from "./types.js";

export const workflowTools: WorkflowToolDefinition[] = [...deploymentWorkflowTools];
