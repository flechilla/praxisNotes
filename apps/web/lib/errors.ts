import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  ApiResponse,
  ErrorCode,
  ERROR_STATUS_MAP,
} from "@praxisnotes/types";
import { DatabaseError } from "./db";
import { RedisError } from "@praxisnotes/cache";

/**
 * Handle API errors and return appropriate response
 * @param error The error to handle
 * @returns NextResponse with appropriate status and error details
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Default error as internal server error
  let apiError: ApiError = {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "An unexpected error occurred",
  };

  let statusCode = 500;

  // Determine error type and extract details
  if (error instanceof DatabaseError || error instanceof RedisError) {
    // Already formatted errors
    apiError = {
      code: error.code,
      message: error.message,
      details: error.details,
    };
    statusCode = ERROR_STATUS_MAP[error.code as ErrorCode] || 500;
  } else if (error instanceof Error) {
    // Generic Error object
    apiError = {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: error.message || "An unexpected error occurred",
    };
  } else if (typeof error === "string") {
    // String error
    apiError = {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: error,
    };
  }

  // Create standardized response
  const response: ApiResponse<null> = {
    error: apiError,
  };

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Create a successful API response
 * @param data The data to include in the response
 * @param options Additional response options
 * @returns NextResponse with data and status 200
 */
export function createApiResponse<T>(
  data: T,
  options?: {
    status?: number;
    meta?: ApiResponse<T>["meta"];
  },
): NextResponse {
  const response: ApiResponse<T> = {
    data,
    meta: options?.meta,
  };

  return NextResponse.json(response, { status: options?.status || 200 });
}

/**
 * Wrap an API handler with error handling
 * @param handler The API handler function
 * @returns Wrapped handler with error handling
 */
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
