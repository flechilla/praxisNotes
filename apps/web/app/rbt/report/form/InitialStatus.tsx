"use client";

import React, { useState } from "react";
import { InitialStatusFormData } from "../../../../lib/types/SessionForm";

type InitialStatusProps = {
  data: InitialStatusFormData;
  updateData: (data: InitialStatusFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function InitialStatus({
  data,
  updateData,
  onNext,
  onBack,
}: InitialStatusProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.clientStatus.trim()) {
      newErrors.clientStatus = "Client status is required";
    }
    if (!data.initialResponse.trim()) {
      newErrors.initialResponse = "Initial response is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Initial Client Status
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="clientStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Client Status on Arrival
          </label>
          <textarea
            id="clientStatus"
            name="clientStatus"
            value={data.clientStatus}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Describe what the client was doing when you arrived"
          ></textarea>
          {errors.clientStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.clientStatus}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="caregiverReport"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Caregiver Report
          </label>
          <textarea
            id="caregiverReport"
            name="caregiverReport"
            value={data.caregiverReport}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Note any information reported by the caregiver (optional)"
          ></textarea>
        </div>

        <div className="mb-6">
          <label
            htmlFor="medicationChanges"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Medication Changes
          </label>
          <textarea
            id="medicationChanges"
            name="medicationChanges"
            value={data.medicationChanges || ""}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 border rounded"
            placeholder="Note any medication changes reported (optional)"
          ></textarea>
        </div>

        <div className="mb-6">
          <label
            htmlFor="initialResponse"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Initial Response to RBT
          </label>
          <textarea
            id="initialResponse"
            name="initialResponse"
            value={data.initialResponse}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="How did the client respond when you arrived?"
          ></textarea>
          {errors.initialResponse && (
            <p className="text-red-500 text-sm mt-1">
              {errors.initialResponse}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
