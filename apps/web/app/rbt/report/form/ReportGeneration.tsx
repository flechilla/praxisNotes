"use client";

import React, { useEffect, useState } from "react";
import { Report } from "../../../../lib/types/Report";
import { SessionFormData } from "../../../../lib/types/SessionForm";

type ReportGenerationProps = {
  formData: SessionFormData;
  onBack: () => void;
  onReset: () => void;
};

export default function ReportGeneration({
  formData,
  onBack,
  onReset,
}: ReportGenerationProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateReport() {
      try {
        setLoading(true);
        setError(null);

        // Make API call to generate report
        const response = await fetch("/api/report/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData: formData,
            rbtName: "John Doe", // Mock RBT name
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate report");
        }

        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        console.error("Error generating report:", err);
        setError("There was an error generating the report. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    // Call the function
    generateReport();
  }, [formData]);

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <h3 className="text-xl font-medium text-gray-700">
            Generating Report...
          </h3>
          <p className="text-gray-500 mt-2">
            Please wait while we process your session data.
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 w-full text-center">
            <p className="font-medium">{error}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Go Back
            </button>
            <button
              onClick={generateReport}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show report
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Generated Report
      </h2>

      {report && (
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Name:</span> {report.clientName}
              </p>
              <p>
                <span className="font-medium">Session Date:</span>{" "}
                {report.sessionDate}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {report.sessionDuration}
              </p>
              <p>
                <span className="font-medium">Location:</span> {report.location}
              </p>
            </div>
          </div>

          {/* Report Content */}
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                Session Summary
              </h3>
              <p className="text-gray-700">{report.summary}</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {report.skillAcquisition.title}
              </h3>
              <p className="text-gray-700">{report.skillAcquisition.content}</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {report.behaviorManagement.title}
              </h3>
              <p className="text-gray-700">
                {report.behaviorManagement.content}
              </p>
            </div>

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {report.reinforcement.title}
              </h3>
              <p className="text-gray-700">{report.reinforcement.content}</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {report.observations.title}
              </h3>
              <p className="text-gray-700">{report.observations.content}</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {report.recommendations.title}
              </h3>
              <p className="text-gray-700">{report.recommendations.content}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {report.nextSteps.title}
              </h3>
              <p className="text-gray-700">{report.nextSteps.content}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <div>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition mr-3"
              >
                Edit Data
              </button>
            </div>
            <div className="space-x-3">
              <button
                onClick={() => {
                  alert("Report saved successfully!");
                  onReset();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save Report
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Helper function to regenerate the report on error
  function generateReport() {
    setLoading(true);
    setError(null);

    // Simulate the API call again
    setTimeout(() => {
      fetch("/api/report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: formData,
          rbtName: "John Doe", // Mock RBT name
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to generate report on retry");
          }
          return response.json();
        })
        .then((data) => {
          setReport(data.report);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error regenerating report:", err);
          setError(
            "There was an error generating the report. Please try again."
          );
          setLoading(false);
        });
    }, 1000);
  }
}
