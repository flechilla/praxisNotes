import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createUnauthorizedResponse } from "./response";
import { handleApiError } from "./error-handler";

/**
 * API middleware types
 */
type NextApiHandler = (req: NextRequest, ctx?: any) => Promise<Response>;

type MiddlewareOptions = {
  requireAuth?: boolean;
  requiredRoles?: string[];
  enableRateLimit?: boolean;
};

/**
 * Apply middleware to an API route handler
 *
 * @param handler The original route handler
 * @param options Middleware options
 * @returns New handler with middleware applied
 */
export function withApiMiddleware(
  handler: NextApiHandler,
  options: MiddlewareOptions = {},
): (req: NextRequest, ctx?: any) => Promise<NextResponse> {
  return async (req: NextRequest, ctx?: any) => {
    console.log(`API Request: ${req.method} ${req.url}`);

    try {
      // Track request timing
      const startTime = Date.now();

      // Authentication check
      if (options.requireAuth) {
        const session = await getServerSession();

        if (!session) {
          return createUnauthorizedResponse("Authentication required");
        }

        // Role-based access control
        if (options.requiredRoles?.length && session.user) {
          const userRoles = (session.user as any).roles || [];
          const hasRequiredRole = options.requiredRoles.some((role) =>
            userRoles.includes(role),
          );

          if (!hasRequiredRole) {
            return createUnauthorizedResponse("Insufficient permissions");
          }
        }
      }

      // Rate limiting (basic implementation)
      // TODO: Replace with a proper rate limiting strategy
      if (options.enableRateLimit) {
        // This is a placeholder for a more robust rate limiting implementation
        // In a production app, use a proper rate limiting library or service
        const clientIp = req.headers.get("x-forwarded-for") || "unknown";
        console.log(`Rate limiting check for IP: ${clientIp}`);
      }

      // Execute the handler
      const response = await handler(req, ctx);

      // Log request completion
      const duration = Date.now() - startTime;
      console.log(`API Response: ${response.status} (${duration}ms)`);

      // Ensure we return a NextResponse
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };
}
