"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="rounded-md border border-gray-200 p-4 shadow-sm">
        <p className="text-center text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="rounded-md border border-gray-200 p-4 shadow-sm">
        <p className="text-center text-sm text-gray-500">
          Not signed in. Please sign in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center space-x-4">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            {session.user.name
              ? session.user.name.charAt(0).toUpperCase()
              : "U"}
          </div>
        )}

        <div className="flex-1">
          <p className="font-semibold">
            {session.user.name || "Anonymous User"}
          </p>
          <p className="text-sm text-gray-500">{session.user.email}</p>
          {session.user.organizationId && (
            <p className="text-xs text-gray-400">
              Organization: {session.user.organizationId}
              {session.user.isDefaultOrg && " (Default)"}
            </p>
          )}
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}
