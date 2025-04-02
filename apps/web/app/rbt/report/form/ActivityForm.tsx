"use client";

import React, { useState, useEffect } from "react";
import {
  ActivityReinforcement,
  NewActivitySkill,
  NewActivityBehavior,
  NewActivityPrompt,
  NewActivity,
  ActivityReinforcementForm,
} from "@praxisnotes/types";
import {
  activityLocationOptions,
  promptTypeOptions,
  interventionTypeOptions,
  behaviorIntensityOptions,
  promptLevelOptions,
} from "../../constants/formOptions";
import { fetchAllBehaviors } from "../../../../lib/api/behaviorsApi";
import { fetchAllReinforcers } from "../../../../lib/api/reinforcersApi";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";
import MultiSelect from "../../../../components/ui/MultiSelect";
import {
  fetchSkillPrograms,
  fetchTargetsByProgramId,
} from "../../../../lib/api/skillsApi";

// Define missing types
type BehaviorOption = {
  id: string;
  name: string;
  definition?: string;
};

type SkillProgramOption = {
  id: string;
  name: string;
};

type SkillTargetOption = {
  id: string;
  name: string;
  programId: string;
};

type ReinforcementOption = {
  id: string;
  name: string;
  type?: string;
  description?: string;
};

type ActivityFormProps = {
  activity: NewActivity;
  onSave: (activity: NewActivity) => void;
  onCancel: () => void;
};

// Define the skill form data type
type SkillFormData = {
  id: string;
  name: string;
  program: string;
  target: string;
  trials: number;
  mastery: number;
  promptLevel: string;
  correct: number;
  prompted: number;
  incorrect: number;
  notes: string;
  programId: string;
  targetId: string;
};

