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

export const databaseSaveEnvironment = createTool({
  name: "database-saveEnvironment",
  description:
    "Saves environment variables for a database in Dokploy. Environment variables are passed to the container at runtime. Set to null to clear all environment variables. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID to configure"),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables as a string (KEY=value format, one per line), or null to clear"),
  }),
  annotations: {
    title: "Save Database Environment",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id, env } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.post(`/${dbType}.saveEnvironment`, {
      [idParam]: id,
      env,
    });

    return ResponseFormatter.success(
      `Environment variables for ${label} database "${id}" saved successfully`,
      response.data
    );
  },
});
