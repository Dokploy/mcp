import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

const dbTypes = ["postgres", "mysql", "mongo", "mariadb", "redis"] as const;
type DbType = (typeof dbTypes)[number];

const dbTypeLabels: Record<DbType, string> = {
  postgres: "PostgreSQL",
  mysql: "MySQL",
  mongo: "MongoDB",
  mariadb: "MariaDB",
  redis: "Redis",
};

const idParamNames: Record<DbType, string> = {
  postgres: "postgresId",
  mysql: "mysqlId",
  mongo: "mongoId",
  mariadb: "mariadbId",
  redis: "redisId",
};

const applicationStatuses = ["idle", "running", "done", "error"] as const;

export const databaseChangeStatus = createTool({
  name: "database-changeStatus",
  description:
    "Changes the application status of a database in Dokploy. This updates the status metadata without affecting the actual container state. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID to change status for"),
    applicationStatus: z
      .enum(applicationStatuses)
      .describe("The new application status: idle (not running), running (actively processing), done (completed), or error (failed state)"),
  }),
  annotations: {
    title: "Change Database Status",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id, applicationStatus } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.post(`/${dbType}.changeStatus`, {
      [idParam]: id,
      applicationStatus,
    });

    return ResponseFormatter.success(
      `${label} database "${id}" status changed to "${applicationStatus}" successfully`,
      response.data
    );
  },
});