export default function ActivityForm({
  activity,
  onSave,
  onCancel,
}: ActivityFormProps) {
  // Initialize with default values for all optional properties
  const [currentActivity, setCurrentActivity] = useState<NewActivity>({
    ...activity,
    behaviors: activity.behaviors || [],
    promptsUsed: activity.promptsUsed || [],
    reinforcement: activity.reinforcement || {
      activityId: activity.id || "",
      reinforcerName: "",
      type: "",
    },
    skills: activity.skills || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for behavior options
  const [behaviors, setBehaviors] = useState<BehaviorOption[]>([]);
  const [loadingBehaviors, setLoadingBehaviors] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // State for reinforcer options
  const [reinforcers, setReinforcers] = useState<ReinforcementOption[]>([]);
  const [loadingReinforcers, setLoadingReinforcers] = useState(false);

  // State for current behavior being added
  const [currentBehavior, setCurrentBehavior] = useState<NewActivityBehavior>({
    id: "",
    activityId: "",
    behaviorName: "",
    intensity: "",
    interventionUsed: [],
  });

  // State for current prompt being added
  const [currentPrompt, setCurrentPrompt] = useState<NewActivityPrompt>({
    id: "",
    activityId: "",
    type: "",
    count: 0,
  });

  // State for skill options
  const [skillPrograms, setSkillPrograms] = useState<SkillProgramOption[]>([]);
  const [skillTargets, setSkillTargets] = useState<SkillTargetOption[]>([]);
  const [loadingSkillPrograms, setLoadingSkillPrograms] = useState(false);
  const [loadingSkillTargets, setLoadingSkillTargets] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  // State for current skill being added
  const [currentSkill, setCurrentSkill] = useState<SkillFormData>({
    id: "",
    name: "",
    program: "",
    target: "",
    trials: 0,
    mastery: 0,
    promptLevel: "",
    correct: 0,
    prompted: 0,
    incorrect: 0,
    notes: "",
    programId: "",
    targetId: "",
  });

  // Fetch behaviors and reinforcers on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingBehaviors(true);
      setLoadingReinforcers(true);
      setLoadingSkillPrograms(true);
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
            : "Failed to load reinforcers. Please try again.",
        );
      } finally {
        setLoadingReinforcers(false);
      }

      try {
        const programsData = await fetchSkillPrograms();
        setSkillPrograms(programsData);
      } catch (error) {
        console.error("Error fetching skill programs:", error);
        setApiError((prev) =>
          prev
            ? `${prev} Also failed to load skill programs.`
            : "Failed to load skill programs. Please try again.",
        );
      } finally {
        setLoadingSkillPrograms(false);
      }
    };

    fetchOptions();
  }, []);

  // Fetch target skills when program changes
  useEffect(() => {
    const fetchTargetSkills = async () => {
      if (!selectedProgram) {
        setSkillTargets([]);
        return;
      }

      setLoadingSkillTargets(true);
      setApiError(null);
      try {
        const targetsData = await fetchTargetsByProgramId(selectedProgram);
        setSkillTargets(targetsData);
      } catch (error) {
        console.error("Error fetching target skills:", error);
        setApiError((prev) =>
          prev
            ? `${prev} Also failed to load target skills.`
            : "Failed to load target skills. Please try again.",
        );
      } finally {
        setLoadingSkillTargets(false);
      }
    };

    fetchTargetSkills();
  }, [selectedProgram]);

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

    if (!currentActivity.reinforcement?.id) {
      newErrors.reinforcement = "Reinforcement is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // For basic activity properties
    if (
      ["name", "description", "goal", "location", "type", "notes"].includes(
        name,
      )
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
        duration: value ? parseInt(value) : 0,
      });
    } else if (name === "completionNotes") {
      setCurrentActivity({
        ...currentActivity,
        completionNotes: value,
      });
    }
    // For reinforcement fields
    else if (name.startsWith("reinforcement.")) {
      const reinforcementField = name.split(".")[1];
      setCurrentActivity({
        ...currentActivity,
        reinforcement: {
          ...currentActivity.reinforcement,
          [reinforcementField]: value,
          activityId: currentActivity.id || "",
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
            reinforcementId: selectedReinforcer.id,
            activityId: currentActivity.id || "",
          },
        });
      }
    }
  };

  // Handle behavior fields
  const handleBehaviorChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "behaviorSelect") {
      const selectedBehavior = behaviors.find((b) => b.id === value);
      if (selectedBehavior) {
        setCurrentBehavior({
          ...currentBehavior,
          behaviorId: selectedBehavior.id,
          behaviorName: selectedBehavior.name,
        });
      } else {
        setCurrentBehavior({
          ...currentBehavior,
          behaviorId: "",
          behaviorName: "",
        });
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
      behaviors: [...(currentActivity.behaviors || []), currentBehavior],
    });

    // Reset the current behavior
    setCurrentBehavior({
      activityId: currentActivity.id || "",
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
      behaviors: currentActivity.behaviors?.filter((_, i) => i !== index) || [],
    });
  };

  // Handle prompt fields
  const handlePromptChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    const existingPromptIndex = currentActivity.promptsUsed?.findIndex(
      (p) => p.type === currentPrompt.type,
    );

    if (existingPromptIndex && existingPromptIndex >= 0) {
      // Update existing prompt count
      const updatedPrompts = [...(currentActivity.promptsUsed || [])];
      const existingPrompt = updatedPrompts[existingPromptIndex];

      if (existingPrompt) {
        updatedPrompts[existingPromptIndex] = {
          ...existingPrompt,
          count: existingPrompt.count + currentPrompt.count,
          activityId: currentActivity.id || "",
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
          ...(currentActivity.promptsUsed || []),
          {
            id: "",
            activityId: currentActivity.id || "",
            type: currentPrompt.type,
            count: currentPrompt.count,
          },
        ],
      });
    }

    // Reset the current prompt
    setCurrentPrompt({
      id: "",
      activityId: currentActivity.id || "",
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
      promptsUsed:
        currentActivity.promptsUsed?.filter((_, i) => i !== index) || [],
    });
  };

  // Handle skill fields
  const handleSkillChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "program") {
      // When program changes, update the selectedProgram state to trigger target skills loading
      setSelectedProgram(value);

      // Find the program object
      const selectedProgramObj = skillPrograms.find(
        (prog) => prog.id === value,
      );

      // Update the current skill with the program name
      setCurrentSkill({
        ...currentSkill,
        program: selectedProgramObj ? selectedProgramObj.name : value,
        programId: value, // Store the program ID for reference
        target: "", // Reset target when program changes
        targetId: "", // Reset targetId when program changes
      });
    } else if (name === "target") {
      // Find the target object
      const selectedTargetObj = skillTargets.find(
        (target) => target.id === value,
      );

      setCurrentSkill({
        ...currentSkill,
        target: selectedTargetObj ? selectedTargetObj.name : value,
        targetId: value, // Store the target ID for reference
      });
    } else if (
      ["trials", "mastery", "correct", "prompted", "incorrect"].includes(name)
    ) {
      setCurrentSkill({
        ...currentSkill,
        [name]: parseInt(value) || 0,
      });
    } else {
      setCurrentSkill({ ...currentSkill, [name]: value });
    }
  };

  const validateSkillForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentSkill.program) {
      newErrors.skillProgram = "Program is required";
    }
    if (!currentSkill.target) {
      newErrors.skillTarget = "Target is required";
    }
    if (currentSkill.trials <= 0) {
      newErrors.skillTrials = "Number of trials must be greater than 0";
    }
    if (
      (currentSkill.correct || 0) +
        (currentSkill.prompted || 0) +
        (currentSkill.incorrect || 0) !==
      currentSkill.trials
    ) {
      newErrors.skillTrials =
        "The sum of correct, prompted, and incorrect must equal total trials";
    }

    return newErrors;
  };

  const handleAddSkill = () => {
    const skillErrors = validateSkillForm();

    if (Object.keys(skillErrors).length > 0) {
      setErrors({ ...errors, ...skillErrors });
      return;
    }

    // If name is not provided, use target as name
    const skillToAdd: NewActivitySkill = {
      activityId: currentActivity.id || "",
      skillId: currentSkill.targetId || `skill-${Date.now()}`,
      trials: currentSkill.trials,
      mastery: currentSkill.mastery,
      promptLevel: currentSkill.promptLevel,
      correct: currentSkill.correct,
      prompted: currentSkill.prompted,
      incorrect: currentSkill.incorrect,
      notes: currentSkill.notes,
    };

    setCurrentActivity({
      ...currentActivity,
      skills: [...(currentActivity.skills || []), skillToAdd],
    });

    // Reset form
    setCurrentSkill({
      id: "",
      name: "",
      program: "",
      target: "",
      trials: 0,
      mastery: 0,
      promptLevel: "",
      correct: 0,
      prompted: 0,
      incorrect: 0,
      notes: "",
      programId: "",
      targetId: "",
    });
    setSelectedProgram("");

    // Clear any skill-related errors
    const newErrors = { ...errors };
    delete newErrors.skillProgram;
    delete newErrors.skillTarget;
    delete newErrors.skillTrials;
    setErrors(newErrors);
  };

  const handleRemoveSkill = (index: number) => {
    setCurrentActivity({
      ...currentActivity,
      skills: (currentActivity.skills || []).filter(
        (_, i: number) => i !== index,
      ),
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

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
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
                    {!loadingBehaviors && behaviors && behaviors.length > 0 ? (
                      behaviors.map((behavior) => (
                        <option key={behavior.id} value={behavior.id}>
                          {behavior.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        {loadingBehaviors
                          ? "Loading behaviors..."
                          : "No behaviors available"}
                      </option>
                    )}
                  </select>
                  {loadingBehaviors && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                  {apiError && (
                    <p className="text-red-500 text-sm mt-1">{apiError}</p>
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
          {currentActivity.behaviors && currentActivity.behaviors.length > 0 ? (
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
                              (opt) => opt.value === intervention,
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
          {currentActivity &&
          currentActivity.promptsUsed &&
          currentActivity.promptsUsed.length > 0 ? (
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
                          (opt) => opt.value === prompt.type,
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

        {/* Skills Section */}
        <div className="mb-6 border-b pb-6">
          <h4 className="text-lg font-medium mb-4">Skills</h4>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program
                </label>
                <div className="relative">
                  <select
                    name="program"
                    value={selectedProgram}
                    onChange={handleSkillChange}
                    className="w-full p-2 border rounded"
                    disabled={loadingSkillPrograms}
                  >
                    <option value="">Select a program</option>
                    {skillPrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                  {loadingSkillPrograms && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                </div>
                {errors.skillProgram && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.skillProgram}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Skill
                </label>
                <div className="relative">
                  <select
                    name="target"
                    value={currentSkill.targetId || ""}
                    onChange={handleSkillChange}
                    className="w-full p-2 border rounded"
                    disabled={loadingSkillTargets || !selectedProgram}
                  >
                    <option value="">Select a target skill</option>
                    {skillTargets.map((target) => (
                      <option key={target.id} value={target.id}>
                        {target.name}
                      </option>
                    ))}
                  </select>
                  {loadingSkillTargets && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                </div>
                {errors.skillTarget && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.skillTarget}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name (optional)
              </label>
              <input
                type="text"
                name="name"
                value={currentSkill.name}
                onChange={handleSkillChange}
                className="w-full p-2 border rounded"
                placeholder="Optional custom name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Trials
              </label>
              <input
                type="number"
                name="trials"
                value={currentSkill.trials}
                onChange={handleSkillChange}
                min="0"
                className="w-full p-2 border rounded"
              />
              {errors.skillTrials && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.skillTrials}
                </p>
              )}
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Trial Breakdown
              </h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Correct
                  </label>
                  <input
                    type="number"
                    name="correct"
                    value={currentSkill.correct}
                    onChange={handleSkillChange}
                    min="0"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Prompted
                  </label>
                  <input
                    type="number"
                    name="prompted"
                    value={currentSkill.prompted}
                    onChange={handleSkillChange}
                    min="0"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Incorrect
                  </label>
                  <input
                    type="number"
                    name="incorrect"
                    value={currentSkill.incorrect}
                    onChange={handleSkillChange}
                    min="0"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mastery Percentage
                </label>
                <input
                  type="number"
                  name="mastery"
                  value={currentSkill.mastery}
                  onChange={handleSkillChange}
                  min="0"
                  max="100"
                  className="w-full p-2 border rounded"
                  placeholder="Mastery percentage (0-100)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt Level
                </label>
                <select
                  name="promptLevel"
                  value={currentSkill.promptLevel}
                  onChange={handleSkillChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select prompt level</option>
                  {promptLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={currentSkill.notes}
                onChange={handleSkillChange}
                rows={2}
                className="w-full p-2 border rounded"
                placeholder="Additional notes about the skill acquisition"
              ></textarea>
            </div>

            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add Skill
            </button>
          </div>

          {/* List of added skills */}
          {currentActivity.skills && currentActivity.skills.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trials
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mastery
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentActivity.skills.map((skill, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {skill.skillId}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {skill.trials}
                        <span className="text-xs text-gray-500 ml-1">
                          ({skill.correct}/{skill.prompted}/{skill.incorrect})
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {skill.mastery}%
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
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
              No skills added yet.
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
                  value={currentActivity.reinforcement?.reinforcementId || ""}
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
                name="reinforcement.reinforcementName"
                value={currentActivity.reinforcement?.reinforcementName || ""}
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
                name="reinforcement.reinforcementType"
                value={currentActivity.reinforcement?.reinforcementType || ""}
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
              value={currentActivity.reinforcement?.notes || ""}
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
