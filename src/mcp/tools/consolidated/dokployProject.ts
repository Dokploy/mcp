import { z } from "zod";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Import all individual tool schemas for reuse
import { projectAll } from "../project/projectAll.js";
import { projectCreate } from "../project/projectCreate.js";
import { projectDuplicate } from "../project/projectDuplicate.js";
import { projectOne } from "../project/projectOne.js";
import { projectRemove } from "../project/projectRemove.js";
import { projectUpdate } from "../project/projectUpdate.js";

export const dokployProject = createTool({
  name: "dokploy_project",
  description:
    "Consolidated tool for managing Dokploy projects. Supports multiple actions: list, create, get, update, remove, duplicate.",
  schema: z.object({
    action: z
      .enum(["list", "create", "get", "update", "remove", "duplicate"])
      .describe(
        "The action to perform on the project: list (all projects), create, get (specific project), update, remove, duplicate"
      ),
    params: z
      .record(z.any())
      .optional()
      .describe(
        "Parameters for the action. The required parameters vary by action. See individual tool documentation for details."
      ),
  }),
  annotations: {
    title: "Manage Dokploy Project",
    destructiveHint: false, // Will be dynamically set based on action
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { action, params = {} } = input;

    // Map actions to their corresponding tool handlers
    const actionMap: Record<string, any> = {
      list: projectAll,
      create: projectCreate,
      get: projectOne,
      update: projectUpdate,
      remove: projectRemove,
      duplicate: projectDuplicate,
    };

    const tool = actionMap[action];
    if (!tool) {
      return ResponseFormatter.error(
        "Invalid action",
        `Action "${action}" is not supported for project management`
      );
    }

    // Call the corresponding tool handler with the provided params
    try {
      return await tool.handler(params);
    } catch (error) {
      return ResponseFormatter.error(
        `Failed to execute project action "${action}"`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  },
});
