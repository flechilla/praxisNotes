# API Response Standardization

## Overview

This document outlines the standardized approach for handling API responses across the PraxisNotes application. Consistent API response formats enable reliable client-side handling, simplify error management, and improve developer experience.

## Response Structure

All API endpoints should return responses using the `ApiResponse<T>` type defined in `packages/types/src/common/response.type.ts`:

```typescript
/**
 * Standard API response structure
 */
export type ApiResponse<T> = {
  data?: T; // The payload of the response
  error?: ApiError; // Error details if request failed
  meta?: {
    // Metadata for pagination, etc.
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
};
```

## Success Responses

For successful responses, always use the `createApiResponse` helper function from `apps/web/lib/errors.ts`:

```typescript
import { createApiResponse } from "../../../lib/errors";

// Single item response
return createApiResponse({ item: result });

// Collection response
return createApiResponse({
  items: results,
  meta: {
    page: currentPage,
    perPage: pageSize,
    total: totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  },
});

// Empty success response
return createApiResponse({ success: true });
```

## Error Handling

For error responses, use the `handleApiError` helper or `withErrorHandling` decorator:

```typescript
// Using withErrorHandling (recommended)
export const GET = withErrorHandling(async (request: NextRequest) => {
  // Your API logic here
});

// Direct error handling example
try {
  // Your logic here
} catch (error) {
  return handleApiError(error);
}
```

### Custom Error Responses

When returning custom errors within an API route:

```typescript
import { ApiError, ErrorCode } from "@praxisnotes/types";

const error: ApiError = {
  code: ErrorCode.BAD_REQUEST,
  message: "Invalid input provided",
  details: { fieldErrors: { name: "Name is required" } },
};

return NextResponse.json({ error }, { status: 400 });
```

## Standards By Resource Type

To maintain consistency, follow these naming conventions for resource responses:

| Resource Type | Single Resource | Collection  | Example                         |
| ------------- | --------------- | ----------- | ------------------------------- |
| User          | `user`          | `users`     | `{ data: { user: {...} } }`     |
| Note          | `note`          | `notes`     | `{ data: { notes: [...] } }`    |
| Behavior      | `behavior`      | `behaviors` | `{ data: { behavior: {...} } }` |

## Implementation Checklist

- [ ] Update all existing API endpoints to use the standard response format
- [ ] Refactor domain-specific response types (BehaviorResponse, SkillResponse, etc.) to use the common ApiResponse type
- [ ] Add proper error handling to all API routes using withErrorHandling
- [ ] Implement pagination metadata for all collection endpoints
- [ ] Update client-side code to properly handle the standardized responses

## Code Examples

### Complete Route Example

```typescript
import { NextRequest } from "next/server";
import { db, withDb } from "../../../lib/db";
import { createApiResponse, withErrorHandling } from "../../../lib/errors";
import { ApiError, ErrorCode } from "@praxisnotes/types";
import { users } from "@praxisnotes/database";
import { eq } from "drizzle-orm";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    const error: ApiError = {
      code: ErrorCode.BAD_REQUEST,
      message: "User ID is required",
    };
    return NextResponse.json({ error }, { status: 400 });
  }

  return await withDb(async () => {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (!user.length) {
      const error: ApiError = {
        code: ErrorCode.NOT_FOUND,
        message: "User not found",
      };
      return NextResponse.json({ error }, { status: 404 });
    }

    return createApiResponse({ user: user[0] });
  });
});
```

## Client-Side Handling

```typescript
// Example of client-side handling
async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users?id=${id}`);
    const json = await response.json();

    if (json.error) {
      // Handle error based on error code
      console.error(`Error: ${json.error.message}`);
      return null;
    }

    return json.data.user;
  } catch (err) {
    console.error("Failed to fetch user", err);
    return null;
  }
}
```
