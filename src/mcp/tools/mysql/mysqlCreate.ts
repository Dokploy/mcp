import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlCreate = createTool({
  name: "mysql-create",
  description: "Creates a new MySQL database in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the MySQL database."),
    appName: z.string().min(1).describe("The app name for the MySQL database."),
    databaseName: z
      .string()
      .min(1)
      .describe("The name of the database to create."),
    databaseUser: z
      .string()
      .min(1)
      .describe("The username for database access."),
    databasePassword: z
      .string()
      .regex(
        /^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/,
        "Password contains invalid characters"
      )
      .describe("The password for database access."),
    databaseRootPassword: z
      .string()
      .regex(
        /^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/,
        "Root password contains invalid characters"
      )
      .describe("The root password for MySQL."),
    environmentId: z
      .string()
      .describe(
        "The ID of the environment where the database will be created."
      ),
    dockerImage: z
      .string()
      .optional()
      .default("mysql:8")
      .describe("Docker image to use for MySQL."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("An optional description for the database."),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("The ID of the server where the database will be deployed."),
  }),
  annotations: {
    title: "Create MySQL Database",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.create", input);

    return ResponseFormatter.success(
      `MySQL database "${input.name}" created successfully`,
      response.data
    );
  },
});
