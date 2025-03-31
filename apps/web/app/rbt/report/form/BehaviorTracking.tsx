"use client";

import React, { useState, useEffect } from "react";
import {
  BehaviorTrackingFormData,
  Behavior,
} from "../../../../lib/types/SessionForm";
import { behaviorIntensityOptions } from "../../constants/formOptions";
import {
  getAllBehaviors,
  BehaviorOption,
} from "../../../../lib/mocks/behaviorsData";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";

type BehaviorTrackingProps = {
  data: BehaviorTrackingFormData;
  updateData: (data: BehaviorTrackingFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

// Extend the Behavior type for the form
type BehaviorFormData = Behavior & {
  behaviorId?: string;
};

export default function BehaviorTracking({
  data,
  updateData,
  onNext,
  onBack,
}: BehaviorTrackingProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentBehavior, setCurrentBehavior] = useState<BehaviorFormData>({
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

  // State for predefined options
  const [behaviors, setBehaviors] = useState<BehaviorOption[]>([]);
  const [loadingBehaviors, setLoadingBehaviors] = useState(false);
  const [selectedBehaviorId, setSelectedBehaviorId] = useState<string>("");

  // Fetch behaviors on component mount
  useEffect(() => {
    const fetchBehaviors = async () => {
      setLoadingBehaviors(true);
      try {
        const behaviorsData = await getAllBehaviors();
        setBehaviors(behaviorsData);
      } catch (error) {
        console.error("Error fetching behaviors:", error);
      } finally {
        setLoadingBehaviors(false);
      }
    };

    fetchBehaviors();
  }, []);

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

    if (name === "behaviorSelect") {
      setSelectedBehaviorId(value);

      if (value) {
        const selectedBehavior = behaviors.find((b) => b.id === value);
        if (selectedBehavior) {
          setCurrentBehavior({
            ...currentBehavior,
            name: selectedBehavior.name,
            definition: selectedBehavior.definition,
            behaviorId: selectedBehavior.id,
          });
        }
      }
    } else if (["frequency", "duration"].includes(name)) {
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
        behaviorId: "",
      });
      setSelectedBehaviorId("");
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
                  Select Predefined Behavior
                </label>
                <div className="relative">
                  <select
                    name="behaviorSelect"
                    value={selectedBehaviorId}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    disabled={loadingBehaviors}
                  >
                    <option value="">
                      Select a behavior or enter your own
                    </option>
                    {behaviors.map((behavior) => (
                      <option key={behavior.id} value={behavior.id}>
                        {behavior.name}
                      </option>
                    ))}
                  </select>
                  {loadingBehaviors && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Behavior Name {selectedBehaviorId ? "(Pre-filled)" : ""}
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
                  Definition {selectedBehaviorId ? "(Pre-filled)" : ""}
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
                <input
                  type="text"
                  name="antecedent"
                  value={currentBehavior.antecedent}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="What happened before the behavior"
                />
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
                <input
                  type="text"
                  name="consequence"
                  value={currentBehavior.consequence}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="What happened after the behavior"
                />
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
                <input
                  type="text"
                  name="intervention"
                  value={currentBehavior.intervention}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="What intervention was used"
                />
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

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBehaviorForm(false);
                    setErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBehavior}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                  Add Behavior
                </button>
              </div>
            </div>
          )}

          {/* List of added behaviors */}
          {data.behaviors.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Behavior
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Frequency
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Duration
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Intensity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.behaviors.map((behavior, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {behavior.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {behavior.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {behavior.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {behavior.intensity.charAt(0).toUpperCase() +
                          behavior.intensity.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveBehavior(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 text-center rounded-lg text-gray-500">
              No behaviors added yet. Click the "Add Behavior" button to add.
            </div>
          )}
        </div>

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
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
