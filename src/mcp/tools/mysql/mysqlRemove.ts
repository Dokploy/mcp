import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlRemove = createTool({
  name: "mysql-remove",
  description: "Removes a MySQL database from Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to remove."),
  }),
  annotations: {
    title: "Remove MySQL Database",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.remove", input);

    return ResponseFormatter.success(
      "MySQL database removed successfully",
      response.data
    );
  },
});
