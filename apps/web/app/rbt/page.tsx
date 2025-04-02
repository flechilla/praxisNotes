"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Client } from "@praxisnotes/types";

type Report = {
  id: string;
  clientName: string;
  date: string;
  status: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
};

export default function RBTDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [reportsError, setReportsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/clients");

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const { data } = await response.json();
        // Transform date strings to Date objects
        const clientsWithDates = data.map((client: Client) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
        }));

        setClients(clientsWithDates);
      } catch (err) {
        setClientsError("Error loading clients");
        console.error("Error fetching clients:", err);
      } finally {
        setLoadingClients(false);
      }
    }

    async function fetchReports() {
      try {
        const response = await fetch("/api/reports?limit=5");

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const { data } = await response.json();
        setReports(data);
      } catch (err) {
        setReportsError("Error loading reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoadingReports(false);
      }
    }

    fetchClients();
    fetchReports();
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

  // Get status badge color based on report status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-amber-50 text-amber-700";
      case "submitted":
        return "bg-blue-50 text-blue-700";
      case "reviewed":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1 text-xl text-gray-600">{today}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/rbt/report"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              New Report
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Clients Card */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-50">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Active Clients
                </p>
                <p className="mt-1 text-2xl font-semibold text-blue-600">
                  {clients.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Card */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-50">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Sessions This Week
                </p>
                <p className="mt-1 text-2xl font-semibold text-green-600">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Draft Reports Card */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-amber-50">
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
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Draft Reports
                </p>
                <p className="mt-1 text-2xl font-semibold text-amber-600">
                  {
                    reports.filter(
                      (report) => report.status.toLowerCase() === "draft",
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Reports Card */}
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-indigo-50">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Completed Reports
                </p>
                <p className="mt-1 text-2xl font-semibold text-indigo-600">
                  {
                    reports.filter(
                      (report) => report.status.toLowerCase() === "reviewed",
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Clients
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {loadingClients ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : clientsError ? (
                <div className="text-center text-red-500 p-6">
                  {clientsError}
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center text-gray-500 p-6">
                  No clients found
                </div>
              ) : (
                clients.slice(0, 5).map((client) => (
                  <div key={client.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-700 font-medium text-sm">
                            {client.firstName.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {client.firstName} {client.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Added: {formatDate(client.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/rbt/report?clientId=${client.id}`}
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        <span>Create Report</span>
                        <svg
                          className="ml-1 w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                href="/rbt/clients"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View all clients
              </Link>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Reports
              </h2>
            </div>
            <div>
              {loadingReports ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : reportsError ? (
                <div className="text-center text-red-500 p-6">
                  {reportsError}
                </div>
              ) : reports.length === 0 ? (
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </div>
                    <p className="text-gray-500 text-center">
                      No recent reports
                    </p>
                    <Link
                      href="/rbt/report"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create your first report
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {reports.map((report) => (
                    <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="sm:flex sm:justify-between sm:items-center">
                        <div>
                          <h3 className="text-sm font-medium text-indigo-600">
                            {report.clientName}
                          </h3>
                          <div className="mt-1 text-sm text-gray-600 flex flex-wrap items-center">
                            <span className="mr-3">{report.date}</span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                            >
                              {report.status.charAt(0).toUpperCase() +
                                report.status.slice(1)}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {report.summary}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0 flex-shrink-0">
                          <Link
                            href={`/rbt/report/${report.id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {reports.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <Link
                  href="/rbt/reports"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View all reports
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  href="/rbt/report"
                  className="flex items-center p-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3"
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
                  <span className="font-medium">Create New Report</span>
                </Link>
                <Link
                  href="/rbt/clients"
                  className="flex items-center p-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3"
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
                  <span className="font-medium">Manage Clients</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center p-3 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="font-medium">My Schedule</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Schedule
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-gray-400"
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
                </div>
                <p className="text-gray-500 text-center">
                  No upcoming sessions scheduled
                </p>
              </div>
            </div>
          </div>

          {/* Resources Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-indigo-500">
              <h2 className="text-lg font-semibold text-white">Resources</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="font-medium">Documentation</span>
                </a>
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span className="font-medium">Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
