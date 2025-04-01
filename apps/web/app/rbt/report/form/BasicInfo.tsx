"use client";

import React, { useState, useEffect } from "react";
import { BasicInfoFormData } from "@praxisnotes/types/src/SessionForm";
import { locationOptions } from "../../constants/formOptions";
import { ClientService } from "../../../../lib/services/client.service";
import { ClientInfo } from "@praxisnotes/types/src/SessionForm";

type BasicInfoProps = {
  data: BasicInfoFormData;
  updateData: (data: BasicInfoFormData) => void;
  onNext: () => void;
};

export default function BasicInfo({
  data,
  updateData,
  onNext,
}: BasicInfoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Format the current date as YYYY-MM-DD for the date input default
  const today = new Date().toISOString().split("T")[0];

  // Fetch clients on component mount
  useEffect(() => {
    async function fetchClients() {
      try {
        const clientData = await ClientService.getAllClientInfos();
        setClients(clientData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  // Check if all required fields are filled
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.sessionDate) {
      newErrors.sessionDate = "Session date is required";
    }

    if (!data.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!data.endTime) {
      newErrors.endTime = "End time is required";
    } else if (
      data.startTime &&
      new Date(`1970-01-01T${data.startTime}`) >=
        new Date(`1970-01-01T${data.endTime}`)
    ) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!data.location) {
      newErrors.location = "Location is required";
    }

    if (!data.clientId) {
      newErrors.clientId = "Client selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Session Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Date */}
        <div>
          <label
            htmlFor="sessionDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Session Date
          </label>
          <input
            type="date"
            id="sessionDate"
            name="sessionDate"
            value={data.sessionDate || today}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.sessionDate ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.sessionDate && (
            <p className="mt-1 text-sm text-red-600">{errors.sessionDate}</p>
          )}
        </div>

        {/* Session Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={data.startTime || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.startTime ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={data.endTime || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.endTime ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <select
            id="location"
            name="location"
            value={data.location || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.location ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">Select location</option>
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Client Selection */}
        <div>
          <label
            htmlFor="clientId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Client
          </label>
          {loading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded-md w-full"></div>
          ) : (
            <select
              id="clientId"
              name="clientId"
              value={data.clientId || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.clientId ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName} -{" "}
                  {client.diagnosis || "No diagnosis"}
                </option>
              ))}
            </select>
          )}
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
