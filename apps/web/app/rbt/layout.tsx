import type { Metadata } from "next";
import React from "react";
import { getSession } from "../../lib/auth";
import UserMenu from "./UserMenu";

export const metadata: Metadata = {
  title: "PraxisNote - RBT Dashboard",
  description:
    "Session reporting and management for Registered Behavior Technicians",
};

export default async function RBTLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user session on the server
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">PraxisNote</h1>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/rbt"
              className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200"
            >
              Dashboard
            </a>
            <a
              href="/rbt/report"
              className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200"
            >
              New Report
            </a>
            <a
              href="/rbt/clients"
              className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200"
            >
              Clients
            </a>
            <UserMenu user={session?.user} />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-indigo-600 focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-white border-t border-gray-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PraxisNote. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            >
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
