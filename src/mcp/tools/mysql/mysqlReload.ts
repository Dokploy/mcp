import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlReload = createTool({
  name: "mysql-reload",
  description: "Reloads a MySQL database configuration in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to reload."),
    appName: z.string().min(1).describe("The app name for the MySQL database."),
  }),
  annotations: {
    title: "Reload MySQL Database",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.reload", input);

    return ResponseFormatter.success(
      "MySQL database reloaded successfully",
      response.data
    );
  },
});
