import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlSaveEnvironment = createTool({
  name: "mysql-saveEnvironment",
  description: "Saves environment variables for a MySQL database in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to configure."),
    env: z
      .string()
      .nullable()
      .optional()
      .describe("Environment variables to set for the MySQL database."),
  }),
  annotations: {
    title: "Save MySQL Environment Variables",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.saveEnvironment", input);

    return ResponseFormatter.success(
      "MySQL environment variables saved successfully",
      response.data
    );
  },
});
