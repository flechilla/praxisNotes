"use client";

import React, { useState } from "react";
import {
  ReinforcementFormData,
  Reinforcer,
} from "../../../../lib/types/SessionForm";
import {
  reinforcerTypeOptions,
  effectivenessOptions,
} from "../../constants/formOptions";

type ReinforcementProps = {
  data: ReinforcementFormData;
  updateData: (data: ReinforcementFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Reinforcement({
  data,
  updateData,
  onNext,
  onBack,
}: ReinforcementProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentReinforcer, setCurrentReinforcer] = useState<Reinforcer>({
    reinforcerId: "",
    reinforcerType: "",
    reinforcerName: "",
    name: "",
    type: "",
    effectiveness: "",
    notes: "",
  });

  const validateForm = () => {
    // At least one reinforcer should be added
    if (data.reinforcers.length === 0) {
      setErrors({ general: "At least one reinforcer must be added" });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateReinforcer = () => {
    const newErrors: Record<string, string> = {};

    if (!currentReinforcer.reinforcerId) {
      newErrors.reinforcerId = "Reinforcer selection is required";
    }

    if (!currentReinforcer.reinforcerType) {
      newErrors.reinforcerType = "Reinforcer type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReinforcerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Handle reinforcer selection - set both ID and name
    if (name === "reinforcerId") {
      const selectedReinforcer = mockReinforcerOptions.find(
        (r) => r.id === value,
      );
      setCurrentReinforcer({
        ...currentReinforcer,
        reinforcerId: value,
        reinforcerName: selectedReinforcer ? selectedReinforcer.name : "",
        name: selectedReinforcer ? selectedReinforcer.name : "",
        reinforcerType: selectedReinforcer
          ? selectedReinforcer.type.toLowerCase()
          : "",
        type: selectedReinforcer ? selectedReinforcer.type.toLowerCase() : "",
      });
      return;
    }

    // Handle reinforcer type selection
    if (name === "reinforcerType") {
      setCurrentReinforcer({
        ...currentReinforcer,
        reinforcerType: value,
        type: value,
      });
      return;
    }

    // Handle effectiveness selection
    if (name === "effectiveness") {
      setCurrentReinforcer({
        ...currentReinforcer,
        effectiveness: value,
      });
      return;
    }

    // Handle other inputs
    setCurrentReinforcer({
      ...currentReinforcer,
      [name]: value,
    });
  };

  const addReinforcer = () => {
    if (validateReinforcer()) {
      const updatedReinforcers = [...data.reinforcers, currentReinforcer];
      updateData({ reinforcers: updatedReinforcers });

      // Reset current reinforcer form
      setCurrentReinforcer({
        reinforcerId: "",
        reinforcerType: "",
        reinforcerName: "",
        name: "",
        type: "",
        effectiveness: "",
        notes: "",
      });
    }
  };

  const removeReinforcer = (index: number) => {
    const updatedReinforcers = data.reinforcers.filter((_, i) => i !== index);
    updateData({ reinforcers: updatedReinforcers });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If there's data in the current reinforcer form, check if it's valid
    if (currentReinforcer.reinforcerId && !validateReinforcer()) {
      return; // Don't proceed if the current reinforcer is invalid
    }

    // If current reinforcer is valid but not added, add it
    if (currentReinforcer.reinforcerId && validateReinforcer()) {
      const updatedReinforcers = [...data.reinforcers, currentReinforcer];
      updateData({ reinforcers: updatedReinforcers });
      // Then reset and continue
      setCurrentReinforcer({
        reinforcerId: "",
        reinforcerType: "",
        reinforcerName: "",
        name: "",
        type: "",
        effectiveness: "",
        notes: "",
      });
    }

    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Reinforcement
      </h2>

      {/* Reinforcer List */}
      {data.reinforcers.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Added Reinforcers
          </h3>
          <div className="space-y-3">
            {data.reinforcers.map((reinforcer, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {reinforcer.reinforcerName || reinforcer.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Type:{" "}
                      {(reinforcer.reinforcerType || reinforcer.type)
                        .charAt(0)
                        .toUpperCase() +
                        (reinforcer.reinforcerType || reinforcer.type).slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Effectiveness: {reinforcer.effectiveness}
                      {effectivenessOptions.find(
                        (opt) => opt.value === reinforcer.effectiveness,
                      )?.label &&
                        ` (${effectivenessOptions.find((opt) => opt.value === reinforcer.effectiveness)?.label})`}
                    </p>
                    {reinforcer.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        Notes: {reinforcer.notes}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeReinforcer(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error message if no reinforcers added */}
      {errors.general && <p className="text-red-600 mb-4">{errors.general}</p>}

      {/* Add Reinforcer Form */}
      <div className="border border-gray-200 rounded-md p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Add Reinforcer
        </h3>

        <div className="space-y-4">
          {/* Reinforcer Selection */}
          <div>
            <label
              htmlFor="reinforcerId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reinforcer
            </label>
            <select
              id="reinforcerId"
              name="reinforcerId"
              value={currentReinforcer.reinforcerId}
              onChange={handleReinforcerChange}
              className={`w-full px-3 py-2 border ${errors.reinforcerId ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select reinforcer</option>
              {mockReinforcerOptions.map((reinforcer) => (
                <option key={reinforcer.id} value={reinforcer.id}>
                  {reinforcer.name} ({reinforcer.type})
                </option>
              ))}
            </select>
            {errors.reinforcerId && (
              <p className="mt-1 text-sm text-red-600">{errors.reinforcerId}</p>
            )}
          </div>

          {/* Reinforcer Type */}
          <div>
            <label
              htmlFor="reinforcerType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reinforcer Type
            </label>
            <select
              id="reinforcerType"
              name="reinforcerType"
              value={currentReinforcer.reinforcerType}
              onChange={handleReinforcerChange}
              className={`w-full px-3 py-2 border ${errors.reinforcerType ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select type</option>
              {reinforcerTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.reinforcerType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reinforcerType}
              </p>
            )}
          </div>

          {/* Effectiveness */}
          <div>
            <label
              htmlFor="effectiveness"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Effectiveness
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="effectiveness"
                name="effectiveness"
                min="1"
                max="5"
                value={currentReinforcer.effectiveness || "3"}
                onChange={handleReinforcerChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium">
                {currentReinforcer.effectiveness || "3"}/5{" "}
                {effectivenessOptions.find(
                  (opt) => opt.value === currentReinforcer.effectiveness,
                )?.label &&
                  `(${effectivenessOptions.find((opt) => opt.value === currentReinforcer.effectiveness)?.label})`}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={currentReinforcer.notes}
              onChange={handleReinforcerChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add any relevant notes about the reinforcer's use and effects"
            />
          </div>

          {/* Add Reinforcer Button */}
          <div>
            <button
              type="button"
              onClick={addReinforcer}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Reinforcer
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
