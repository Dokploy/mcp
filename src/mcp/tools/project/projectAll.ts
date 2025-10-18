import { z } from "zod";
import type { DokployProject } from "../../../types/dokploy.js";
import apiClient from "../../../utils/apiClient.js";
import { ResponseFormatter } from "../../../utils/responseFormatter.js";
import { createTool } from "../toolFactory.js";

export const projectAll = createTool({
  name: "project-all",
  description:
    "Lists all projects in Dokploy with optimized response size suitable for LLM consumption. Returns summary data including project info, environment counts, and service counts per environment. Excludes large fields like env vars and compose files.",
  schema: z.object({}),
  annotations: {
    title: "List All Projects",
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: true,
  },
  handler: async () => {
    const response = await apiClient.get("/project.all");

    if (!response?.data) {
      return ResponseFormatter.error(
        "Failed to fetch projects",
        "No response data received"
      );
    }

    const projects = response.data as DokployProject[];

    // Return optimized summary data with environment structure
    const optimizedProjects = projects.map((project) => {
      // Calculate total services across all environments
      const totalCounts = {
        applications: 0,
        postgres: 0,
        mysql: 0,
        mariadb: 0,
        mongo: 0,
        redis: 0,
        compose: 0,
      };

      const environments =
        project.environments?.map((env) => {
          const envCounts = {
            applications: env.applications?.length || 0,
            postgres: env.postgres?.length || 0,
            mysql: env.mysql?.length || 0,
            mariadb: env.mariadb?.length || 0,
            mongo: env.mongo?.length || 0,
            redis: env.redis?.length || 0,
            compose: env.compose?.length || 0,
          };

          // Accumulate totals
          totalCounts.applications += envCounts.applications;
          totalCounts.postgres += envCounts.postgres;
          totalCounts.mysql += envCounts.mysql;
          totalCounts.mariadb += envCounts.mariadb;
          totalCounts.mongo += envCounts.mongo;
          totalCounts.redis += envCounts.redis;
          totalCounts.compose += envCounts.compose;

          return {
            environmentId: env.environmentId,
            name: env.name,
            description: env.description,
            createdAt: env.createdAt,

            // Service counts for this environment
            serviceCounts: envCounts,

            // Basic service details (only essential info, no env vars or large files)
            services: {
              applications:
                env.applications?.map((app) => ({
                  applicationId: app.applicationId,
                  name: app.name,
                  appName: app.appName,
                  applicationStatus: app.applicationStatus,
                  sourceType: app.sourceType,
                  buildType: app.buildType,
                  repository: app.repository,
                  branch: app.branch,
                  domainCount: app.domains?.length || 0,
                })) || [],

              postgres:
                env.postgres?.map((db) => ({
                  postgresId: db.postgresId,
                  name: db.name,
                  appName: db.appName,
                  applicationStatus: db.applicationStatus,
                  databaseName: db.databaseName,
                })) || [],

              mysql:
                env.mysql?.map((db) => ({
                  mysqlId: db.mysqlId,
                  name: db.name,
                  appName: db.appName,
                  applicationStatus: db.applicationStatus,
                  databaseName: db.databaseName,
                })) || [],

              mariadb:
                env.mariadb?.map((db) => ({
                  mariadbId: db.mariadbId,
                  name: db.name,
                  appName: db.appName,
                  applicationStatus: db.applicationStatus,
                  databaseName: db.databaseName,
                })) || [],

              mongo:
                env.mongo?.map((db) => ({
                  mongoId: db.mongoId,
                  name: db.name,
                  appName: db.appName,
                  applicationStatus: db.applicationStatus,
                  databaseName: db.databaseName,
                })) || [],

              redis:
                env.redis?.map((db) => ({
                  redisId: db.redisId,
                  name: db.name,
                  appName: db.appName,
                  applicationStatus: db.applicationStatus,
                })) || [],

              compose:
                env.compose?.map((comp) => ({
                  composeId: comp.composeId,
                  name: comp.name,
                  appName: comp.appName,
                  composeStatus: comp.composeStatus,
                  sourceType: comp.sourceType,
                  repository: comp.repository,
                  branch: comp.branch,
                  domainCount: comp.domains?.length || 0,
                })) || [],
            },
          };
        }) || [];

      return {
        projectId: project.projectId,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        organizationId: project.organizationId,

        // Total service counts across all environments
        totalServiceCounts: totalCounts,

        // Environment details
        environmentCount: environments.length,
        environments,
      };
    });

    return ResponseFormatter.success(
      `Successfully fetched ${optimizedProjects.length} project(s) with environment details`,
      optimizedProjects
    );
  },
});
