import { z } from "zod";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

// Import all individual PostgreSQL tool schemas for reuse
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

export const dokployPostgres = createTool({
  name: "dokploy_postgres",
  description:
    "Consolidated tool for managing Dokploy PostgreSQL databases. Supports multiple actions: create, remove, deploy, start, stop, update, get, rebuild, reload, move, changeStatus, saveEnvironment, saveExternalPort.",
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
        "The action to perform on the PostgreSQL database: create, remove, deploy, start, stop, update, get, rebuild, reload, move, changeStatus, saveEnvironment, saveExternalPort"
      ),
    params: z
      .record(z.any())
      .optional()
      .describe(
        "Parameters for the action. The required parameters vary by action. See individual tool documentation for details."
      ),
  }),
  annotations: {
    title: "Manage Dokploy PostgreSQL Database",
    destructiveHint: false, // Will be dynamically set based on action
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { action, params = {} } = input;

    // Map actions to their corresponding tool handlers
    const actionMap: Record<string, any> = {
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

    const tool = actionMap[action];

    if (!tool) {
      return ResponseFormatter.error(
        "Invalid action",
        `Action "${action}" is not supported for PostgreSQL database`
      );
    }

    // Call the corresponding tool handler with the provided params
    try {
      return await tool.handler(params);
    } catch (error) {
      return ResponseFormatter.error(
        `Failed to execute PostgreSQL action "${action}"`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  },
});
