import * as adminTools from "./admin/index.js";
import * as aiTools from "./ai/index.js";
import * as applicationTools from "./application/index.js";
import * as backupTools from "./backup/index.js";
import * as certificatesTools from "./certificates/index.js";
import * as clusterTools from "./cluster/index.js";
import * as composeTools from "./compose/index.js";
import * as databaseTools from "./database/index.js";
import * as deploymentTools from "./deployment/index.js";
import * as destinationTools from "./destination/index.js";
import * as dockerTools from "./docker/index.js";
import * as domainTools from "./domain/index.js";
import * as environmentTools from "./environment/index.js";
import * as gitTools from "./git/index.js";
import * as mountsTools from "./mounts/index.js";
import * as mysqlTools from "./mysql/index.js";
import * as notificationTools from "./notification/index.js";
import * as organizationTools from "./organization/index.js";
import * as portTools from "./port/index.js";
import * as postgresTools from "./postgres/index.js";
import * as previewDeploymentTools from "./previewDeployment/index.js";
import * as projectTools from "./project/index.js";
import * as redirectsTools from "./redirects/index.js";
import * as registryTools from "./registry/index.js";
import * as rollbackTools from "./rollback/index.js";
import * as scheduleTools from "./schedule/index.js";
import * as securityTools from "./security/index.js";
import * as serverTools from "./server/index.js";
import * as settingsTools from "./settings/index.js";
import * as sshKeyTools from "./sshKey/index.js";
import * as stripeTools from "./stripe/index.js";
import * as swarmTools from "./swarm/index.js";
import * as userTools from "./user/index.js";

export const allTools = [
  ...Object.values(adminTools),
  ...Object.values(aiTools),
  ...Object.values(applicationTools),
  ...Object.values(backupTools),
  ...Object.values(certificatesTools),
  ...Object.values(clusterTools),
  ...Object.values(composeTools),
  ...Object.values(databaseTools),
  ...Object.values(deploymentTools),
  ...Object.values(destinationTools),
  ...Object.values(dockerTools),
  ...Object.values(domainTools),
  ...Object.values(environmentTools),
  ...Object.values(gitTools),
  ...Object.values(mountsTools),
  ...Object.values(mysqlTools),
  ...Object.values(notificationTools),
  ...Object.values(organizationTools),
  ...Object.values(portTools),
  ...Object.values(postgresTools),
  ...Object.values(previewDeploymentTools),
  ...Object.values(projectTools),
  ...Object.values(redirectsTools),
  ...Object.values(registryTools),
  ...Object.values(rollbackTools),
  ...Object.values(scheduleTools),
  ...Object.values(securityTools),
  ...Object.values(serverTools),
  ...Object.values(settingsTools),
  ...Object.values(sshKeyTools),
  ...Object.values(stripeTools),
  ...Object.values(swarmTools),
  ...Object.values(userTools),
];
