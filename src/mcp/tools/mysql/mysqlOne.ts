import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlOne = createTool({
  name: "mysql-one",
  description: "Gets a specific MySQL database by its ID in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to retrieve."),
  }),
  annotations: {
    title: "Get MySQL Database",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.get("/mysql.one", {
      params: { mysqlId: input.mysqlId },
    });

    return ResponseFormatter.success(
      "MySQL database retrieved successfully",
      response.data
    );
  },
});
