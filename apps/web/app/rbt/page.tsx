"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DBClient } from "../../lib/types/Client";

export default function RBTDashboard() {
  const [clients, setClients] = useState<DBClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/clients");

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const { data } = await response.json();
        // Transform date strings to Date objects
        const clientsWithDates = data.map((client: any) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
        }));

        setClients(clientsWithDates);
      } catch (err) {
        setError("Error loading clients");
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">RBT Dashboard</h1>
          <p className="text-gray-600">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Link
              href="/rbt/report"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Create Report
            </Link>
            <Link
              href="#"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              View Clients
            </Link>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Clients
          </h2>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : clients.length === 0 ? (
              <div className="text-center text-gray-500">No clients found</div>
            ) : (
              clients.slice(0, 3).map((client) => (
                <div
                  key={client.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-500">
                      Added: {formatDate(client.createdAt)}
                    </p>
                  </div>
                  <Link
                    href={`/rbt/report?clientId=${client.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Create Report
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Reports
          </h2>
          <div className="flex justify-center items-center h-32 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No recent reports</p>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Upcoming Schedule
        </h2>
        <div className="flex justify-center items-center h-32 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No upcoming sessions scheduled</p>
        </div>
      </div>
    </div>
  );
}
