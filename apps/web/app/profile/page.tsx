"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useSession } from "next-auth/react";

/**
 * Example page that uses client-side route protection
 */
export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xl font-medium text-indigo-700">
                {session?.user?.name
                  ? session.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : session?.user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {session?.user?.name || "User"}
              </h2>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Account Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{session?.user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {session?.user?.name || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium">
                  {session?.user?.organizationId ? "Connected" : "None"}
                  {session?.user?.isDefaultOrg ? " (Default)" : ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Last Sign In</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Account Security</h3>

            <div className="space-y-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Change Password
              </button>

              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition ml-2">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
