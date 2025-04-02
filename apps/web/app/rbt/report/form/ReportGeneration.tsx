"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { NewSessionFormData } from "@praxisnotes/types";
import QuillEditor, {
  QuillEditorHandle,
} from "../../../../components/ui/QuillEditor";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import {
  markdownToHtml,
  htmlToMarkdown,
} from "../../../../utils/markdown-converter";

// Define the metadata type that matches what the API returns
type ReportMetadata = {
  clientName: string;
  sessionDate: string;
  sessionDuration: string;
  location: string;
  rbtName: string;
};

type ReportGenerationProps = {
  formData: NewSessionFormData;
  onBack?: () => void;
  onReset?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  error?: string;
  isActivityBased?: boolean;
};

// Simple fallback for the editor when loading
function EditorFallback() {
  return (
    <div className="border rounded prose max-w-none min-h-[500px] p-4 bg-gray-50 animate-pulse flex items-center justify-center">
      <LoadingSpinner size="medium" className="text-gray-400" />
      <span className="ml-3 text-gray-500">Loading editor...</span>
    </div>
  );
}

export default function ReportGeneration({
  formData,
  onBack,
  onReset,
  onSubmit,
  isSubmitting = false,
  error: externalError,
  isActivityBased = false,
}: ReportGenerationProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableMarkdown, setEditableMarkdown] = useState<string>("");
  const [editableHtml, setEditableHtml] = useState<string>("");
  const [reportMetadata, setReportMetadata] = useState<ReportMetadata | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const editorRef = useRef<QuillEditorHandle>(null);

  // Check if we're running in the browser
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Ensure the editor content is set correctly when in edit mode
  useEffect(() => {
    if (isEditMode && editorRef.current && editableHtml) {
      editorRef.current.setContent(editableHtml);
    }
  }, [isEditMode, editableHtml]);

  // Initialize the useChat hook with the API endpoint for report generation
  const { messages, data, status, append, isLoading, error } = useChat({
    api: "/api/report/generate",
    body: {
      formData,
      rbtName: "Kelly Xu", // Match RBT initials (KX) from narrative
      isActivityBased,
    },
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

  // Extract report metadata from the response
  useEffect(() => {
    if (data && data.length > 0) {
      const firstData = data[0];
      if (
        typeof firstData === "object" &&
        firstData !== null &&
        "reportMetadata" in firstData
      ) {
        setReportMetadata(firstData.reportMetadata as ReportMetadata);
      }
    }
  }, [data]);

  // Extract markdown content from messages
  useEffect(() => {
    if (messages && messages.length > 0 && isGenerating === false) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage &&
        lastMessage.role === "assistant" &&
        !editableMarkdown
      ) {
        // Only update content if we don't already have content (first load)
        setEditableMarkdown(lastMessage.content);

        // Convert markdown to HTML for Quill
        const convertToHtml = async () => {
          setIsConverting(true);
          try {
            const html = await markdownToHtml(lastMessage.content);
            setEditableHtml(html);
          } catch (err) {
            console.error("Failed to convert markdown to HTML:", err);
          } finally {
            setIsConverting(false);
          }
        };

        convertToHtml();
      }
    }
  }, [messages, isGenerating, editableMarkdown]);

  // Handle Quill editor content changes
  const handleQuillChange = async (html: string) => {
    setEditableHtml(html);

    // Convert HTML back to markdown for storage
    try {
      const markdown = await htmlToMarkdown(html);
      setEditableMarkdown(markdown);
    } catch (err) {
      console.error("Failed to convert HTML to markdown:", err);
    }
  };

  // Toggle between view and edit modes
  const toggleEditMode = async () => {
    setIsConverting(true);

    try {
      if (isEditMode && editorRef.current) {
        // We're switching from edit to view mode
        // Get latest content from editor
        const currentHtml = editorRef.current.getContent();

        // Save the HTML content
        setEditableHtml(currentHtml);

        // Convert to markdown for view mode display
        const markdown = await htmlToMarkdown(currentHtml);
        setEditableMarkdown(markdown);
      } else if (!isEditMode) {
        // We're switching from view to edit mode
        // Make sure the editor will have the latest HTML content
        // No need to do anything here as the editor will get content from editableHtml
      }
    } catch (err) {
      console.error("Failed during mode transition:", err);
    } finally {
      // Toggle the mode
      setIsEditMode(!isEditMode);
      setIsConverting(false);
    }
  };

  // Manually trigger report generation
  const handleManualGeneration = async () => {
    setIsGenerating(true);
  };

  // Determine narrative format
  const isNarrativeFormat = isActivityBased;

  // Show loading state with improved loading animation
  if (
    status === "streaming" ||
    status === "submitted" ||
    isLoading ||
    isSubmitting ||
    isConverting
  ) {
    const previewContent =
      messages && messages.length > 0
        ? messages.find((msg) => msg.role === "assistant")?.content
        : "";

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex flex-col items-center justify-center mb-6">
            <LoadingSpinner size="large" className="mb-4" />
            <h3 className="text-xl font-medium text-gray-700">
              {isConverting
                ? "Preparing Editor"
                : status === "streaming"
                  ? "Creating your narrative..."
                  : "Processing session data..."}
            </h3>
            <p className="text-gray-500 mt-2">
              {isConverting
                ? "Converting content format..."
                : "This might take a few moments"}
            </p>
          </div>

          {previewContent && !isConverting && (
            <div className="mt-4 w-full max-w-2xl bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Preview:</h4>
              <div className="text-gray-600 prose max-h-64 overflow-y-auto">
                Preview Content
                <ReactMarkdown>{previewContent}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show error state with improved error presentation
  if (status === "error" || error || externalError) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 w-full">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="font-medium">
                There was an error generating the report.
              </p>
            </div>
            {error && <p className="text-sm mt-2 ml-8">{error.message}</p>}
            {externalError && (
              <p className="text-sm mt-2 ml-8">{externalError}</p>
            )}
          </div>
          <div className="flex space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Go Back
              </button>
            )}
            <button
              onClick={handleManualGeneration}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show report view/edit with improved layout
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Generated Report</h2>
        {reportMetadata && (
          <div className="text-sm text-gray-500">
            <span className="font-medium">RBT:</span> {reportMetadata.rbtName}
          </div>
        )}
      </div>

      {reportMetadata ? (
        <div className="space-y-6">
          {/* Client Information Card */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-gray-600"
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
              Client Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium text-gray-500 block mb-1">
                  Name
                </span>
                <span className="text-gray-800">
                  {reportMetadata.clientName}
                </span>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium text-gray-500 block mb-1">
                  Session Date
                </span>
                <span className="text-gray-800">
                  {reportMetadata.sessionDate}
                </span>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium text-gray-500 block mb-1">
                  Duration
                </span>
                <span className="text-gray-800">
                  {reportMetadata.sessionDuration}
                </span>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <span className="font-medium text-gray-500 block mb-1">
                  Location
                </span>
                <span className="text-gray-800">{reportMetadata.location}</span>
              </div>
            </div>
          </div>

          {/* Report Content Card */}
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center">
                <svg
                  className="h-5 w-5 mr-2 text-gray-600"
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
                {isNarrativeFormat ? "Session Narrative" : "Report Content"}
              </h3>
              <button
                onClick={toggleEditMode}
                className="px-4 py-1 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition text-sm flex items-center"
              >
                {isEditMode ? (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="p-4">
              {isEditMode ? (
                <div className="prose max-w-none">
                  {isBrowser ? (
                    <Suspense fallback={<EditorFallback />}>
                      <QuillEditor
                        ref={editorRef}
                        value={editableHtml}
                        onChange={handleQuillChange}
                        readOnly={false}
                        className="min-h-[500px]"
                      />
                    </Suspense>
                  ) : (
                    <EditorFallback />
                  )}
                </div>
              ) : (
                <div
                  className={
                    isNarrativeFormat
                      ? "prose max-w-none text-gray-700 leading-relaxed"
                      : "prose max-w-none"
                  }
                >
                  <ReactMarkdown>{editableMarkdown}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between mt-8 pt-4 border-t gap-4">
            <div>
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition flex items-center justify-center"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  Edit Data
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {onSubmit && (
                <button
                  onClick={onSubmit}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <svg
                    className="h-5 w-5 mr-2"
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
                  Submit Report
                </button>
              )}
              {onReset && (
                <button
                  onClick={() => {
                    alert("Report saved successfully!");
                    onReset();
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center justify-center"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save Report
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Report
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500">No report data available.</p>
          <button
            onClick={handleManualGeneration}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm"
          >
            Generate Report
          </button>
        </div>
      )}
    </div>
  );
}
