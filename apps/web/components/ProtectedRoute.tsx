"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireOrganization?: boolean;
};

/**
 * Client-side route protection component
 * Works alongside server middleware for enhanced security
 */
export default function ProtectedRoute({
  children,
  requireOrganization = true,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = status === "loading";

  useEffect(() => {
    // If authentication is being loaded, don't do anything yet
    if (isLoading) return;

    // If not authenticated, redirect to signin
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // If authenticated but no organization when required
    if (requireOrganization && session?.user && !session.user.organizationId) {
      router.push("/auth/no-organization");
    }
  }, [isLoading, status, session, router, pathname, requireOrganization]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the children
  if (status === "unauthenticated") {
    return null;
  }

  // If organization is required but user doesn't have one, don't render children
  if (requireOrganization && session?.user && !session.user.organizationId) {
    return null;
  }

  // Otherwise, render the protected content
  return <>{children}</>;
}
