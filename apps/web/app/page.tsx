"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Client } from "@praxisnotes/types";
import {
  getDashboardStats,
  getUpcomingSessions,
  getRecentReports,
} from "../lib/actions";
import { ClientService } from "../lib/services/client.service";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Dashboard stat card component
const StatCard = ({
  label,
  value,
  icon,
  color = "indigo",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color?: "indigo" | "blue" | "green" | "amber";
}) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 bg-${color}-50`}>
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={`mt-1 text-2xl font-semibold text-${color}-600`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Action card component
const ActionCard = ({
  title,
  description,
  icon,
  color = "indigo",
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: "indigo" | "blue" | "green";
  href?: string;
}) => {
  const CardContent = () => (
    <div className="px-4 py-6 sm:p-6 flex items-center">
      <div className={`flex-shrink-0 bg-${color}-50 rounded-md p-3`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-base font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
      <CardContent />
    </div>
  );
};

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({
    activeClients: 0,
    recentSessions: 0,
    draftReports: 0,
    completedReports: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch all data in parallel
        const [clientsData, statsData, sessionsData, reportsData] =
          await Promise.all([
            ClientService.getAllClients(),
            getDashboardStats(),
            getUpcomingSessions(),
            getRecentReports(),
          ]);

        setClients(clientsData);
        setStats(statsData);
        setUpcomingSessions(sessionsData);
        setRecentReports(reportsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.notes &&
        client.notes.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Quick Stats Section */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Active Clients"
              value={stats.activeClients}
              icon={
                <svg
                  className="h-6 w-6 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Recent Sessions"
              value={stats.recentSessions}
              color="blue"
              icon={
                <svg
                  className="h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Draft Reports"
              value={stats.draftReports}
              color="amber"
              icon={
                <svg
                  className="h-6 w-6 text-amber-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
            />
            <StatCard
              label="Completed Reports"
              value={stats.completedReports}
              color="green"
              icon={
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              title="New Session Report"
              description="Create a new session report"
              color="indigo"
              href="/rbt/report"
              icon={
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />

            <ActionCard
              title="Manage Clients"
              description="View and manage client information"
              color="green"
              icon={
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <ActionCard
              title="View Reports"
              description="Manage your draft reports"
              color="blue"
              icon={
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Upcoming Sessions
            </h2>
            {upcomingSessions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
                No upcoming sessions scheduled.
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {upcomingSessions.map((session, index) => (
                    <li key={session.id || index}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {session.clientName}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700">
                              {session.location}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {session.date}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {session.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Reports
            </h2>
            {recentReports.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
                No reports available.
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {recentReports.map((report, index) => (
                    <li key={report.id || index}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {report.clientName}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                report.status === "draft"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : report.status === "submitted"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-green-50 text-green-700"
                              }`}
                            >
                              {report.status === "draft"
                                ? "Draft"
                                : report.status === "submitted"
                                  ? "Submitted"
                                  : "Reviewed"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {report.date}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Link
                              href={`/rbt/report/view/${report.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Report
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Clients
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
              No clients found.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {filteredClients.map((client) => (
                  <li key={client.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {client.firstName} {client.lastName}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700">
                            {client.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                              />
                            </svg>
                            {client.email || "No email"}
                          </p>
                          {client.phone && (
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              {client.phone}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Link
                            href={`/rbt/report?clientId=${client.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Create Report
                          </Link>
                        </div>
                      </div>
                      {client.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 truncate">
                            {client.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
