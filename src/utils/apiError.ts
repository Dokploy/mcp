import axios from "axios";

export function getServerErrorMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }
  const data = error.response?.data;
  const issueMessages: string[] = Array.isArray(data?.issues)
    ? data.issues
        .map((issue: { message?: unknown }) => issue?.message)
        .filter((message: unknown): message is string => typeof message === "string")
    : [];
  if (issueMessages.length > 0) {
    return issueMessages.join("; ");
  }
  return typeof data?.message === "string" && data.message !== data.code ? data.message : undefined;
}
