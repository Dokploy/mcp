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

export const databaseDeploy = createTool({
  name: "database-deploy",
  description:
    "Deploys a database container in Dokploy. This pulls the Docker image and starts the container with the configured settings. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type to deploy"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID to deploy"),
  }),
  annotations: {
    title: "Deploy Database",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.post(`/${dbType}.deploy`, {
      [idParam]: id,
    });

    return ResponseFormatter.success(
      `${label} database "${id}" deployment started successfully`,
      response.data
    );
  },
});
