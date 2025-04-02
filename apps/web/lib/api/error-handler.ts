import { ErrorCode } from "@praxisnotes/types";
import { ZodError } from "zod";
import {
  createErrorResponse,
  createServerErrorResponse,
  createValidationErrorResponse,
} from "./response";

/**
 * Handle API errors and convert to standardized responses
 * @param error Any error thrown in the API route
 * @returns Standardized error response
 */
export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.reduce(
      (acc, err) => {
        const path = err.path.join(".");
        acc[path] = err.message;
        return acc;
      },
      {} as Record<string, string>,
    );

    return createValidationErrorResponse("Validation failed", {
      fields: formattedErrors,
    });
  }

  // Handle known error types
  if (error instanceof Error) {
    if (error.name === "NotFoundError") {
      return createErrorResponse(
        ErrorCode.NOT_FOUND,
        error.message || "Resource not found",
      );
    }

    if (error.name === "UnauthorizedError") {
      return createErrorResponse(
        ErrorCode.UNAUTHORIZED,
        error.message || "Unauthorized",
      );
    }

    if (error.name === "ForbiddenError") {
      return createErrorResponse(
        ErrorCode.FORBIDDEN,
        error.message || "Forbidden",
      );
    }

    if (error.name === "ValidationError") {
      return createErrorResponse(
        ErrorCode.VALIDATION_ERROR,
        error.message || "Validation failed",
      );
    }

    if (error.name === "DatabaseError") {
      return createErrorResponse(
        ErrorCode.DATABASE_ERROR,
        "Database operation failed",
        { originalError: error.message },
      );
    }
  }

  // Handle other unknown errors as internal server errors
  return createServerErrorResponse("An unexpected error occurred");
}

/**
 * Custom error classes for API
 */
export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends Error {
  constructor(message = "Validation failed") {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends Error {
  constructor(message = "Database operation failed") {
    super(message);
    this.name = "DatabaseError";
  }
}
