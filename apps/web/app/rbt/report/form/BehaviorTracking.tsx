"use client";

import React, { useState } from "react";
import {
  BehaviorTrackingFormData,
  Behavior,
} from "../../../../lib/types/SessionForm";
import { behaviorIntensityOptions } from "../../constants/formOptions";

type BehaviorTrackingProps = {
  data: BehaviorTrackingFormData;
  updateData: (data: BehaviorTrackingFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function BehaviorTracking({
  data,
  updateData,
  onNext,
  onBack,
}: BehaviorTrackingProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentBehavior, setCurrentBehavior] = useState<Behavior>({
    name: "",
    definition: "",
    frequency: 0,
    duration: 0,
    intensity: "",
    notes: "",
    antecedent: "",
    consequence: "",
    intervention: "",
  });
  const [showAddBehaviorForm, setShowAddBehaviorForm] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (data.behaviors.length === 0) {
      newErrors.behaviors = "At least one behavior must be added";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBehaviorForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentBehavior.name) {
      newErrors.name = "Behavior name is required";
    }
    if (!currentBehavior.definition) {
      newErrors.definition = "Behavior definition is required";
    }
    if (!currentBehavior.intensity) {
      newErrors.intensity = "Intensity is required";
    }
    if (!currentBehavior.antecedent) {
      newErrors.antecedent = "Antecedent is required";
    }
    if (!currentBehavior.consequence) {
      newErrors.consequence = "Consequence is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (["frequency", "duration"].includes(name)) {
      setCurrentBehavior({
        ...currentBehavior,
        [name]: parseInt(value) || 0,
      });
    } else {
      setCurrentBehavior({ ...currentBehavior, [name]: value });
    }
  };

  const handleAddBehavior = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateBehaviorForm()) {
      // Set behaviorName for compatibility
      const behaviorToAdd = {
        ...currentBehavior,
        behaviorName: currentBehavior.name,
      };

      updateData({
        ...data,
        behaviors: [...data.behaviors, behaviorToAdd],
      });

      // Reset form
      setCurrentBehavior({
        name: "",
        definition: "",
        frequency: 0,
        duration: 0,
        intensity: "",
        notes: "",
        antecedent: "",
        consequence: "",
        intervention: "",
      });
      setShowAddBehaviorForm(false);
      setErrors({});
    }
  };

  const handleRemoveBehavior = (index: number) => {
    updateData({
      ...data,
      behaviors: data.behaviors.filter((_, i) => i !== index),
    });
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
        Behavior Tracking
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Behaviors</h3>
            {!showAddBehaviorForm && (
              <button
                type="button"
                onClick={() => setShowAddBehaviorForm(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              >
                Add Behavior
              </button>
            )}
          </div>

          {errors.behaviors && (
            <p className="text-red-500 text-sm mt-1">{errors.behaviors}</p>
          )}

          {showAddBehaviorForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-md font-medium mb-3 text-gray-700">
                Add New Behavior
              </h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Behavior Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentBehavior.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter the behavior name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Definition
                </label>
                <textarea
                  name="definition"
                  value={currentBehavior.definition}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Define the behavior"
                ></textarea>
                {errors.definition && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.definition}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <input
                    type="number"
                    name="frequency"
                    value={currentBehavior.frequency}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border rounded"
                    placeholder="Number of occurrences"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={currentBehavior.duration}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border rounded"
                    placeholder="Total duration in minutes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intensity
                  </label>
                  <select
                    name="intensity"
                    value={currentBehavior.intensity}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select intensity</option>
                    {behaviorIntensityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.intensity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.intensity}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antecedent
                </label>
                <textarea
                  name="antecedent"
                  value={currentBehavior.antecedent}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="What happened before the behavior"
                ></textarea>
                {errors.antecedent && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.antecedent}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consequence
                </label>
                <textarea
                  name="consequence"
                  value={currentBehavior.consequence}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="What happened after the behavior"
                ></textarea>
                {errors.consequence && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.consequence}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intervention
                </label>
                <textarea
                  name="intervention"
                  value={currentBehavior.intervention}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Strategies used to address the behavior"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={currentBehavior.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="Additional notes about the behavior"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBehaviorForm(false);
                    setErrors({});
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBehavior}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {data.behaviors.length > 0 ? (
            <div className="space-y-3">
              {data.behaviors.map((behavior, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-gray-50 flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-medium">
                      {behavior.name || behavior.behaviorName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Frequency: {behavior.frequency} | Duration:{" "}
                      {behavior.duration} min | Intensity: {behavior.intensity}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Antecedent:</span>{" "}
                      {behavior.antecedent}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Consequence:</span>{" "}
                      {behavior.consequence}
                    </p>
                    {behavior.intervention && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Intervention:</span>{" "}
                        {behavior.intervention}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBehavior(index)}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-lg">
              <p className="text-gray-500">No behaviors added yet</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
