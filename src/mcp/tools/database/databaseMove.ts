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

export const databaseMove = createTool({
  name: "database-move",
  description:
    "Moves a database to a different environment in Dokploy. This changes the environment association without affecting the running container. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type to move"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID to move"),
    targetEnvironmentId: z
      .string()
      .min(1)
      .describe("The ID of the target environment to move the database to"),
  }),
  annotations: {
    title: "Move Database",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id, targetEnvironmentId } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.post(`/${dbType}.move`, {
      [idParam]: id,
      targetEnvironmentId,
    });

    return ResponseFormatter.success(
      `${label} database "${id}" moved to environment "${targetEnvironmentId}" successfully`,
      response.data
    );
  },
});
