"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ActivityBehavior,
  ActivityPrompt,
  ActivityReinforcement,
} from "../../../../lib/types/SessionForm";
import {
  activityLocationOptions,
  promptTypeOptions,
  interventionTypeOptions,
  behaviorIntensityOptions,
} from "../../constants/formOptions";
import { BehaviorOption } from "../../../../lib/mocks/behaviorsData";
import { fetchAllBehaviors } from "../../../../lib/api/behaviorsApi";
import { fetchAllReinforcers } from "../../../../lib/api/reinforcersApi";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import MultiSelect from "../../../../components/ui/MultiSelect";

type ActivityFormProps = {
  activity: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
};

export default function ActivityForm({
  activity,
  onSave,
  onCancel,
}: ActivityFormProps) {
  const [currentActivity, setCurrentActivity] = useState<Activity>(activity);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for behavior options
  const [behaviors, setBehaviors] = useState<BehaviorOption[]>([]);
  const [loadingBehaviors, setLoadingBehaviors] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // State for reinforcer options
  const [reinforcers, setReinforcers] = useState<any[]>([]);
  const [loadingReinforcers, setLoadingReinforcers] = useState(false);

  // State for current behavior being added
  const [currentBehavior, setCurrentBehavior] = useState<ActivityBehavior>({
    behaviorName: "",
    intensity: "",
    interventionUsed: [],
  });

  // State for current prompt being added
  const [currentPrompt, setCurrentPrompt] = useState<ActivityPrompt>({
    type: "",
    count: 0,
  });

  // Fetch behaviors and reinforcers on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingBehaviors(true);
      setLoadingReinforcers(true);
      setApiError(null);

      try {
        const behaviorsData = await fetchAllBehaviors();
        setBehaviors(behaviorsData);
      } catch (error) {
        console.error("Error fetching behaviors:", error);
        setApiError("Failed to load behaviors. Please try again.");
      } finally {
        setLoadingBehaviors(false);
      }

      try {
        const reinforcersData = await fetchAllReinforcers();
        setReinforcers(reinforcersData);
      } catch (error) {
        console.error("Error fetching reinforcers:", error);
        setApiError((prev) =>
          prev
            ? `${prev} Also failed to load reinforcers.`
            : "Failed to load reinforcers. Please try again."
        );
      } finally {
        setLoadingReinforcers(false);
      }
    };

    fetchOptions();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentActivity.name.trim()) {
      newErrors.name = "Activity name is required";
    }

    if (!currentActivity.goal.trim()) {
      newErrors.goal = "Activity goal is required";
    }

    if (!currentActivity.description.trim()) {
      newErrors.description = "Activity description is required";
    }

    if (!currentActivity.location) {
      newErrors.location = "Location is required";
    }

    if (!currentActivity.reinforcement.reinforcerName) {
      newErrors.reinforcement = "Reinforcement is required";
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

    // For basic activity properties
    if (
      [
        "name",
        "description",
        "goal",
        "location",
        "reinforcerName",
        "type",
        "notes",
      ].includes(name)
    ) {
      setCurrentActivity({
        ...currentActivity,
        [name]: value,
      });
    } else if (name === "completed") {
      setCurrentActivity({
        ...currentActivity,
        completed: value === "true",
      });
    } else if (name === "duration") {
      setCurrentActivity({
        ...currentActivity,
        duration: value ? parseInt(value) : undefined,
      });
    } else if (name === "completionNotes") {
      setCurrentActivity({
        ...currentActivity,
        completionNotes: value,
      });
    }
    // For reinforcement fields
    else if (name.startsWith("reinforcement.")) {
      const reinforcementField = name.split(
        "."
      )[1] as keyof ActivityReinforcement;
      setCurrentActivity({
        ...currentActivity,
        reinforcement: {
          ...currentActivity.reinforcement,
          [reinforcementField]: value,
        },
      });
    }
  };

  const handleSelectReinforcer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reinforcerId = e.target.value;
    if (reinforcerId) {
      const selectedReinforcer = reinforcers.find((r) => r.id === reinforcerId);
      if (selectedReinforcer) {
        setCurrentActivity({
          ...currentActivity,
          reinforcement: {
            ...currentActivity.reinforcement,
            reinforcerId: selectedReinforcer.id,
            reinforcerName: selectedReinforcer.name,
            type: selectedReinforcer.type,
          },
        });
      }
    }
  };

  // Handle behavior fields
  const handleBehaviorChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "behaviorSelect") {
      if (value) {
        const selectedBehavior = behaviors.find((b) => b.id === value);
        if (selectedBehavior) {
          setCurrentBehavior({
            ...currentBehavior,
            behaviorId: selectedBehavior.id,
            behaviorName: selectedBehavior.name,
            definition: selectedBehavior.definition,
          });
        }
      }
    } else {
      setCurrentBehavior({
        ...currentBehavior,
        [name]: value,
      });
    }
  };

  const handleInterventionChange = (selected: string[]) => {
    setCurrentBehavior({
      ...currentBehavior,
      interventionUsed: selected,
    });
  };

  const handleAddBehavior = () => {
    if (
      !currentBehavior.behaviorName ||
      !currentBehavior.intensity ||
      currentBehavior.interventionUsed.length === 0
    ) {
      setErrors({
        ...errors,
        behavior:
          "Behavior, intensity, and at least one intervention are required",
      });
      return;
    }

    setCurrentActivity({
      ...currentActivity,
      behaviors: [...currentActivity.behaviors, currentBehavior],
    });

    // Reset the current behavior
    setCurrentBehavior({
      behaviorName: "",
      intensity: "",
      interventionUsed: [],
      interventionNotes: "",
    });

    // Clear any behavior-related errors
    const { behavior, ...restErrors } = errors;
    setErrors(restErrors);
  };

  const handleRemoveBehavior = (index: number) => {
    setCurrentActivity({
      ...currentActivity,
      behaviors: currentActivity.behaviors.filter((_, i) => i !== index),
    });
  };

  // Handle prompt fields
  const handlePromptChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "count") {
      setCurrentPrompt({
        ...currentPrompt,
        count: parseInt(value) || 0,
      });
    } else {
      setCurrentPrompt({
        ...currentPrompt,
        [name]: value,
      });
    }
  };

  const handleAddPrompt = () => {
    // Validate that we have both a type and count
    if (!currentPrompt.type || currentPrompt.count <= 0) {
      setErrors({
        ...errors,
        prompt: "Please select a prompt type and enter a valid count",
      });
      return;
    }

    // Check if prompt type already exists
    const existingPromptIndex = currentActivity.promptsUsed.findIndex(
      (p) => p.type === currentPrompt.type
    );

    if (existingPromptIndex >= 0) {
      // Update existing prompt count
      const updatedPrompts = [...currentActivity.promptsUsed];
      const existingPrompt = updatedPrompts[existingPromptIndex];

      if (existingPrompt) {
        updatedPrompts[existingPromptIndex] = {
          type: existingPrompt.type,
          count: existingPrompt.count + currentPrompt.count,
        };

        setCurrentActivity({
          ...currentActivity,
          promptsUsed: updatedPrompts,
        });
      }
    } else {
      // Add new prompt
      setCurrentActivity({
        ...currentActivity,
        promptsUsed: [
          ...currentActivity.promptsUsed,
          {
            type: currentPrompt.type,
            count: currentPrompt.count,
          },
        ],
      });
    }

    // Reset the current prompt
    setCurrentPrompt({
      type: "",
      count: 0,
    });

    // Clear any prompt-related errors
    const { prompt, ...restErrors } = errors;
    setErrors(restErrors);
  };

  const handleRemovePrompt = (index: number) => {
    setCurrentActivity({
      ...currentActivity,
      promptsUsed: currentActivity.promptsUsed.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(currentActivity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">
        {activity.id ? "Edit Activity" : "Add New Activity"}
      </h3>

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p>{apiError}</p>
          <button
            onClick={() => setApiError(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Activity Details Section */}
        <div className="mb-6 border-b pb-6">
          <h4 className="text-lg font-medium mb-4">Activity Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Name
              </label>
              <input
                type="text"
                name="name"
                value={currentActivity.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter activity name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="location"
                value={currentActivity.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select location</option>
                {activityLocationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal
            </label>
            <input
              type="text"
              name="goal"
              value={currentActivity.goal}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="What was the goal of this activity?"
            />
            {errors.goal && (
              <p className="text-red-500 text-sm mt-1">{errors.goal}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={currentActivity.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
              placeholder="Describe what the activity involved"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={currentActivity.duration || ""}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded"
              placeholder="Duration in minutes (optional)"
            />
          </div>
        </div>

        {/* Behaviors Section */}
        <div className="mb-6 border-b pb-6">
          <h4 className="text-lg font-medium mb-4">
            Behaviors During Activity
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Behavior
                </label>
                <div className="relative">
                  <select
                    name="behaviorSelect"
                    value={currentBehavior.behaviorId || ""}
                    onChange={handleBehaviorChange}
                    className="w-full p-2 border rounded"
                    disabled={loadingBehaviors}
                  >
                    <option value="">Select a behavior</option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Behavior Name
                </label>
                <input
                  type="text"
                  name="behaviorName"
                  value={currentBehavior.behaviorName}
                  onChange={handleBehaviorChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter behavior name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intensity
                </label>
                <select
                  name="intensity"
                  value={currentBehavior.intensity}
                  onChange={handleBehaviorChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select intensity</option>
                  {behaviorIntensityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interventions Used
                </label>
                <MultiSelect
                  options={interventionTypeOptions}
                  selectedValues={currentBehavior.interventionUsed}
                  onChange={handleInterventionChange}
                  placeholder="Select interventions"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervention Notes
              </label>
              <textarea
                name="interventionNotes"
                value={currentBehavior.interventionNotes || ""}
                onChange={handleBehaviorChange}
                rows={2}
                className="w-full p-2 border rounded"
                placeholder="Notes about interventions (optional)"
              ></textarea>
            </div>

            {errors.behavior && (
              <p className="text-red-500 text-sm mb-2">{errors.behavior}</p>
            )}

            <button
              type="button"
              onClick={handleAddBehavior}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add Behavior
            </button>
          </div>

          {/* List of added behaviors */}
          {currentActivity.behaviors.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Behavior
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intensity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interventions
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentActivity.behaviors.map((behavior, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {behavior.behaviorName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {behavior.intensity.charAt(0).toUpperCase() +
                          behavior.intensity.slice(1)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {behavior.interventionUsed
                          .map((intervention) => {
                            const option = interventionTypeOptions.find(
                              (opt) => opt.value === intervention
                            );
                            return option ? option.label : intervention;
                          })
                          .join(", ")}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
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
              No behaviors added yet.
            </div>
          )}
        </div>

        {/* Prompts Section */}
        <div className="mb-6 border-b pb-6">
          <h4 className="text-lg font-medium mb-4">Prompts Used</h4>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt Type
                </label>
                <select
                  name="type"
                  value={currentPrompt.type}
                  onChange={handlePromptChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select prompt type</option>
                  {promptTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Count
                </label>
                <input
                  type="number"
                  name="count"
                  value={currentPrompt.count}
                  onChange={handlePromptChange}
                  min="1"
                  className="w-full p-2 border rounded"
                  placeholder="Number of prompts"
                />
              </div>
            </div>

            {errors.prompt && (
              <p className="text-red-500 text-sm mt-2 mb-2">{errors.prompt}</p>
            )}

            <button
              type="button"
              onClick={handleAddPrompt}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add Prompt
            </button>
          </div>

          {/* List of added prompts */}
          {currentActivity.promptsUsed.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prompt Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentActivity.promptsUsed.map((prompt, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {promptTypeOptions.find(
                          (opt) => opt.value === prompt.type
                        )?.label || prompt.type}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {prompt.count}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemovePrompt(index)}
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
              No prompts added yet.
            </div>
          )}
        </div>

        {/* Completion Section */}
        <div className="mb-6 border-b pb-6">
          <h4 className="text-lg font-medium mb-4">Completion</h4>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={currentActivity.completed}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="completed"
              className="ml-2 block text-sm text-gray-700"
            >
              Activity Completed
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Completion Notes
            </label>
            <textarea
              name="completionNotes"
              value={currentActivity.completionNotes || ""}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border rounded"
              placeholder="Notes about activity completion (optional)"
            ></textarea>
          </div>
        </div>

        {/* Reinforcement Section */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">Reinforcement</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Reinforcer
              </label>
              <div className="relative">
                <select
                  name="reinforcerSelect"
                  value={currentActivity.reinforcement.reinforcerId || ""}
                  onChange={handleSelectReinforcer}
                  className="w-full p-2 border rounded"
                  disabled={loadingReinforcers}
                >
                  <option value="">Select a reinforcer</option>
                  {reinforcers.map((reinforcer) => (
                    <option key={reinforcer.id} value={reinforcer.id}>
                      {reinforcer.name}
                    </option>
                  ))}
                </select>
                {loadingReinforcers && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="small" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reinforcer Name
              </label>
              <input
                type="text"
                name="reinforcement.reinforcerName"
                value={currentActivity.reinforcement.reinforcerName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter reinforcer name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reinforcer Type
              </label>
              <input
                type="text"
                name="reinforcement.type"
                value={currentActivity.reinforcement.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter reinforcer type"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reinforcement Notes
            </label>
            <textarea
              name="reinforcement.notes"
              value={currentActivity.reinforcement.notes || ""}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border rounded"
              placeholder="Notes about reinforcement (optional)"
            ></textarea>
          </div>

          {errors.reinforcement && (
            <p className="text-red-500 text-sm mt-2">{errors.reinforcement}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            Save Activity
          </button>
        </div>
      </form>
    </div>
  );
}
