import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlDeploy = createTool({
  name: "mysql-deploy",
  description: "Deploys a MySQL database in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to deploy."),
  }),
  annotations: {
    title: "Deploy MySQL Database",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.deploy", input);

    return ResponseFormatter.success(
      "MySQL database deployed successfully",
      response.data
    );
  },
});
