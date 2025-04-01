"use client";

import React, { useState, useEffect } from "react";
import {
  SkillAcquisitionFormData,
  Skill,
} from "@praxisnotes/types/src/SessionForm";
import { promptLevelOptions } from "../../constants/formOptions";
import {
  SkillProgramOption,
  SkillTargetOption,
} from "../../../../lib/mocks/skillsData";
import {
  fetchSkillPrograms,
  fetchTargetsByProgramId,
} from "../../../../lib/api/skillsApi";
import LoadingSpinner from "../../../../components/ui/LoadingSpinner";

type SkillAcquisitionProps = {
  data: SkillAcquisitionFormData;
  updateData: (data: SkillAcquisitionFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

// Extend the Skill type for the form
type SkillFormData = Skill & {
  programId?: string;
  targetId?: string;
};

export default function SkillAcquisition({
  data,
  updateData,
  onNext,
  onBack,
}: SkillAcquisitionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSkill, setCurrentSkill] = useState<SkillFormData>({
    name: "",
    target: "",
    program: "",
    trials: 0,
    mastery: 0,
    promptLevel: "",
    notes: "",
    correct: 0,
    prompted: 0,
    incorrect: 0,
  });
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);

  // State for predefined options
  const [programs, setPrograms] = useState<SkillProgramOption[]>([]);
  const [targetSkills, setTargetSkills] = useState<SkillTargetOption[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingTargets, setLoadingTargets] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch skill programs on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoadingPrograms(true);
      setApiError(null);
      try {
        const programsData = await fetchSkillPrograms();
        setPrograms(programsData);
      } catch (error) {
        console.error("Error fetching programs:", error);
        setApiError("Failed to load programs. Please try again.");
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, []);

  // Fetch target skills when program changes
  useEffect(() => {
    const fetchTargetSkills = async () => {
      if (!selectedProgram) {
        setTargetSkills([]);
        return;
      }

      setLoadingTargets(true);
      setApiError(null);
      try {
        const targetsData = await fetchTargetsByProgramId(selectedProgram);
        setTargetSkills(targetsData);
      } catch (error) {
        console.error("Error fetching target skills:", error);
        setApiError("Failed to load target skills. Please try again.");
      } finally {
        setLoadingTargets(false);
      }
    };

    fetchTargetSkills();
  }, [selectedProgram]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (data.skills.length === 0) {
      newErrors.skills = "At least one skill must be added";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSkillForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentSkill.program) {
      newErrors.program = "Program is required";
    }
    if (!currentSkill.target) {
      newErrors.target = "Target is required";
    }
    if (currentSkill.trials <= 0) {
      newErrors.trials = "Number of trials must be greater than 0";
    }
    if (
      (currentSkill.correct || 0) +
        (currentSkill.prompted || 0) +
        (currentSkill.incorrect || 0) !==
      currentSkill.trials
    ) {
      newErrors.trials =
        "The sum of correct, prompted, and incorrect must equal total trials";
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

    if (name === "program") {
      // When program changes, update the selectedProgram state to trigger target skills loading
      setSelectedProgram(value);

      // Find the program object
      const selectedProgramObj = programs.find((prog) => prog.id === value);

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
      const selectedTargetObj = targetSkills.find(
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

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateSkillForm()) {
      // If name is not provided, use program as name
      const skillToAdd = {
        ...currentSkill,
        name: currentSkill.name || currentSkill.program,
        target: currentSkill.target || currentSkill.program,
        programName: currentSkill.program, // Set programName from program for compatibility
      };

      updateData({
        ...data,
        skills: [...data.skills, skillToAdd],
      });

      // Reset form
      setCurrentSkill({
        name: "",
        target: "",
        program: "",
        trials: 0,
        mastery: 0,
        promptLevel: "",
        notes: "",
        correct: 0,
        prompted: 0,
        incorrect: 0,
        programId: "",
        targetId: "",
      });
      setSelectedProgram("");
      setShowAddSkillForm(false);
      setErrors({});
    }
  };

  const handleRemoveSkill = (index: number) => {
    updateData({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
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
        Skill Acquisition Data
      </h2>

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p>{apiError}</p>
          <button
            onClick={() => {
              setApiError(null);
              // Retry loading programs
              if (loadingPrograms) {
                const fetchPrograms = async () => {
                  setLoadingPrograms(true);
                  try {
                    const programsData = await fetchSkillPrograms();
                    setPrograms(programsData);
                  } catch (error) {
                    console.error("Error fetching programs:", error);
                    setApiError("Failed to load programs. Please try again.");
                  } finally {
                    setLoadingPrograms(false);
                  }
                };
                fetchPrograms();
              }
              // Retry loading targets if a program is selected
              if (loadingTargets && selectedProgram) {
                const fetchTargetSkills = async () => {
                  setLoadingTargets(true);
                  try {
                    const targetsData =
                      await fetchTargetsByProgramId(selectedProgram);
                    setTargetSkills(targetsData);
                  } catch (error) {
                    console.error("Error fetching target skills:", error);
                    setApiError(
                      "Failed to load target skills. Please try again.",
                    );
                  } finally {
                    setLoadingTargets(false);
                  }
                };
                fetchTargetSkills();
              }
            }}
            className="mt-2 text-sm underline"
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
            {!showAddSkillForm && (
              <button
                type="button"
                onClick={() => setShowAddSkillForm(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
              >
                Add Skill
              </button>
            )}
          </div>

          {errors.skills && (
            <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
          )}

          {showAddSkillForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-md font-medium mb-3 text-gray-700">
                Add New Skill
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                  </label>
                  <div className="relative">
                    <select
                      name="program"
                      value={selectedProgram}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      disabled={loadingPrograms}
                    >
                      <option value="">Select a program</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                    {loadingPrograms && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <LoadingSpinner size="small" />
                      </div>
                    )}
                  </div>
                  {errors.program && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.program}
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
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      disabled={loadingTargets || !selectedProgram}
                    >
                      <option value="">Select a target skill</option>
                      {targetSkills.map((target) => (
                        <option key={target.id} value={target.id}>
                          {target.name}
                        </option>
                      ))}
                    </select>
                    {loadingTargets && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <LoadingSpinner size="small" />
                      </div>
                    )}
                  </div>
                  {errors.target && (
                    <p className="text-red-500 text-sm mt-1">{errors.target}</p>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border rounded"
                />
                {errors.trials && (
                  <p className="text-red-500 text-sm mt-1">{errors.trials}</p>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 border rounded"
                  placeholder="Additional notes about the skill acquisition"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSkillForm(false);
                    setErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                  Add Skill
                </button>
              </div>
            </div>
          )}

          {/* List of added skills */}
          {data.skills.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Program
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Target
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trials
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mastery
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
                  {data.skills.map((skill, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {skill.program}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {skill.target}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {skill.trials}
                        <span className="text-xs text-gray-500 ml-1">
                          ({skill.correct}/{skill.prompted}/{skill.incorrect})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {skill.mastery}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
              No skills added yet. Click the "Add Skill" button to add.
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
