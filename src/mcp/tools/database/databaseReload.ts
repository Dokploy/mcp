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

export const databaseReload = createTool({
  name: "database-reload",
  description:
    "Reloads a database container in Dokploy by restarting the Docker service. This applies configuration changes without a full rebuild. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type to reload"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID to reload"),
    appName: z
      .string()
      .min(1)
      .describe("The application name of the database (container identifier)"),
  }),
  annotations: {
    title: "Reload Database",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id, appName } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.post(`/${dbType}.reload`, {
      [idParam]: id,
      appName,
    });

    return ResponseFormatter.success(
      `${label} database "${id}" reloaded successfully`,
      response.data
    );
  },
});
