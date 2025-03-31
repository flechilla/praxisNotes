"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SessionFormData,
  FormStep,
  ActivityBasedSessionFormData,
  ActivityBasedFormStep,
} from "../../../lib/types/SessionForm";
import BasicInfo from "./form/BasicInfo";
import SkillAcquisition from "./form/SkillAcquisition";
import BehaviorTracking from "./form/BehaviorTracking";
import Reinforcement from "./form/Reinforcement";
import GeneralNotes from "./form/GeneralNotes";
import ReportGeneration from "./form/ReportGeneration";
import InitialStatus from "./form/InitialStatus";
import Activities from "./form/Activities";
import { mockClients } from "../../../lib/mocks/clientData";
import { generateReport } from "../../../lib/utils/reportGeneration";
import Link from "next/link";

// Feature flag for using the new activity-based flow
const USE_ACTIVITY_BASED_FLOW = true;

export default function SessionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Ensure clientIdParam is always a string, never undefined
  const clientIdParam = (searchParams?.get("clientId") || "") as string;

  // State for tracking form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state with default values for legacy flow
  const [formData, setFormData] = useState<SessionFormData>({
    basicInfo: {
      clientId: clientIdParam as string,
      sessionDate: String(new Date().toISOString().split("T")[0]),
      startTime: "",
      endTime: "",
      location: "",
    },
    skillAcquisition: {
      skills: [],
    },
    behaviorTracking: {
      behaviors: [],
    },
    reinforcement: {
      reinforcers: [],
    },
    generalNotes: {
      sessionNotes: "",
      caregiverFeedback: "",
      environmentalFactors: "",
      nextSessionFocus: "",
    },
  });

  // Initialize form state for activity-based tracking
  const [activityBasedFormData, setActivityBasedFormData] =
    useState<ActivityBasedSessionFormData>({
      basicInfo: {
        clientId: clientIdParam as string,
        sessionDate: String(new Date().toISOString().split("T")[0]),
        startTime: "",
        endTime: "",
        location: "",
      },
      initialStatus: {
        clientStatus: "",
        caregiverReport: "",
        initialResponse: "",
        medicationChanges: "",
      },
      activities: {
        activities: [],
      },
      generalNotes: {
        sessionNotes: "",
        caregiverFeedback: "",
        environmentalFactors: "",
        nextSessionFocus: "",
      },
    });

  // Manage the current step of the form based on which flow is active
  const [currentLegacyStep, setCurrentLegacyStep] =
    useState<FormStep>("basicInfo");
  const [currentActivityStep, setCurrentActivityStep] =
    useState<ActivityBasedFormStep>("basicInfo");

  // Get current step based on active flow
  const currentStep = USE_ACTIVITY_BASED_FLOW
    ? currentActivityStep
    : currentLegacyStep;

  // Handle moving to the next step for the legacy flow
  const handleLegacyNext = () => {
    switch (currentLegacyStep) {
      case "basicInfo":
        setCurrentLegacyStep("skillAcquisition");
        break;
      case "skillAcquisition":
        setCurrentLegacyStep("behaviorTracking");
        break;
      case "behaviorTracking":
        setCurrentLegacyStep("reinforcement");
        break;
      case "reinforcement":
        setCurrentLegacyStep("generalNotes");
        break;
      case "generalNotes":
        setCurrentLegacyStep("reportGeneration" as FormStep);
        break;
    }

    // Scroll to top after step change
    window.scrollTo(0, 0);
  };

  // Handle moving to the next step for the activity-based flow
  const handleActivityNext = () => {
    switch (currentActivityStep) {
      case "basicInfo":
        setCurrentActivityStep("initialStatus");
        break;
      case "initialStatus":
        setCurrentActivityStep("activities");
        break;
      case "activities":
        setCurrentActivityStep("generalNotes");
        break;
      case "generalNotes":
        setCurrentActivityStep("reportGeneration" as ActivityBasedFormStep);
        break;
    }

    // Scroll to top after step change
    window.scrollTo(0, 0);
  };

  // Get the appropriate "next" handler
  const handleNext = USE_ACTIVITY_BASED_FLOW
    ? handleActivityNext
    : handleLegacyNext;

  // Handle moving to the previous step for the legacy flow
  const handleLegacyBack = () => {
    switch (currentLegacyStep) {
      case "skillAcquisition":
        setCurrentLegacyStep("basicInfo");
        break;
      case "behaviorTracking":
        setCurrentLegacyStep("skillAcquisition");
        break;
      case "reinforcement":
        setCurrentLegacyStep("behaviorTracking");
        break;
      case "generalNotes":
        setCurrentLegacyStep("reinforcement");
        break;
      case "reportGeneration":
        setCurrentLegacyStep("generalNotes");
        break;
    }

    // Scroll to top after step change
    window.scrollTo(0, 0);
  };

  // Handle moving to the previous step for the activity-based flow
  const handleActivityBack = () => {
    switch (currentActivityStep) {
      case "initialStatus":
        setCurrentActivityStep("basicInfo");
        break;
      case "activities":
        setCurrentActivityStep("initialStatus");
        break;
      case "generalNotes":
        setCurrentActivityStep("activities");
        break;
      case "reportGeneration":
        setCurrentActivityStep("generalNotes");
        break;
    }

    // Scroll to top after step change
    window.scrollTo(0, 0);
  };

  // Get the appropriate "back" handler
  const handleBack = USE_ACTIVITY_BASED_FLOW
    ? handleActivityBack
    : handleLegacyBack;

  // Reset the form and start over
  const handleReset = () => {
    if (USE_ACTIVITY_BASED_FLOW) {
      setActivityBasedFormData({
        basicInfo: {
          clientId: clientIdParam as string,
          sessionDate: String(new Date().toISOString().split("T")[0]),
          startTime: "",
          endTime: "",
          location: "",
        },
        initialStatus: {
          clientStatus: "",
          caregiverReport: "",
          initialResponse: "",
          medicationChanges: "",
        },
        activities: {
          activities: [],
        },
        generalNotes: {
          sessionNotes: "",
          caregiverFeedback: "",
          environmentalFactors: "",
          nextSessionFocus: "",
        },
      });
      setCurrentActivityStep("basicInfo");
    } else {
      setFormData({
        basicInfo: {
          clientId: clientIdParam as string,
          sessionDate: String(new Date().toISOString().split("T")[0]),
          startTime: "",
          endTime: "",
          location: "",
        },
        skillAcquisition: {
          skills: [],
        },
        behaviorTracking: {
          behaviors: [],
        },
        reinforcement: {
          reinforcers: [],
        },
        generalNotes: {
          sessionNotes: "",
          caregiverFeedback: "",
          environmentalFactors: "",
          nextSessionFocus: "",
        },
      });
      setCurrentLegacyStep("basicInfo");
    }

    window.scrollTo(0, 0);
  };

  // Update specific sections of the form data - Legacy Flow
  const updateBasicInfo = (data: typeof formData.basicInfo) => {
    if (USE_ACTIVITY_BASED_FLOW) {
      setActivityBasedFormData((prev) => ({ ...prev, basicInfo: data }));
    } else {
      setFormData((prev) => ({ ...prev, basicInfo: data }));
    }
  };

  const updateSkillAcquisition = (data: typeof formData.skillAcquisition) => {
    setFormData((prev) => ({ ...prev, skillAcquisition: data }));
  };

  const updateBehaviorTracking = (data: typeof formData.behaviorTracking) => {
    setFormData((prev) => ({ ...prev, behaviorTracking: data }));
  };

  const updateReinforcement = (data: typeof formData.reinforcement) => {
    setFormData((prev) => ({ ...prev, reinforcement: data }));
  };

  const updateGeneralNotes = (data: typeof formData.generalNotes) => {
    if (USE_ACTIVITY_BASED_FLOW) {
      setActivityBasedFormData((prev) => ({ ...prev, generalNotes: data }));
    } else {
      setFormData((prev) => ({ ...prev, generalNotes: data }));
    }
  };

  // Update specific sections of the form data - Activity-Based Flow
  const updateInitialStatus = (
    data: typeof activityBasedFormData.initialStatus
  ) => {
    setActivityBasedFormData((prev) => ({ ...prev, initialStatus: data }));
  };

  const updateActivities = (data: typeof activityBasedFormData.activities) => {
    setActivityBasedFormData((prev) => ({ ...prev, activities: data }));
  };

  // Render the current step based on the active flow
  const renderLegacyStep = () => {
    switch (currentLegacyStep) {
      case "basicInfo":
        return (
          <BasicInfo
            data={formData.basicInfo}
            updateData={updateBasicInfo}
            onNext={handleNext}
          />
        );
      case "skillAcquisition":
        return (
          <SkillAcquisition
            data={formData.skillAcquisition}
            updateData={updateSkillAcquisition}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "behaviorTracking":
        return (
          <BehaviorTracking
            data={formData.behaviorTracking}
            updateData={updateBehaviorTracking}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "reinforcement":
        return (
          <Reinforcement
            data={formData.reinforcement}
            updateData={updateReinforcement}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "generalNotes":
        return (
          <GeneralNotes
            data={formData.generalNotes}
            updateData={updateGeneralNotes}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "reportGeneration":
        return (
          <ReportGeneration
            formData={formData}
            onBack={handleBack}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  // Render the current step for activity-based flow
  const renderActivityStep = () => {
    switch (currentActivityStep) {
      case "basicInfo":
        return (
          <BasicInfo
            data={activityBasedFormData.basicInfo}
            updateData={updateBasicInfo}
            onNext={handleNext}
          />
        );
      case "initialStatus":
        return (
          <InitialStatus
            data={activityBasedFormData.initialStatus}
            updateData={updateInitialStatus}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "activities":
        return (
          <Activities
            data={activityBasedFormData.activities}
            updateData={updateActivities}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "generalNotes":
        return (
          <GeneralNotes
            data={activityBasedFormData.generalNotes}
            updateData={updateGeneralNotes}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "reportGeneration":
        return (
          <ReportGeneration
            // Convert activity-based form data to the format expected by ReportGeneration
            // In a real implementation, we would update ReportGeneration to handle both formats
            formData={formData}
            onBack={handleBack}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmitForm = async () => {
    try {
      setIsSubmitting(true);
      const rbtName = "John Doe"; // Replace with actual logged-in RBT
      let reportData;

      // Convert activity-based form to report
      if (USE_ACTIVITY_BASED_FLOW) {
        reportData = await generateReport(activityBasedFormData, rbtName);
      } else {
        reportData = await generateReport(formData, rbtName);
      }

      // Navigate to the report page with report data
      router.push(`/rbt/report/view?clientId=${formData.basicInfo.clientId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {USE_ACTIVITY_BASED_FLOW ? (
              // Activity-based flow steps
              <>
                <div
                  className={`step ${currentActivityStep === "basicInfo" ? "active" : ""} 
                    ${["initialStatus", "activities", "generalNotes", "reportGeneration"].includes(currentActivityStep) ? "completed" : ""}`}
                >
                  Basic Info
                </div>
                <div
                  className={`step ${currentActivityStep === "initialStatus" ? "active" : ""} 
                    ${["activities", "generalNotes", "reportGeneration"].includes(currentActivityStep) ? "completed" : ""}`}
                >
                  Initial Status
                </div>
                <div
                  className={`step ${currentActivityStep === "activities" ? "active" : ""} 
                    ${["generalNotes", "reportGeneration"].includes(currentActivityStep) ? "completed" : ""}`}
                >
                  Activities
                </div>
                <div
                  className={`step ${currentActivityStep === "generalNotes" ? "active" : ""} 
                    ${["reportGeneration"].includes(currentActivityStep) ? "completed" : ""}`}
                >
                  General Notes
                </div>
                <div
                  className={`step ${currentActivityStep === "reportGeneration" ? "active" : ""}`}
                >
                  Report
                </div>
              </>
            ) : (
              // Legacy flow steps
              <>
                <div
                  className={`step ${currentLegacyStep === "basicInfo" ? "active" : ""} 
                    ${["skillAcquisition", "behaviorTracking", "reinforcement", "generalNotes", "reportGeneration"].includes(currentLegacyStep) ? "completed" : ""}`}
                >
                  Basic Info
                </div>
                <div
                  className={`step ${currentLegacyStep === "skillAcquisition" ? "active" : ""} 
                    ${["behaviorTracking", "reinforcement", "generalNotes", "reportGeneration"].includes(currentLegacyStep) ? "completed" : ""}`}
                >
                  Skills
                </div>
                <div
                  className={`step ${currentLegacyStep === "behaviorTracking" ? "active" : ""} 
                    ${["reinforcement", "generalNotes", "reportGeneration"].includes(currentLegacyStep) ? "completed" : ""}`}
                >
                  Behaviors
                </div>
                <div
                  className={`step ${currentLegacyStep === "reinforcement" ? "active" : ""} 
                    ${["generalNotes", "reportGeneration"].includes(currentLegacyStep) ? "completed" : ""}`}
                >
                  Reinforcement
                </div>
                <div
                  className={`step ${currentLegacyStep === "generalNotes" ? "active" : ""} 
                    ${["reportGeneration"].includes(currentLegacyStep) ? "completed" : ""}`}
                >
                  Notes
                </div>
                <div
                  className={`step ${currentLegacyStep === "reportGeneration" ? "active" : ""}`}
                >
                  Report
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Render current step based on active flow */}
      {USE_ACTIVITY_BASED_FLOW ? renderActivityStep() : renderLegacyStep()}

      <style jsx>{`
        .step {
          position: relative;
          flex: 1;
          text-align: center;
          padding: 12px;
          font-size: 14px;
          color: #718096;
        }

        .step:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -10px;
          width: 20px;
          height: 2px;
          background-color: #cbd5e0;
          transform: translateY(-50%);
        }

        .step.active {
          color: #4f46e5;
          font-weight: 600;
        }

        .step.completed {
          color: #48bb78;
        }

        .step.completed::before {
          content: "✓ ";
        }
      `}</style>
    </div>
  );
}
