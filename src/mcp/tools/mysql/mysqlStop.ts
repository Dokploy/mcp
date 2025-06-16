import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlStop = createTool({
  name: "mysql-stop",
  description: "Stops a MySQL database in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to stop."),
  }),
  annotations: {
    title: "Stop MySQL Database",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.stop", input);

    return ResponseFormatter.success(
      "MySQL database stopped successfully",
      response.data
    );
  },
});
