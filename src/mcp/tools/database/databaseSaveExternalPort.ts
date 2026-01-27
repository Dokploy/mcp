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

export const databaseSaveExternalPort = createTool({
  name: "database-saveExternalPort",
  description:
    "Saves the external port configuration for a database in Dokploy. This exposes the database on the specified port on the host machine. Set to null to disable external access. Supports PostgreSQL, MySQL, MongoDB, MariaDB, and Redis.",
  schema: z.object({
    dbType: z.enum(dbTypes).describe("The database type"),
    id: z
      .string()
      .min(1)
      .describe("The unique database ID to configure"),
    externalPort: z
      .number()
      .nullable()
      .describe("The external port number to expose the database on (1-65535), or null to disable external access"),
  }),
  annotations: {
    title: "Save Database External Port",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const { dbType, id, externalPort } = input;
    const label = dbTypeLabels[dbType];
    const idParam = idParamNames[dbType];

    const response = await apiClient.post(`/${dbType}.saveExternalPort`, {
      [idParam]: id,
      externalPort,
    });

    const portMessage =
      externalPort !== null
        ? `set to port ${externalPort}`
        : "disabled (set to null)";

    return ResponseFormatter.success(
      `External port for ${label} database "${id}" ${portMessage} successfully`,
      response.data
    );
  },
});
