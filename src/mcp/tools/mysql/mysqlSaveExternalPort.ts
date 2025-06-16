import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const mysqlSaveExternalPort = createTool({
  name: "mysql-saveExternalPort",
  description:
    "Saves external port configuration for a MySQL database in Dokploy.",
  schema: z.object({
    mysqlId: z.string().describe("The ID of the MySQL database to configure."),
    externalPort: z
      .number()
      .nullable()
      .describe("The external port number to expose the database on."),
  }),
  annotations: {
    title: "Save MySQL External Port",
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (input) => {
    const response = await apiClient.post("/mysql.saveExternalPort", input);

    return ResponseFormatter.success(
      "MySQL external port configuration saved successfully",
      response.data
    );
  },
});
