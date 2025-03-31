"use client";

import React, { Suspense } from "react";
import SessionForm from "./SessionForm";

// Loading fallback for Suspense
function FormLoader() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-indigo-600 font-medium">Loading form...</p>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<FormLoader />}>
        <SessionForm />
      </Suspense>
    </div>
  );
}
