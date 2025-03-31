# RBT Report Generation Implementation Plan

This document outlines the implementation plan for the RBT (Registered Behavior Technician) report generation feature as specified in the [rbt-user-flow.md](../docs/rbt-user-flow.md) document.

## Overview

We need to implement a multi-step form for RBTs to document their sessions and generate professional reports using AI. The implementation will focus on:

1. Creating a multi-step form for session documentation
2. Using mock data for client information
3. Implementing AI-assisted report generation with ai-sdk
4. Allowing RBTs to review, edit, and submit generated reports

## Technical Approach

We'll use Next.js for the frontend, and implement the UI components in the React framework. The AI report generation will use the ai-sdk package that's already installed in the project.

## Project Structure

```
apps/web/
  ├── app/
  │   ├── rbt/
  │   │   ├── report/
  │   │   │   ├── page.tsx               # Entry point to report generation
  │   │   │   ├── form/                  # Form components
  │   │   │   │   ├── BasicInfo.tsx      # Step 1: Basic session info
  │   │   │   │   ├── SkillAcquisition.tsx # Step 2: Skill acquisition
  │   │   │   │   ├── BehaviorTracking.tsx # Step 3: Behavior tracking
  │   │   │   │   ├── Reinforcement.tsx  # Step 4: Reinforcement
  │   │   │   │   ├── GeneralNotes.tsx   # Step 5: Notes and summary
  │   │   │   │   └── ReportGeneration.tsx # Step 6: Report generation
  │   │   │   ├── SessionForm.tsx        # Multi-step form container
  │   │   │   └── ReportPreview.tsx      # Report preview component
  │   │   ├── layout.tsx                 # Layout for RBT section
  │   │   └── constants/                 # Constants for form data
  │   │       └── formOptions.ts         # Dropdown options
  ├── components/
  │   └── ui/                            # Reusable UI components
  └── lib/
      ├── types/                         # Type definitions
      │   ├── SessionForm.ts             # Form type definitions
      │   └── Report.ts                  # Report type definitions
      ├── utils/                         # Utility functions
      │   └── reportGeneration.ts        # AI report generation utilities
      ├── mocks/                         # Mock data
      │   └── clientData.ts              # Mock client data
      └── api/
          └── report/
              └── generate/
                  └── route.ts           # API endpoint for report generation
```

## Implementation Checklist

### 1. Setup and Configuration

- [ ] Create folder structure as outlined above
- [ ] Setup type definitions for the form and report data
- [ ] Create mock client data for testing

### 2. Form Implementation

- [ ] Implement SessionForm.tsx as the container for the multi-step form
- [ ] Implement BasicInfo.tsx for step 1 (session information)
- [ ] Implement SkillAcquisition.tsx for step 2 (skill programs)
- [ ] Implement BehaviorTracking.tsx for step 3 (behavior tracking)
- [ ] Implement Reinforcement.tsx for step 4 (reinforcement)
- [ ] Implement GeneralNotes.tsx for step 5 (notes and summary)
- [ ] Create form constants in formOptions.ts based on the specification

### 3. Report Generation

- [ ] Create the reportGeneration.ts utility for AI integration
- [ ] Implement API endpoint for report generation
- [ ] Implement ReportGeneration.tsx component for displaying the generated report
- [ ] Implement ReportPreview.tsx for reviewing and editing the report

### 4. User Interface and Navigation

- [ ] Create RBT layout with appropriate navigation
- [ ] Implement report page with proper routing
- [ ] Add feedback and loading states for AI report generation

### 5. Testing and Validation

- [ ] Test the form with mock data
- [ ] Validate form submissions and transitions
- [ ] Test the AI report generation
- [ ] Ensure responsive design for mobile use

## Files to Create/Modify

### Type Definitions

1. `apps/web/lib/types/SessionForm.ts`

   - Define types for all form sections (basic info, skill acquisition, etc.)
   - Define form state and validation types

2. `apps/web/lib/types/Report.ts`
   - Define type for the generated report structure

### Mock Data

3. `apps/web/lib/mocks/clientData.ts`
   - Create mock client data for testing

### Form Constants

4. `apps/web/app/rbt/constants/formOptions.ts`
   - Define dropdown options based on the specification

### Form Components

5. `apps/web/app/rbt/report/SessionForm.tsx`

   - Multi-step form container with state management

6. `apps/web/app/rbt/report/form/*.tsx`
   - Individual form step components

### AI Integration

7. `apps/web/lib/utils/reportGeneration.ts`
   - AI integration using ai-sdk
8. `apps/web/app/api/report/generate/route.ts`
   - API endpoint for report generation

### UI Components

9. `apps/web/app/rbt/report/ReportPreview.tsx`

   - Report preview and editing component

10. `apps/web/app/rbt/report/page.tsx`
    - Main page for report generation

## Implementation Details

For AI report generation, we'll use the ai-sdk package to process the form data and generate a professional report. The implementation will follow the prompt structure outlined in the specification.

The multi-step form will be implemented with local state management, storing the form data as the user progresses through the steps. The form will include validation to ensure all required data is collected before generating the report.

The report preview will allow RBTs to review and edit the generated report before submission.
