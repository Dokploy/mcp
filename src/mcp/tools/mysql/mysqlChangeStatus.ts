import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlChangeStatus = createTool({
  name: "mysql-changeStatus",
  description: "Changes the status of a MySQL database in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to update."),
    applicationStatus: z
      .enum(["idle", "running", "done", "error"])
      .describe("The new status for the MySQL database."),
  }),
  annotations: {
    title: "Change MySQL Database Status",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.changeStatus", input);

    return ResponseFormatter.success(
      `MySQL database status changed to "${input.applicationStatus}" successfully`,
      response.data
    );
  },
});
