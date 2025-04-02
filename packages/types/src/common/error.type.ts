/**
 * Standard API error structure
 */
export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

/**
 * Error codes used throughout the application
 */
export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  CACHE_ERROR = "CACHE_ERROR",
}

/**
 * Map of error codes to HTTP status codes
 */
export const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
  [ErrorCode.VALIDATION_ERROR]: 422,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.CACHE_ERROR]: 500,
};
