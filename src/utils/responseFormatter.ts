export interface FormattedResponse {
  [key: string]: unknown;
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

export class ResponseFormatter {
  static success(message: string, data?: unknown): FormattedResponse {
    const responseData = {
      success: true,
      message,
      ...(data !== undefined && data !== null ? { data } : {}),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(responseData, null, 2),
        },
      ],
    };
  }

  static error(message: string, details?: string): FormattedResponse {
    const errorData = {
      success: false,
      error: message,
      ...(details && { details }),
    };

    return {
      isError: true,
      content: [
        {
          type: "text",
          text: JSON.stringify(errorData, null, 2),
        },
      ],
    };
  }
}
