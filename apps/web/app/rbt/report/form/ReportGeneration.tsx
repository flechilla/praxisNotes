"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState<string>("");
  const [baseReport, setBaseReport] = useState<Omit<
    Report,
    "fullContent"
  > | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Initialize the useChat hook with the API endpoint for report generation
  const { messages, data, status, append, isLoading, error } = useChat({
    api: "/api/report/generate",
    // Send the form data and RBT name
    body: {
      formData,
      rbtName: "John Doe", // Mock RBT name
    },
    // Use data stream protocol
    streamProtocol: "data",
    id: `report-${formData.basicInfo.clientId}-${formData.basicInfo.sessionDate}`,
  });

  // Trigger the report generation when the component mounts
  useEffect(() => {
    const generateReport = async () => {
      if (isGenerating) {
        try {
          await append({
            role: "user",
            content: "Generate report",
          });
          setIsGenerating(false);
        } catch (err) {
          console.error("Failed to generate report:", err);
          setIsGenerating(false);
        }
      }
    };

    generateReport();
  }, [append, isGenerating, formData]);

  // When AI data is received, extract the base report
  useEffect(() => {
    if (data && data.length > 0) {
      const firstData = data[0];
      if (
        typeof firstData === "object" &&
        firstData !== null &&
        "baseReport" in firstData
      ) {
        setBaseReport(firstData.baseReport as Omit<Report, "fullContent">);
      }
    }
  }, [data]);

  // When messages are received, use the content as the markdown
  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        setEditableMarkdown(lastMessage.content);
      }
    }
  }, [messages]);

  // Toggle between view and edit modes
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Handle markdown content changes in edit mode
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableMarkdown(e.target.value);
  };

  // Manually trigger report generation
  const handleManualGeneration = async () => {
    setIsGenerating(true);
  };

  // Show loading state
  if (status === "streaming" || status === "submitted" || isLoading) {
    const previewContent =
      messages && messages.length > 0
        ? messages.find((msg) => msg.role === "assistant")?.content
        : "";

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
          {previewContent && (
            <div className="mt-6 w-full max-w-2xl bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Preview:</h4>
              <div className="text-gray-600 prose">
                <ReactMarkdown>{previewContent}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show error state
  if (status === "error" || error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 w-full text-center">
            <p className="font-medium">
              There was an error generating the report. Please try again.
            </p>
            {error && <p className="text-sm mt-2">{error.message}</p>}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Go Back
            </button>
            <button
              onClick={handleManualGeneration}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show report view/edit
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Generated Report
      </h2>

      {baseReport ? (
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {baseReport.clientName}
              </p>
              <p>
                <span className="font-medium">Session Date:</span>{" "}
                {baseReport.sessionDate}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {baseReport.sessionDuration}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {baseReport.location}
              </p>
            </div>
          </div>

          {/* Report Content */}
          <div className="border p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Report Content
              </h3>
              <button
                onClick={toggleEditMode}
                className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
              >
                {isEditMode ? "View" : "Edit"}
              </button>
            </div>

            {isEditMode ? (
              <div className="border rounded">
                <textarea
                  className="w-full h-[500px] p-4 border-0 rounded font-mono text-sm focus:ring-2 focus:ring-indigo-500"
                  value={editableMarkdown}
                  onChange={handleMarkdownChange}
                />
              </div>
            ) : (
              <div className="prose max-w-none">
                <ReactMarkdown>{editableMarkdown}</ReactMarkdown>
              </div>
            )}
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
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600">No report data available.</p>
          <button
            onClick={handleManualGeneration}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Generate Report
          </button>
        </div>
      )}
    </div>
  );
}
