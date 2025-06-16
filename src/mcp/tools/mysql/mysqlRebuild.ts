import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlRebuild = createTool({
  name: "mysql-rebuild",
  description: "Rebuilds a MySQL database in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to rebuild."),
  }),
  annotations: {
    title: "Rebuild MySQL Database",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.rebuild", input);

    return ResponseFormatter.success(
      "MySQL database rebuild initiated successfully",
      response.data
    );
  },
});
