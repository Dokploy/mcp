import { mapStrings, REDACTED_PLACEHOLDER } from "./redactSensitive.js";

/**
 * Shape-based redaction, for text that has no structure to key off.
 *
 * The other passes need a name: a field called `password`, or an assignment
 * whose key says `DB_PASSWORD`. Log output offers neither — it is prose with a
 * secret somewhere inside it, and `deployment-readLogs`,
 * `application-readLogs` and `compose-readLogs` hand it straight to the model.
 *
 * What is left is the shape of the secret itself. That only works where the
 * format is distinctive enough to be recognised on sight, so this list is
 * deliberately short: credentials inside a URI, `Authorization` headers, PEM
 * blocks, JWTs, and the token formats of a few large providers. Every entry
 * here is one a human could pick out of a log line without context.
 *
 * It is explicitly NOT a general secret detector. `Connecting as admin with
 * password hunter2` is invisible to it, and no amount of pattern work would
 * change that without shredding legitimate output. Entropy-based guessing is
 * avoided for the same reason: a log mangled by false positives is useless
 * exactly when it is needed.
 */
interface ShapeRule {
  /** Reported in tests and useful when tuning; not shown to clients. */
  name: string;
  pattern: RegExp;
  replacement: string;
}

const SHAPE_RULES: ShapeRule[] = [
  {
    // Whole PEM block. Matched before anything else so that its base64 body is
    // never picked apart by the narrower rules below.
    name: "pem-private-key",
    pattern: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z0-9 ]*PRIVATE KEY-----/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    // postgres://user:password@host — the single most common way a secret ends
    // up in a build log. Only the password is masked: scheme, user and host
    // are what makes the line useful for debugging.
    name: "uri-credentials",
    pattern: /([a-z][a-z0-9+.-]*:\/\/[^\s/:@]*):[^\s/@]+@/gi,
    replacement: `$1:${REDACTED_PLACEHOLDER}@`,
  },
  {
    name: "authorization-header",
    pattern: /\b(authorization\s*[:=]\s*(?:bearer|basic|token)\s+)[\w.~+/=-]+/gi,
    replacement: `$1${REDACTED_PLACEHOLDER}`,
  },
  {
    // Three base64url segments separated by dots. A plain base64 blob has no
    // dots, so an encoded JSON document — which also starts with "eyJ" — is
    // not caught by accident.
    name: "jwt",
    pattern: /\beyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]+/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    name: "github-token",
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    name: "github-fine-grained-token",
    pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    name: "gitlab-token",
    pattern: /\bglpat-[A-Za-z0-9_-]{20,}\b/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    name: "aws-access-key-id",
    pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    name: "openai-key",
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    name: "slack-token",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
    replacement: REDACTED_PLACEHOLDER,
  },
  {
    name: "stripe-secret-key",
    pattern: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g,
    replacement: REDACTED_PLACEHOLDER,
  },
];

/** Exposed so tests can assert every rule is exercised. */
export const SHAPE_RULE_NAMES = SHAPE_RULES.map((rule) => rule.name);

/**
 * Masks recognisable secret formats inside a block of text. Returns the input
 * unchanged when nothing matches, so untouched responses keep their identity.
 */
export function redactSecretShapes(text: string): string {
  let result = text;

  for (const rule of SHAPE_RULES) {
    // A fresh RegExp per call keeps the global flag's lastIndex from leaking
    // between invocations.
    result = result.replace(new RegExp(rule.pattern.source, rule.pattern.flags), rule.replacement);
  }

  return result;
}

/** Applies {@link redactSecretShapes} to every string in a response. */
export function redactSecretShapesDeep<T>(data: T): T {
  return mapStrings(data, redactSecretShapes);
}
