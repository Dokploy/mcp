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

export const databaseOne = createTool({
  name: "database-one",
  description:
    "Retrieves detailed information about a specific database by ID. Returns configuration, status, and metadata for PostgreSQL, MySQL, MongoDB, MariaDB, or Redis databases.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type to retrieve"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID (e.g., postgresId, mysqlId, mongoId, mariadbId, or redisId)"),
  }),
  annotations: {
    title: "Get Database",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.get(`/${dbType}.one`, {
      params: { [idParam]: id },
    });

    if (!response?.data) {
      return ResponseFormatter.error(
        `Failed to fetch ${label} database`,
        `${label} database with ID "${id}" not found`
      );
    }

    return ResponseFormatter.success(
      `Successfully fetched ${label} database "${id}"`,
      response.data
    );
  },
});
