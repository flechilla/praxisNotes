"use client";

import { useState, useEffect, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function SignOutContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        await signOut({ redirect: false });
        router.push("/auth/signin?signedOut=true");
      } catch (error) {
        console.error("Error signing out:", error);
        // Redirect anyway
        router.push("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {isLoading ? "Signing out..." : "You have been signed out"}
        </h2>
      </div>
    </div>
  );
}

export default function SignOut() {
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
      <SignOutContent />
    </Suspense>
  );
}
