import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlStart = createTool({
  name: "mysql-start",
  description: "Starts a MySQL database in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to start."),
  }),
  annotations: {
    title: "Start MySQL Database",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.start", input);

    return ResponseFormatter.success(
      "MySQL database started successfully",
      response.data
    );
  },
});
