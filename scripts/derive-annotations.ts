export interface DerivedAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint: boolean;
}

// Verbs that discard data or forcibly end something. Matched against whole
// words of the action, so "cleanAll" matches but "updateDockerCleanup" does not.
// "drop" is left out on purpose: its only use is application-dropDeployment,
// which deploys an uploaded (drag-and-drop) zip.
const DESTRUCTIVE_WORDS = new Set([
  "delete",
  "remove",
  "clean",
  "clear",
  "prune",
  "kill",
  "reset",
  "wipe",
  "purge",
  "revoke",
]);

// Writes that set a value and can be repeated with the same result. Everything
// else that mutates (deploy, start, toggle, generate, ...) is left unmarked,
// since a client may retry tools that claim to be idempotent.
const IDEMPOTENT_WRITE_PREFIX = /^(update|save|set|change)(?![a-z])/;

function actionOf(operationId: string): string {
  const separator = operationId.indexOf("-");
  return separator === -1 ? operationId : operationId.slice(separator + 1);
}

function splitWords(action: string): string[] {
  return action
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

export function deriveAnnotations(method: string, operationId: string): DerivedAnnotations {
  const action = actionOf(operationId);
  const isRead = method.toLowerCase() === "get";
  const isDestructive = !isRead && splitWords(action).some((word) => DESTRUCTIVE_WORDS.has(word));

  const isIdempotent = isRead || (!isDestructive && IDEMPOTENT_WRITE_PREFIX.test(action));

  return {
    ...(isRead ? { readOnlyHint: true } : {}),
    ...(isDestructive ? { destructiveHint: true } : {}),
    ...(isIdempotent ? { idempotentHint: true } : {}),
    openWorldHint: true,
  };
}
