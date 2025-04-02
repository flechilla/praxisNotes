"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState(
    "An authentication error occurred",
  );

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      switch (error) {
        case "CredentialsSignin":
          setErrorMessage("Invalid email or password.");
          break;
        case "SessionRequired":
          setErrorMessage("You need to be signed in to access this page.");
          break;
        case "AccessDenied":
          setErrorMessage("You don't have permission to access this resource.");
          break;
        case "Verification":
          setErrorMessage(
            "The verification link may have expired or is invalid.",
          );
          break;
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
          setErrorMessage("There was a problem with the OAuth authentication.");
          break;
        case "EmailCreateAccount":
        case "EmailSignin":
          setErrorMessage("There was a problem with the email authentication.");
          break;
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration.");
          break;
        default:
          setErrorMessage(`Authentication error: ${error}`);
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
        </div>

        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="text-sm text-red-700">{errorMessage}</div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
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
      <AuthErrorContent />
    </Suspense>
  );
}
