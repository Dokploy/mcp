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

export const databaseStart = createTool({
  name: "database-start",
  description:
    "Starts a stopped database container in Dokploy. The database must already be deployed. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type to start"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID to start"),
  }),
  annotations: {
    title: "Start Database",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.post(`/${dbType}.start`, {
      [idParam]: id,
    });

    return ResponseFormatter.success(
      `${label} database "${id}" started successfully`,
      response.data
    );
  },
});
