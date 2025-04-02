"use client";

import React, { useState } from "react";
import { GeneralNotesFormData } from "@praxisnotes/types/src/SessionForm";

type GeneralNotesProps = {
  data: GeneralNotesFormData;
  updateData: (data: GeneralNotesFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function GeneralNotes({
  data,
  updateData,
  onNext,
  onBack,
}: GeneralNotesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.sessionNotes || data.sessionNotes.trim() === "") {
      newErrors.sessionNotes = "Session notes are required";
    }

    if (!data.nextSessionFocus || data.nextSessionFocus.trim() === "") {
      newErrors.nextSessionFocus = "Next session focus is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        General Notes
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Notes */}
        <div>
          <label
            htmlFor="sessionNotes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Session Notes
          </label>
          <textarea
            id="sessionNotes"
            name="sessionNotes"
            value={data.sessionNotes}
            onChange={handleChange}
            rows={5}
            className={`w-full px-3 py-2 border ${errors.sessionNotes ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="Provide general notes about the session, including context, progress, challenges, and any significant events."
          />
          {errors.sessionNotes && (
            <p className="mt-1 text-sm text-red-600">{errors.sessionNotes}</p>
          )}
        </div>

        {/* Caregiver Feedback */}
        <div>
          <label
            htmlFor="caregiverFeedback"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Caregiver Feedback
          </label>
          <textarea
            id="caregiverFeedback"
            name="caregiverFeedback"
            value={data.caregiverFeedback}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Note any feedback, concerns, or information shared by caregivers."
          />
        </div>

        {/* Environmental Factors */}
        <div>
          <label
            htmlFor="environmentalFactors"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Environmental Factors
          </label>
          <textarea
            id="environmentalFactors"
            name="environmentalFactors"
            value={data.environmentalFactors}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe any environmental factors that may have influenced the session (e.g., noise, distractions, changes in routine)."
          />
        </div>

        {/* Next Session Focus */}
        <div>
          <label
            htmlFor="nextSessionFocus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Next Session Focus
          </label>
          <textarea
            id="nextSessionFocus"
            name="nextSessionFocus"
            value={data.nextSessionFocus}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border ${errors.nextSessionFocus ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="Detail the recommended focus areas for the next session based on today's progress."
          />
          {errors.nextSessionFocus && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nextSessionFocus}
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Back
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Report
          </button>
        </div>
      </form>
    </div>
  );
}
