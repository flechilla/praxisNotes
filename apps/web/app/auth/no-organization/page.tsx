"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function NoOrganizationContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrganization = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${session?.user?.name || "My"}'s Organization`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create organization");
      }

      // Refresh the session to get the new organization
      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      console.error("Error creating organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/signin" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            No Organization Found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You need to be part of an organization to use this application.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleCreateOrganization}
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
          >
            {isLoading ? "Creating..." : "Create New Organization"}
          </button>

          <button
            onClick={handleSignOut}
            className="group relative flex w-full justify-center rounded-md bg-gray-200 py-2 px-3 text-sm font-semibold text-gray-900 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NoOrganization() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <div className="w-full max-w-md text-center">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      }
    >
      <NoOrganizationContent />
    </Suspense>
  );
}
