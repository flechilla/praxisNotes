import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "PraxisNote - RBT Dashboard",
  description:
    "Session reporting and management for Registered Behavior Technicians",
};

export default function RBTLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">PraxisNote</h1>
          <nav className="flex items-center space-x-6">
            <a href="/rbt" className="text-gray-600 hover:text-indigo-700">
              Dashboard
            </a>
            <a
              href="/rbt/report"
              className="text-gray-600 hover:text-indigo-700"
            >
              New Report
            </a>
            <a
              href="/rbt/clients"
              className="text-gray-600 hover:text-indigo-700"
            >
              Clients
            </a>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">RBT User</span>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-700">RU</span>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-grow p-6 bg-gray-50">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PraxisNote. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
