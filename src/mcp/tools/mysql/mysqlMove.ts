import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlMove = createTool({
  name: "mysql-move",
  description: "Moves a MySQL database to a different environment in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to move."),
    targetEnvironmentId: z
      .string()
      .describe("The ID of the target environment to move the database to."),
  }),
  annotations: {
    title: "Move MySQL Database",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.move", input);

    return ResponseFormatter.success(
      "MySQL database moved successfully",
      response.data
    );
  },
});
