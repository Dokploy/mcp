import { z } from "zod";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Import all individual MySQL tool schemas for reuse
import { mysqlChangeStatus } from "../mysql/mysqlChangeStatus.js";
import { mysqlCreate } from "../mysql/mysqlCreate.js";
import { mysqlDeploy } from "../mysql/mysqlDeploy.js";
import { mysqlMove } from "../mysql/mysqlMove.js";
import { mysqlOne } from "../mysql/mysqlOne.js";
import { mysqlRebuild } from "../mysql/mysqlRebuild.js";
import { mysqlReload } from "../mysql/mysqlReload.js";
import { mysqlRemove } from "../mysql/mysqlRemove.js";
import { mysqlSaveEnvironment } from "../mysql/mysqlSaveEnvironment.js";
import { mysqlSaveExternalPort } from "../mysql/mysqlSaveExternalPort.js";
import { mysqlStart } from "../mysql/mysqlStart.js";
import { mysqlStop } from "../mysql/mysqlStop.js";
import { mysqlUpdate } from "../mysql/mysqlUpdate.js";

export const dokployMysql = createTool({
  name: "dokploy_mysql",
  description:
    "Consolidated tool for managing Dokploy MySQL databases. Supports multiple actions: create, remove, deploy, start, stop, update, get, rebuild, reload, move, changeStatus, saveEnvironment, saveExternalPort.",
  schema: z.object({
    action: z
      .enum([
        "create",
        "remove",
        "deploy",
        "start",
        "stop",
        "update",
        "get",
        "rebuild",
        "reload",
        "move",
        "changeStatus",
        "saveEnvironment",
        "saveExternalPort",
      ])
      .describe(
        "The action to perform on the MySQL database: create, remove, deploy, start, stop, update, get, rebuild, reload, move, changeStatus, saveEnvironment, saveExternalPort"
      ),
    params: z
      .record(z.any())
      .optional()
      .describe(
        "Parameters for the action. The required parameters vary by action. See individual tool documentation for details."
      ),
  }),
  annotations: {
    title: "Manage Dokploy MySQL Database",
    destructiveHint: false, // Will be dynamically set based on action
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { action, params = {} } = input;

    // Map actions to their corresponding tool handlers
    const actionMap: Record<string, any> = {
      create: mysqlCreate,
      remove: mysqlRemove,
      deploy: mysqlDeploy,
      start: mysqlStart,
      stop: mysqlStop,
      update: mysqlUpdate,
      get: mysqlOne,
      rebuild: mysqlRebuild,
      reload: mysqlReload,
      move: mysqlMove,
      changeStatus: mysqlChangeStatus,
      saveEnvironment: mysqlSaveEnvironment,
      saveExternalPort: mysqlSaveExternalPort,
    };

    const tool = actionMap[action];

    if (!tool) {
      return ResponseFormatter.error(
        "Invalid action",
        `Action "${action}" is not supported for MySQL database`
      );
    }

    // Call the corresponding tool handler with the provided params
    try {
      return await tool.handler(params);
    } catch (error) {
      return ResponseFormatter.error(
        `Failed to execute MySQL action "${action}"`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  },
});
