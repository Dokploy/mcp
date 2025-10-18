import { z } from "zod";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const applicationSaveBuildType = createTool({
  name: "application-saveBuildType",
  description: "Saves build type configuration for an application in Dokploy.",
  schema: z.object({
    applicationId: z
      .string()
      .describe("The ID of the application to save build type for."),
    buildType: z
      .enum([
        "dockerfile",
        "heroku_buildpacks",
        "paketo_buildpacks",
        "nixpacks",
        "static",
        "railpack",
      ])
      .describe("The build type for the application."),
    dockerContextPath: z
      .string()
      .nullable()
      .describe("Docker context path (required field)."),
    dockerBuildStage: z
      .string()
      .nullable()
      .describe("Docker build stage (required field)."),
    dockerfile: z
      .string()
      .nullable()
      .optional()
      .describe("Dockerfile content or path."),
    herokuVersion: z
      .string()
      .nullable()
      .optional()
      .describe("Heroku version for heroku_buildpacks build type."),
    railpackVersion: z
      .string()
      .nullable()
      .optional()
      .describe("Railpack version for railpack build type."),
    publishDirectory: z
      .string()
      .nullable()
      .optional()
      .describe("Directory to publish the built application."),
    isStaticSpa: z
      .boolean()
      .nullable()
      .optional()
      .describe("Whether the application is a static SPA."),
  }),
  annotations: {
    title: "Save Application Build Type",
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  handler: async (input) => {
    const response = await apiClient.post("/application.saveBuildType", input);

    return ResponseFormatter.success(
      `Build type for application "${input.applicationId}" saved successfully`,
      response.data
    );
  },
});
