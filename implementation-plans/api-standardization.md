# API Layer Standardization Documentation

## Overview

This document outlines the standardized API layer for the PraxisNotes application. The implementation provides consistent error handling, response formats, and validation patterns across all API endpoints.

## Components

### 1. Standardized Response Formats

All API responses follow a consistent structure:

```typescript
// Success response with data
{
  data: T,
  meta?: Record<string, any>
}

// List response with pagination
{
  data: T[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Status response
{
  success: boolean,
  message?: string
}

// Error response
{
  error: {
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  }
}
```

### 2. Error Handling

Errors are handled consistently using a central error handler that maps various error types to standardized responses with appropriate HTTP status codes:

- `ErrorCode.BAD_REQUEST` → 400
- `ErrorCode.UNAUTHORIZED` → 401
- `ErrorCode.FORBIDDEN` → 403
- `ErrorCode.NOT_FOUND` → 404
- `ErrorCode.VALIDATION_ERROR` → 422
- `ErrorCode.INTERNAL_SERVER_ERROR` → 500
- `ErrorCode.DATABASE_ERROR` → 500

Custom error classes facilitate standardized error responses:

- `NotFoundError`
- `UnauthorizedError`
- `ForbiddenError`
- `ValidationError`
- `DatabaseError`

### 3. Input Validation

Input validation is done using Zod schemas, with dedicated utilities for validating query parameters and request bodies. Validation errors return standardized response formats with details about each validation failure.

### 4. API Middleware

A middleware system wraps each API route handler to provide:

- Authentication checks
- Role-based authorization
- Request/response logging
- Error handling
- Basic rate limiting (placeholder)

## Usage Patterns

### 1. Basic Route Handler

```typescript
import { NextRequest } from "next/server";
import {
  createSuccessResponse,
  withApiMiddleware,
  validateQuery,
  z,
} from "../../../lib/api";

// Schema for validating query parameters
const querySchema = z.object({
  id: z.string().uuid().optional(),
});

// GET handler for resources
async function getHandler(request: NextRequest) {
  // Validate query parameters
  const queryResult = await validateQuery(request, querySchema);
  if (!queryResult.success) {
    return queryResult.response;
  }

  const data = await fetchData(queryResult.data);
  return createSuccessResponse(data);
}

// Apply middleware to handler with options
export const GET = withApiMiddleware(getHandler, {
  requireAuth: true,
  requiredRoles: ["admin"],
});
```

### 2. Handling Validation

```typescript
// Validate request body
const bodyResult = await validateBody(request, createSchema);
if (!bodyResult.success) {
  return bodyResult.response;
}

// Use validated data
const validatedData = bodyResult.data;
```

### 3. Error Handling

```typescript
try {
  // Operation that might fail
  const result = await someOperation();
  return createSuccessResponse(result);
} catch (error) {
  // Let the middleware handle the error
  throw error;
}
```

## List of API Utilities

### Response Utilities

- `createSuccessResponse<T>(data: T, meta?: Record<string, any>)`
- `createListResponse<T>(data: T[], meta: PaginationMeta)`
- `createStatusResponse(success: boolean, message?: string)`
- `createErrorResponse(code: ErrorCode, message: string, details?: Record<string, unknown>)`
- `createNotFoundResponse(message?: string)`
- `createValidationErrorResponse(message?: string, details?: Record<string, unknown>)`
- `createServerErrorResponse(message?: string)`
- `createUnauthorizedResponse(message?: string)`
- `createForbiddenResponse(message?: string)`

### Validation Utilities

- `validateQuery<T>(req: NextRequest, schema: z.ZodType<T>)`
- `validateBody<T>(req: NextRequest, schema: z.ZodType<T>)`

### Middleware

- `withApiMiddleware(handler: NextApiHandler, options?: MiddlewareOptions)`

## Best Practices

1. **Always use the standardized response utilities**:

   - Don't return raw `NextResponse` objects directly
   - Use the appropriate response utility for your use case

2. **Always validate input**:

   - Validate query parameters with `validateQuery`
   - Validate request bodies with `validateBody`
   - Create dedicated schema files for complex entities

3. **Use the middleware for all route handlers**:

   - Apply `withApiMiddleware` to every route handler
   - Configure authentication and authorization requirements

4. **Handle errors consistently**:

   - Use the custom error classes where appropriate
   - Let the middleware handle most error cases
   - Include helpful error details when possible

5. **Follow RESTful principles**:
   - Use appropriate HTTP methods (GET, POST, PUT, DELETE)
   - Structure your endpoints and resources consistently
   - Include hypermedia links where appropriate

## Implementation Files

- `apps/web/lib/api/response.ts` - Response utilities
- `apps/web/lib/api/error-handler.ts` - Error handling
- `apps/web/lib/api/middleware.ts` - API middleware
- `apps/web/lib/api/validation.ts` - Validation utilities
- `apps/web/lib/api/index.ts` - Entry point for API utilities
- `apps/web/lib/schemas/` - Schema definitions for validation
