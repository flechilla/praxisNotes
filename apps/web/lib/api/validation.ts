import { NextRequest } from "next/server";
import { z } from "zod";
import { createValidationErrorResponse } from "./response";

/**
 * Validate request query parameters using a Zod schema
 *
 * @param req Next.js request object
 * @param schema Zod schema to validate against
 * @returns Parsed query parameters or validation response
 */
export async function validateQuery<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<
  { success: true; data: z.infer<T> } | { success: false; response: Response }
> {
  try {
    const url = new URL(req.url);
    const queryObj: Record<string, string> = {};

    // Convert URLSearchParams to a plain object
    url.searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });

    const parsed = schema.parse(queryObj);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join(".");
          acc[path] = err.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      return {
        success: false,
        response: createValidationErrorResponse("Invalid query parameters", {
          fields: formattedErrors,
        }),
      };
    }

    // Handle unexpected errors
    console.error("Query validation error:", error);
    return {
      success: false,
      response: createValidationErrorResponse(
        "Failed to validate query parameters",
      ),
    };
  }
}

/**
 * Validate request body data using a Zod schema
 *
 * @param req Next.js request object
 * @param schema Zod schema to validate against
 * @returns Parsed body data or validation response
 */
export async function validateBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
): Promise<
  { success: true; data: z.infer<T> } | { success: false; response: Response }
> {
  try {
    // Parse JSON body
    const body = await req.json();
    const parsed = schema.parse(body);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join(".");
          acc[path] = err.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      return {
        success: false,
        response: createValidationErrorResponse("Invalid request body", {
          fields: formattedErrors,
        }),
      };
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        response: createValidationErrorResponse("Invalid JSON in request body"),
      };
    }

    // Handle unexpected errors
    console.error("Body validation error:", error);
    return {
      success: false,
      response: createValidationErrorResponse(
        "Failed to validate request body",
      ),
    };
  }
}
