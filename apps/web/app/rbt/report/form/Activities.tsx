"use client";

import React, { useState } from "react";
import {
  ActivitiesFormData,
  ActivityWithRelations,
  NewActivity,
} from "@praxisnotes/types";
import ActivityForm from "./ActivityForm";
import {
  activityLocationOptions,
  promptTypeOptions,
} from "../../constants/formOptions";

type ActivitiesProps = {
  data: ActivitiesFormData;
  updateData: (data: ActivitiesFormData) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Activities({
  data,
  updateData,
  onNext,
  onBack,
}: ActivitiesProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [editingActivityIndex, setEditingActivityIndex] = useState<
    number | null
  >(null);

  // Empty activity template
  const emptyActivity: NewActivity = {
    name: "",
    description: "",
    goal: "",
    location: "",
    sessionId: "",
    completed: false,
    behaviors: [],
    promptsUsed: [],
    reinforcement: {
      activityId: "",
      reinforcementName: "",
      reinforcementType: "",
    },
    skills: [],
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (data.activities.length === 0) {
      newErrors.activities = "At least one activity must be added";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveActivity = (activity: NewActivity) => {
    if (editingActivityIndex !== null) {
      // Update existing activity
      const updatedActivities = [...data.activities];
      // Convert NewActivity to ActivityWithRelations
      const updatedActivity: ActivityWithRelations = {
        ...updatedActivities[editingActivityIndex],
        id: activity.id || updatedActivities[editingActivityIndex].id,
        name: activity.name,
        description: activity.description,
        goal: activity.goal,
        location: activity.location,
        duration: activity.duration || 0,
        sessionId: activity.sessionId,
        completed: activity.completed,
        completionNotes: activity.completionNotes,
        behaviors:
          activity.behaviors?.map((b) => ({
            ...b,
            id: b.id || `${Date.now()}-${Math.random()}`,
            activityId: updatedActivities[editingActivityIndex].id,
          })) || [],
        promptsUsed:
          activity.promptsUsed?.map((p) => ({
            ...p,
            id: p.id || `${Date.now()}-${Math.random()}`,
            activityId: updatedActivities[editingActivityIndex].id,
          })) || [],
        reinforcement: [
          activity.reinforcement
            ? {
                id:
                  activity.reinforcement.id || `${Date.now()}-${Math.random()}`,
                activityId: updatedActivities[editingActivityIndex].id,
                reinforcementName:
                  activity.reinforcement.reinforcementName || "",
                reinforcementType:
                  activity.reinforcement.reinforcementType || "",
                notes: activity.reinforcement.notes,
                reinforcementId: activity.reinforcement.reinforcementId,
              }
            : {
                id: `${Date.now()}-${Math.random()}`,
                activityId: updatedActivities[editingActivityIndex].id,
                reinforcementName: "",
                reinforcementType: "",
              },
        ],
        skills:
          activity.skills?.map((s) => ({
            ...s,
            id: s.id || `${Date.now()}-${Math.random()}`,
            activityId: updatedActivities[editingActivityIndex].id,
          })) || [],
      };

      updatedActivities[editingActivityIndex] = updatedActivity;

      updateData({
        ...data,
        activities: updatedActivities,
      });

      setEditingActivityIndex(null);
    } else {
      // Add new activity with generated ID
      const newId = `activity-${Date.now()}`;

      // Convert NewActivity to ActivityWithRelations
      const newActivityWithRelations: ActivityWithRelations = {
        id: activity.id || newId,
        name: activity.name,
        description: activity.description,
        goal: activity.goal,
        location: activity.location,
        duration: activity.duration || 0,
        sessionId: activity.sessionId,
        completed: activity.completed,
        completionNotes: activity.completionNotes,
        createdAt: new Date(),
        updatedAt: new Date(),
        behaviors:
          activity.behaviors?.map((b) => ({
            ...b,
            id: b.id || `${Date.now()}-${Math.random()}`,
            activityId: newId,
          })) || [],
        promptsUsed:
          activity.promptsUsed?.map((p) => ({
            ...p,
            id: p.id || `${Date.now()}-${Math.random()}`,
            activityId: newId,
          })) || [],
        reinforcement: [
          activity.reinforcement
            ? {
                id:
                  activity.reinforcement.id || `${Date.now()}-${Math.random()}`,
                activityId: newId,
                reinforcementName:
                  activity.reinforcement.reinforcementName || "",
                reinforcementType:
                  activity.reinforcement.reinforcementType || "",
                notes: activity.reinforcement.notes,
                reinforcementId: activity.reinforcement.reinforcementId,
              }
            : {
                id: `${Date.now()}-${Math.random()}`,
                activityId: newId,
                reinforcementName: "",
                reinforcementType: "",
              },
        ],
        skills:
          activity.skills?.map((s) => ({
            ...s,
            id: s.id || `${Date.now()}-${Math.random()}`,
            activityId: newId,
          })) || [],
      };

      updateData({
        ...data,
        activities: [...data.activities, newActivityWithRelations],
      });
    }

    setShowAddActivityForm(false);
  };

  const handleEditActivity = (index: number) => {
    setEditingActivityIndex(index);
    setShowAddActivityForm(true);
  };

  const handleRemoveActivity = (index: number) => {
    updateData({
      ...data,
      activities: data.activities.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNext();
    }
  };

  // Helper function to get label from value
  const getLabelFromValue = (
    value: string,
    options: { value: string; label: string }[],
  ) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // Get activity based on editing index, with null check
  const getActivityToEdit = (): NewActivity => {
    if (
      editingActivityIndex !== null &&
      data.activities[editingActivityIndex]
    ) {
      const currentActivity = data.activities[editingActivityIndex];

      // Convert ActivityWithRelations to NewActivity for editing
      return {
        id: currentActivity.id,
        name: currentActivity.name,
        description: currentActivity.description,
        goal: currentActivity.goal,
        location: currentActivity.location,
        duration: currentActivity.duration,
        sessionId: currentActivity.sessionId,
        completed: currentActivity.completed,
        completionNotes: currentActivity.completionNotes,
        behaviors: currentActivity.behaviors,
        promptsUsed: currentActivity.promptsUsed,
        reinforcement:
          currentActivity.reinforcement &&
          currentActivity.reinforcement.length > 0
            ? currentActivity.reinforcement[0]
            : undefined,
        skills: currentActivity.skills,
      };
    }
    return emptyActivity;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Session Activities
      </h2>

      {errors.activities && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p>{errors.activities}</p>
        </div>
      )}

      {showAddActivityForm ? (
        <ActivityForm
          activity={getActivityToEdit()}
          onSave={handleSaveActivity}
          onCancel={() => {
            setShowAddActivityForm(false);
            setEditingActivityIndex(null);
          }}
        />
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setShowAddActivityForm(true)}
            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add Activity
          </button>

          {data.activities.length > 0 ? (
            <div className="space-y-6">
              {data.activities.map((activity, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">{activity.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditActivity(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Goal:</p>
                      <p className="text-gray-900">{activity.goal}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Location:
                      </p>
                      <p className="text-gray-900">
                        {getLabelFromValue(
                          activity.location,
                          activityLocationOptions,
                        )}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">
                        Description:
                      </p>
                      <p className="text-gray-900">{activity.description}</p>
                    </div>

                    {activity.behaviors && activity.behaviors.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Behaviors:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {activity.behaviors.map((behavior, bIndex) => (
                            <li key={bIndex}>
                              {behavior.behaviorName} (Intensity:{" "}
                              {behavior.intensity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activity.promptsUsed &&
                      activity.promptsUsed.length > 0 && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Prompts Used:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            {activity.promptsUsed.map((prompt, pIndex) => (
                              <li key={pIndex}>
                                {getLabelFromValue(
                                  prompt.type,
                                  promptTypeOptions,
                                )}
                                : {prompt.count} times
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">
                        Reinforcement:
                      </p>
                      <p className="text-gray-900">
                        {activity.reinforcement &&
                          activity.reinforcement.length > 0 && (
                            <>
                              {activity.reinforcement[0].reinforcementName}
                              {activity.reinforcement[0].reinforcementType && (
                                <>
                                  {" "}
                                  ({activity.reinforcement[0].reinforcementType}
                                  )
                                </>
                              )}
                            </>
                          )}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700">
                        Status:{" "}
                        {activity.completed ? "Completed" : "Not completed"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 text-center rounded-lg text-gray-500">
              <p className="mb-4">No activities added yet.</p>
              <p>Click the "Add Activity" button to add your first activity.</p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
