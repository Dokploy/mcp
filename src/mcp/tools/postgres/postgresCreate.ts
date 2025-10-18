import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const postgresCreate = createTool({
  name: "postgres-create",
  description: "Creates a new PostgreSQL database in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the PostgreSQL database."),
    appName: z.string().describe("The app name for the PostgreSQL database."),
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
      .regex(/^[a-zA-Z0-9@#%^&*()_+\-=[\]{}|;:,.<>?~`]*$/)
      .describe("The password for database access."),
    dockerImage: z
      .string()
      .default("postgres:15")
      .optional()
      .describe("Docker image to use for PostgreSQL."),
    environmentId: z
      .string()
      .describe(
        "The ID of the environment where the database will be created."
      ),
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
    title: "Create PostgreSQL Database",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/postgres.create", input);

    return ResponseFormatter.success(
      `PostgreSQL database "${input.name}" created successfully`,
      response.data
    );
  },
});
