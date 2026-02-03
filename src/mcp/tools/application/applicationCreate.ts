import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { createTool } from "../toolFactory.js";

export const applicationCreate = createTool({
  name: "application-create",
  description: "Creates a new application in Dokploy.",
  schema: z.object({
    name: z.string().min(1).describe("The name of the application."),
    appName: z
      .string()
      .optional()
      .describe("The app name for the application."),
    description: z
      .string()
      .nullable()
      .optional()
      .describe("An optional description for the application."),
    environmentId: z
      .string()
      .min(1)
      .describe(
        "The ID of the environment where the application will be created."
      ),
    serverId: z
      .string()
      .nullable()
      .optional()
      .describe("The ID of the server where the application will be deployed."),
  }),
  outputSchema: z.object({
    success: z.boolean().describe("Whether the operation was successful"),
    message: z.string().describe("A message describing the result"),
    data: z.record(z.any()).optional().describe("The application data returned from the API"),
  }),
  annotations: {
    title: "Create Application",
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/application.create", input);

    const structuredData = {
      success: true,
      message: `Application "${input.name}" created successfully in environment "${input.environmentId}"`,
      data: response.data,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(structuredData, null, 2),
        },
      ],
      structuredContent: structuredData,
    };
  },
});
