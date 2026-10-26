import axios from "axios";

export interface ApiFailure {
  code:
    | "AUTHENTICATION_REQUIRED"
    | "PERMISSION_DENIED"
    | "NOT_FOUND"
    | "INVALID_REQUEST"
    | "RATE_LIMITED"
    | "UPSTREAM_UNAVAILABLE"
    | "UPSTREAM_ERROR"
    | "TIMEOUT"
    | "NETWORK_ERROR"
    | "CANCELLED"
    | "INTERNAL_ERROR";
  hint: string;
  httpStatus?: number;
  retryable: boolean;
  retryAfterSeconds?: number;
}

// Never inspect/return upstream messages, response bodies, request config or headers
// other than the strictly parsed Retry-After value: those may contain credentials.
export function classifyApiError(error: unknown): ApiFailure {
  if (!axios.isAxiosError(error)) {
    return {
      code: "INTERNAL_ERROR",
      hint: "The MCP request failed before a usable API response was received.",
      retryable: false,
    };
  }
  const status = error.response?.status;
  const read = error.config?.method?.toUpperCase() === "GET";
  let failure: ApiFailure;
  switch (status) {
    case 401:
      failure = {
        code: "AUTHENTICATION_REQUIRED",
        hint: "Check the API credential and account role. Some Dokploy admin-only procedures also return 401 for an authenticated non-admin account.",
        retryable: false,
      };
      break;
    case 403:
      failure = {
        code: "PERMISSION_DENIED",
        hint: "This account cannot perform the operation. Check delegated permissions; do not broaden access automatically.",
        retryable: false,
      };
      break;
    case 404:
      failure = {
        code: "NOT_FOUND",
        hint: "Check the resource ID and whether this Dokploy version exposes the endpoint; 404 alone does not distinguish them.",
        retryable: false,
      };
      break;
    case 400:
    case 422:
      failure = {
        code: "INVALID_REQUEST",
        hint: "Check arguments against the API schema for the installed Dokploy version.",
        retryable: false,
      };
      break;
    case 429:
      failure = {
        code: "RATE_LIMITED",
        hint: "Dokploy rate-limited this request. Wait before retrying; do not blindly repeat writes.",
        retryable: read,
      };
      break;
    case 502:
    case 503:
    case 504:
      failure = {
        code: "UPSTREAM_UNAVAILABLE",
        hint: "Dokploy or its proxy is temporarily unavailable. Reconcile writes before retrying.",
        retryable: read,
      };
      break;
    default:
      if (status !== undefined)
        failure = {
          code: "UPSTREAM_ERROR",
          hint: "Dokploy returned an HTTP error. Inspect server-side diagnostics through an authorized operator.",
          retryable: false,
        };
      else if (error.code === "ERR_CANCELED")
        failure = { code: "CANCELLED", hint: "The request was cancelled.", retryable: false };
      else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
        failure = {
          code: "TIMEOUT",
          hint: "The request timed out. A write may already have taken effect; reconcile before retrying.",
          retryable: read,
        };
      else
        failure = {
          code: "NETWORK_ERROR",
          hint: "No usable HTTP response was received. Check authorized endpoint connectivity; a write outcome may be unknown.",
          retryable: read,
        };
  }
  if (Number.isInteger(status) && status! >= 100 && status! <= 599) failure.httpStatus = status!;
  const retryAfter = error.response?.headers?.["retry-after"];
  if (status === 429 && typeof retryAfter === "string" && /^\d{1,5}$/.test(retryAfter)) {
    failure.retryAfterSeconds = Math.min(Number(retryAfter), 86400);
  }
  return failure;
}
