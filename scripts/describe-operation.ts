// The Dokploy OpenAPI spec carries no summary or description for its
// operations, so without this every tool would be described only by its route
// (e.g. "POST /application.create"). LLM clients choose tools from the
// description, so we derive a readable one from the operationId instead.

export interface DescribeOperationInput {
  operationId: string;
  method: string;
  path: string;
  requiredParams?: string[];
}

// Singular noun for each tag. Tags missing here fall back to the humanized tag.
const RESOURCE_LABELS: Record<string, string> = {
  ai: "AI provider configuration",
  auditLog: "audit log entry",
  backup: "backup configuration",
  bitbucket: "Bitbucket provider",
  certificates: "certificate",
  compose: "Docker Compose service",
  customRole: "custom role",
  destination: "backup destination",
  dnsProvider: "DNS provider",
  dockerImage: "Docker image",
  dockerVolume: "Docker volume",
  forwardAuth: "forward-auth configuration",
  gitProvider: "Git provider",
  gitea: "Gitea provider",
  github: "GitHub provider",
  gitlab: "GitLab provider",
  libsql: "libSQL database",
  licenseKey: "license key",
  mariadb: "MariaDB database",
  mongo: "MongoDB database",
  mounts: "mount",
  mysql: "MySQL database",
  network: "Docker network",
  notification: "notification provider",
  port: "port mapping",
  postgres: "PostgreSQL database",
  previewDeployment: "preview deployment",
  redirects: "redirect rule",
  redis: "Redis database",
  registry: "Docker registry",
  schedule: "scheduled job",
  security: "basic-auth credential",
  sshKey: "SSH key",
  vaultProvider: "vault provider",
  volumeBackups: "volume backup",
};

const WORD_CASING: Record<string, string> = {
  ai: "AI",
  api: "API",
  bitbucket: "Bitbucket",
  cpu: "CPU",
  dns: "DNS",
  docker: "Docker",
  gitea: "Gitea",
  github: "GitHub",
  gitlab: "GitLab",
  gpu: "GPU",
  id: "ID",
  ip: "IP",
  libsql: "libSQL",
  mariadb: "MariaDB",
  mongo: "MongoDB",
  mysql: "MySQL",
  nginx: "Nginx",
  postgres: "PostgreSQL",
  redis: "Redis",
  scim: "SCIM",
  ssh: "SSH",
  ssl: "SSL",
  sso: "SSO",
  traefik: "Traefik",
  url: "URL",
};

function splitWords(identifier: string): string[] {
  return identifier
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((word) => WORD_CASING[word.toLowerCase()] ?? word.toLowerCase());
}

function humanize(identifier: string): string {
  return splitWords(identifier).join(" ");
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function withArticle(noun: string): string {
  // Chosen by sound: "SSH" and "SSO" are spelled out, "user" starts with a "y" sound.
  return `${/^([aeio]|u(?!ser|ni)|SS[HO]\b)/i.test(noun) ? "an" : "a"} ${noun}`;
}

function pluralize(noun: string): string {
  if (/[^aeiou]y$/.test(noun)) return `${noun.slice(0, -1)}ies`;
  if (/(s|x|ch|sh)$/.test(noun)) return `${noun}es`;
  return `${noun}s`;
}

type Template = (resource: string) => string;

// Actions that mean the same thing for every tag they appear on.
const ACTION_TEMPLATES: Record<string, Template> = {
  all: (r) => `List ${pluralize(r)}`,
  list: (r) => `List ${pluralize(r)}`,
  one: (r) => `Get ${withArticle(r)} by ID`,
  create: (r) => `Create ${withArticle(r)}`,
  update: (r) => `Update ${withArticle(r)}`,
  delete: (r) => `Delete ${withArticle(r)}`,
  remove: (r) => `Delete ${withArticle(r)}`,
  search: (r) => `Search ${pluralize(r)}`,
  deploy: (r) => `Deploy ${withArticle(r)}`,
  redeploy: (r) => `Redeploy ${withArticle(r)}`,
  rebuild: (r) => `Rebuild ${withArticle(r)}`,
  start: (r) => `Start ${withArticle(r)}`,
  stop: (r) => `Stop ${withArticle(r)}`,
  reload: (r) => `Reload ${withArticle(r)}`,
  move: (r) => `Move ${withArticle(r)} to another environment`,
  duplicate: (r) => `Duplicate ${withArticle(r)}`,
  readLogs: (r) => `Read the logs of ${withArticle(r)}`,
  testConnection: (r) => `Test the connection to ${withArticle(r)}`,
  changeStatus: (r) => `Set the status of ${withArticle(r)}`,
  changePassword: (r) => `Change the password of ${withArticle(r)}`,
  saveExternalPort: (r) => `Set the external port of ${withArticle(r)}`,
  saveEnvironment: (r) =>
    `Replace the environment variables of ${withArticle(r)}. Overwrites the whole block, so send the complete set of variables`,
};

// Tools whose behavior is worth spelling out beyond the generic template.
const OPERATION_OVERRIDES: Record<string, string> = {
  "application-deploy":
    "Queue a deployment of an application. Returns before the build finishes; use deployment-all to check its status",
  "application-dropDeployment":
    "Deploy an application from an uploaded zip archive (drag-and-drop deployment)",
  "application-redeploy":
    "Queue a redeployment of an application. Returns before the build finishes; use deployment-all to check its status",
  "compose-deploy":
    "Queue a deployment of a Docker Compose service. Returns before it finishes; use deployment-allByCompose to check its status",
  "compose-redeploy":
    "Queue a redeployment of a Docker Compose service. Returns before it finishes; use deployment-allByCompose to check its status",
  "deployment-all":
    "List the deployments of an application, newest first, with their status (running, done, error, cancelled)",
  "deployment-allByCompose":
    "List the deployments of a Docker Compose service, newest first, with their status (running, done, error, cancelled)",
  "deployment-readLogs":
    "Read the last lines of a deployment's build log. 'tail' sets the number of lines (default 100)",
  "project-all": "List projects, including their environments and services",
};

export function resourceLabel(tag: string): string {
  return RESOURCE_LABELS[tag] ?? humanize(tag);
}

export function describeOperation({
  operationId,
  method,
  path,
  requiredParams = [],
}: DescribeOperationInput): string {
  const route = `${method.toUpperCase()} ${path}`;
  const separator = operationId.indexOf("-");
  if (separator === -1) return route;

  const tag = operationId.slice(0, separator);
  const action = operationId.slice(separator + 1);
  const resource = resourceLabel(tag);

  const template = ACTION_TEMPLATES[action];
  const sentence =
    OPERATION_OVERRIDES[operationId] ??
    (template ? template(resource) : `${capitalize(humanize(action))} (${resource})`);

  const requires = requiredParams.length > 0 ? ` Requires: ${requiredParams.join(", ")}.` : "";

  return `${sentence}.${requires} [${route}]`;
}
