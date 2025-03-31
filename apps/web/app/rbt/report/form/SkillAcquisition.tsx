"use client";

import React, { useState } from "react";
import {
  SkillAcquisitionFormData,
  Skill,
} from "../../../../lib/types/SessionForm";
import { promptLevelOptions } from "../../constants/formOptions";

type SkillAcquisitionProps = {
  data: SkillAcquisitionFormData;
  updateData: (data: SkillAcquisitionFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function SkillAcquisition({
  data,
  updateData,
  onNext,
  onBack,
}: SkillAcquisitionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSkill, setCurrentSkill] = useState<Skill>({
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
    >
  ) => {
    const { name, value } = e.target;

    if (
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
      });
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
                  <input
                    type="text"
                    name="program"
                    value={currentSkill.program}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Name of program"
                  />
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
                  <input
                    type="text"
                    name="target"
                    value={currentSkill.target}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="Specific target"
                  />
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mastery (%)
                </label>
                <input
                  type="number"
                  name="mastery"
                  value={currentSkill.mastery}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={currentSkill.notes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Additional notes about the skill"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSkillForm(false);
                    setErrors({});
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {data.skills.length > 0 ? (
            <div className="space-y-3">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium">
                      {skill.name || skill.programName || skill.program}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Target: {skill.target}
                    </p>
                    <p className="text-sm text-gray-600">
                      Trials: {skill.trials} (Correct: {skill.correct},
                      Prompted: {skill.prompted}, Incorrect: {skill.incorrect})
                    </p>
                    {skill.promptLevel && (
                      <p className="text-sm text-gray-600">
                        Prompt level: {skill.promptLevel}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-lg">
              <p className="text-gray-500">No skills added yet</p>
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
