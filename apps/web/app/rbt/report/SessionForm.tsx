"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SessionFormData, FormStep } from "../../../lib/types/SessionForm";
import BasicInfo from "./form/BasicInfo";
import SkillAcquisition from "./form/SkillAcquisition";
import BehaviorTracking from "./form/BehaviorTracking";
import Reinforcement from "./form/Reinforcement";
import GeneralNotes from "./form/GeneralNotes";
import ReportGeneration from "./form/ReportGeneration";

export default function SessionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams?.get("clientId") ?? "";

  // Initialize form state with empty values
  const [formData, setFormData] = useState<SessionFormData>({
    basicInfo: {
      sessionDate: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      location: "",
      clientId: clientIdParam,
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

  // Manage the current step of the form
  const [currentStep, setCurrentStep] = useState<FormStep>("basicInfo");

  // Handle moving to the next step
  const handleNext = () => {
    switch (currentStep) {
      case "basicInfo":
        setCurrentStep("skillAcquisition");
        break;
      case "skillAcquisition":
        setCurrentStep("behaviorTracking");
        break;
      case "behaviorTracking":
        setCurrentStep("reinforcement");
        break;
      case "reinforcement":
        setCurrentStep("generalNotes");
        break;
      case "generalNotes":
        setCurrentStep("reportGeneration");
        break;
    }

    // Scroll to top after step change
    window.scrollTo(0, 0);
  };

  // Handle moving to the previous step
  const handleBack = () => {
    switch (currentStep) {
      case "skillAcquisition":
        setCurrentStep("basicInfo");
        break;
      case "behaviorTracking":
        setCurrentStep("skillAcquisition");
        break;
      case "reinforcement":
        setCurrentStep("behaviorTracking");
        break;
      case "generalNotes":
        setCurrentStep("reinforcement");
        break;
      case "reportGeneration":
        setCurrentStep("generalNotes");
        break;
    }

    // Scroll to top after step change
    window.scrollTo(0, 0);
  };

  // Reset the form and start over
  const handleReset = () => {
    setFormData({
      basicInfo: {
        sessionDate: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        location: "",
        clientId: "",
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
    setCurrentStep("basicInfo");
    router.push("/rbt");
  };

  // Update specific sections of the form data
  const updateBasicInfo = (data: typeof formData.basicInfo) => {
    setFormData((prev) => ({ ...prev, basicInfo: data }));
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
    setFormData((prev) => ({ ...prev, generalNotes: data }));
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
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

  return (
    <div className="py-8">
      {currentStep !== "reportGeneration" && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Session Report Form
            </h1>
            <p className="text-gray-600">
              Complete each section to generate a comprehensive session report.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="relative">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{
                        width: (() => {
                          switch (currentStep) {
                            case "basicInfo":
                              return "17%";
                            case "skillAcquisition":
                              return "34%";
                            case "behaviorTracking":
                              return "50%";
                            case "reinforcement":
                              return "67%";
                            case "generalNotes":
                              return "84%";
                            case "reportGeneration":
                              return "100%";
                            default:
                              return "0%";
                          }
                        })(),
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <div
                      className={`${currentStep === "basicInfo" ? "text-indigo-600 font-medium" : ""}`}
                    >
                      Basic Info
                    </div>
                    <div
                      className={`${currentStep === "skillAcquisition" ? "text-indigo-600 font-medium" : ""}`}
                    >
                      Skills
                    </div>
                    <div
                      className={`${currentStep === "behaviorTracking" ? "text-indigo-600 font-medium" : ""}`}
                    >
                      Behaviors
                    </div>
                    <div
                      className={`${currentStep === "reinforcement" ? "text-indigo-600 font-medium" : ""}`}
                    >
                      Reinforcement
                    </div>
                    <div
                      className={`${currentStep === "generalNotes" ? "text-indigo-600 font-medium" : ""}`}
                    >
                      Notes
                    </div>
                    <div
                      className={`${currentStep === "reportGeneration" ? "text-indigo-600 font-medium" : ""}`}
                    >
                      Report
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderStep()}
    </div>
  );
}
