/**
 * Content-level redaction, applied to text that arrived base64-encoded.
 *
 * `docker-readContainerFile` and its siblings do not return a file as plain
 * text — they return it base64-encoded. That defeated the content passes
 * completely: they look for `KEY=value` lines and for secret formats, and a
 * base64 blob contains neither. A secret in a file the path guard did not
 * cover therefore travelled through fully intact, merely encoded — which is no
 * obstacle at all to a model that can decode it.
 *
 * The gap only surfaced when the guards were tried against the live API. The
 * unit tests had been written against plain text, so they all passed while the
 * layer did nothing where it mattered most.
 */

/** Standard alphabet only; the file APIs do not use the URL-safe variant. */
const BASE64_ALPHABET = /^[A-Za-z0-9+/]+={0,2}$/;

/** Control characters that no text file would contain. */
// biome-ignore lint/suspicious/noControlCharactersInRegex: detecting binary payloads is the point
const BINARY_MARKERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

/** Below this, a match is far likelier to be coincidence than encoding. */
const MIN_ENCODED_LENGTH = 16;

/**
 * Decodes `text` when it is base64-encoded UTF-8, otherwise returns null.
 *
 * The check is deliberately strict: the candidate must round-trip back to the
 * exact same base64. That rules out both coincidental matches and binary
 * payloads, whose bytes do not survive a UTF-8 conversion unchanged.
 */
export function decodeBase64Text(text: string): string | null {
  const compact = text.replace(/\s+/g, "");
  if (compact.length < MIN_ENCODED_LENGTH || compact.length % 4 !== 0) return null;
  if (!BASE64_ALPHABET.test(compact)) return null;

  const decoded = Buffer.from(compact, "base64").toString("utf8");
  if (decoded.length === 0) return null;
  if (Buffer.from(decoded, "utf8").toString("base64") !== compact) return null;
  if (BINARY_MARKERS.test(decoded)) return null;

  return decoded;
}

/**
 * Runs `transform` over `text`, seeing through a base64 wrapper if there is one.
 *
 * The input is returned untouched when nothing was masked, so a response that
 * holds no secret keeps its exact original encoding — line breaks, padding and
 * all — instead of being silently re-encoded on every call.
 */
export function throughBase64(text: string, transform: (plain: string) => string): string {
  const decoded = decodeBase64Text(text);
  if (decoded === null) return transform(text);

  const masked = transform(decoded);
  if (masked === decoded) return text;

  return Buffer.from(masked, "utf8").toString("base64");
}
