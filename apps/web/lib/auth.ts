import { AuthSession, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../app/api/auth/[...nextauth]/route";

/**
 * Get the current session on the server
 */
export async function getSession() {
  return (await getServerSession(authOptions)) as AuthSession;
}

/**
 * Check if the user is authenticated, and redirect to sign-in if not
 * @param callbackUrl Optional URL to redirect back to after sign in
 */
export async function requireAuth(callbackUrl?: string) {
  const session = await getSession();

  if (!session?.user) {
    redirect(
      callbackUrl
        ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/auth/signin",
    );
  }

  return session;
}

/**
 * Check if the user is authenticated and has a valid organization
 * Redirects to sign-in if not authenticated
 */
export async function requireAuthWithOrg(callbackUrl?: string) {
  const session = await requireAuth(callbackUrl);

  if (!session.user.organizationId) {
    // Handle case where user doesn't have an organization
    // This could redirect to an "onboarding" page or another destination
    redirect("/auth/no-organization");
  }

  return session;
}
