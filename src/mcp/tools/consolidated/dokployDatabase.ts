import { z } from "zod";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Import all individual tool schemas for reuse
import { postgresChangeStatus } from "../postgres/postgresChangeStatus.js";
import { postgresCreate } from "../postgres/postgresCreate.js";
import { postgresDeploy } from "../postgres/postgresDeploy.js";
import { postgresMove } from "../postgres/postgresMove.js";
import { postgresOne } from "../postgres/postgresOne.js";
import { postgresRebuild } from "../postgres/postgresRebuild.js";
import { postgresReload } from "../postgres/postgresReload.js";
import { postgresRemove } from "../postgres/postgresRemove.js";
import { postgresSaveEnvironment } from "../postgres/postgresSaveEnvironment.js";
import { postgresSaveExternalPort } from "../postgres/postgresSaveExternalPort.js";
import { postgresStart } from "../postgres/postgresStart.js";
import { postgresStop } from "../postgres/postgresStop.js";
import { postgresUpdate } from "../postgres/postgresUpdate.js";

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

export const dokployDatabase = createTool({
  name: "dokploy_database",
  description:
    "Consolidated tool for managing Dokploy databases (PostgreSQL and MySQL). Supports multiple actions for both database types: create, remove, deploy, start, stop, update, get, rebuild, reload, move, changeStatus, saveEnvironment, saveExternalPort.",
  schema: z.object({
    databaseType: z
      .enum(["postgres", "mysql"])
      .describe(
        "The type of database to manage: postgres for PostgreSQL or mysql for MySQL"
      ),
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
        "The action to perform on the database: create, remove, deploy, start, stop, update, get, rebuild, reload, move, changeStatus, saveEnvironment, saveExternalPort"
      ),
    params: z
      .record(z.any())
      .optional()
      .describe(
        "Parameters for the action. The required parameters vary by action and database type. See individual tool documentation for details."
      ),
  }),
  annotations: {
    title: "Manage Dokploy Database",
    destructiveHint: false, // Will be dynamically set based on action
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { databaseType, action, params = {} } = input;

    // Map actions to their corresponding tool handlers for postgres
    const postgresActionMap: Record<string, any> = {
      create: postgresCreate,
      remove: postgresRemove,
      deploy: postgresDeploy,
      start: postgresStart,
      stop: postgresStop,
      update: postgresUpdate,
      get: postgresOne,
      rebuild: postgresRebuild,
      reload: postgresReload,
      move: postgresMove,
      changeStatus: postgresChangeStatus,
      saveEnvironment: postgresSaveEnvironment,
      saveExternalPort: postgresSaveExternalPort,
    };

    // Map actions to their corresponding tool handlers for mysql
    const mysqlActionMap: Record<string, any> = {
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

    const actionMap = databaseType === "postgres" ? postgresActionMap : mysqlActionMap;
    const tool = actionMap[action];

    if (!tool) {
      return ResponseFormatter.error(
        "Invalid action",
        `Action "${action}" is not supported for ${databaseType} database`
      );
    }

    // Call the corresponding tool handler with the provided params
    try {
      return await tool.handler(params);
    } catch (error) {
      return ResponseFormatter.error(
        `Failed to execute ${databaseType} action "${action}"`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  },
});
