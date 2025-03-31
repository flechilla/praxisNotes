# RBT User Flow Specification

This document outlines the detailed user flow for Registered Behavior Technicians (RBTs) using the PraxisNote application, with a focus on the session documentation process and report generation.

## Overview

The primary workflow for RBTs involves:

1. Logging into the system
2. Selecting a client
3. Completing a multi-step session form
4. Generating and reviewing the session report
5. Submitting the report for BCBA review

## 1. Authentication and Dashboard

### 1.1 Login Process

1. RBT navigates to the application URL
2. System displays login page with email and password fields
3. RBT enters credentials and clicks "Login"
4. System validates credentials and authenticates the user
5. On successful authentication, system redirects to the RBT dashboard

### 1.2 Dashboard Elements

The RBT dashboard includes:

- **Welcome message** with RBT's name
- **Today's Schedule** showing upcoming or recent client sessions
- **Recent Clients** section for quick access to frequent clients
- **Draft Reports** section showing incomplete session forms
- **Reports Pending Revision** section showing reports that need updates
- **Quick Actions** panel with buttons for common tasks:
  - New Session Report
  - Client Search
  - View My Schedule

## 2. Client Selection

### 2.1 Starting a New Session

1. RBT clicks "New Session Report" from dashboard or navigation
2. System displays client selection interface
3. RBT can:
   - Select from a list of their assigned clients
   - Search clients by name
   - Filter clients by relevant criteria
4. After selecting a client, RBT clicks "Start Session Documentation"
5. System redirects to the session form with client information pre-filled

### 2.2 Alternative Paths

- From client list page, RBT can click on a client card and select "New Session"
- From client detail page, RBT can click "Document Session" button
- From dashboard, RBT can select a client in the "Recent Clients" widget

## 3. Session Form - Step by Step

The session form is divided into multiple sections to organize data entry logically.

### 3.1 Basic Session Information

**Fields:**

- **Date**: Calendar date picker (defaults to current date)
- **Start Time**: Time selector (defaults to current time)
- **End Time**: Time selector
- **Location**: Dropdown with options:
  - Home
  - Clinic
  - School
  - Community Setting
  - Telehealth
  - Other (with text field for details)
- **Caregiver Present**: Yes/No toggle
- **Caregiver Name**: Text field (conditional, appears if caregiver present)

**Interactions:**

1. RBT fills out each field
2. Form validates that end time is after start time
3. RBT clicks "Next" to proceed to the next section
4. System saves draft automatically

### 3.2 Skill Acquisition Programs

**Fields:**

- Multiple program entries with:
  - **Program Name**: Dropdown or search field to select from client's programs
  - **Skill Target**: Text field or selection from program targets
  - **Prompt Level Used**: Dropdown with options:
    - Full Physical Prompt
    - Partial Physical Prompt
    - Gestural Prompt
    - Visual Prompt
    - Verbal Prompt
    - Independent (No Prompt)
  - **Response Type**: Dropdown with options:
    - Independent
    - Responded with Prompt
    - No Response
    - Partial Response
    - Incorrect Response
  - **Trials Total**: Numeric input
  - **Trials Successful**: Numeric input
  - **Notes**: Text area for additional details

**Interactions:**

1. System displays one program entry by default
2. RBT completes the entry
3. RBT can click "Add Another Program" to add additional program entries
4. RBT can remove program entries with "Remove" button
5. Form validates that trials successful ≤ trials total
6. RBT clicks "Next" to proceed
7. System saves draft automatically

### 3.3 Behavior Tracking

**Fields:**

- Multiple behavior entries with:
  - **Behavior Type**: Dropdown with options from client's behavior plan:
    - Aggression
    - Self-Injury
    - Property Destruction
    - Elopement
    - Tantrums
    - Verbal Outbursts
    - Stereotypy
    - Noncompliance
    - Other (with text field)
  - **Measurement Type**: Radio buttons with options:
    - Frequency (Shows count input)
    - Duration (Shows timer or duration input)
    - Intensity (Shows 1-5 scale)
  - **Measurement Value**: Input based on measurement type
  - **Antecedent**: Text area describing what happened before behavior
  - **Consequence**: Text area describing what happened after behavior
  - **Notes**: Text area for additional observations

**Interactions:**

1. System displays one behavior entry by default
2. RBT completes the entry
3. RBT can click "Add Another Behavior" for additional entries
4. RBT can remove behavior entries
5. RBT clicks "Next" to proceed
6. System saves draft automatically

### 3.4 Reinforcement Section

**Fields:**

- Multiple reinforcer entries with:
  - **Reinforcer Type**: Dropdown with options:
    - Social Praise
    - Token Economy
    - Preferred Items
    - Preferred Activities
    - Edibles
    - Breaks
    - Other (with text field)
  - **Specific Reinforcer**: Text field for details
  - **Effectiveness**: Dropdown with options:
    - Highly Effective
    - Moderately Effective
    - Slightly Effective
    - Ineffective
    - Refused/Rejected
  - **Notes**: Text area for additional details

**Interactions:**

1. System displays one reinforcer entry by default
2. RBT completes the entry
3. RBT can add or remove reinforcer entries
4. RBT clicks "Next" to proceed
5. System saves draft automatically

### 3.5 General Notes and Summary

**Fields:**

- **Overall Session Rating**: 1-5 scale
- **Client Engagement**: Dropdown with options:
  - Highly Engaged
  - Moderately Engaged
  - Minimally Engaged
  - Disengaged
- **Environmental Factors**: Text area for relevant environmental notes
- **Caregiver Interaction**: Text area for notes on caregiver participation
- **General Session Notes**: Rich text area for additional observations
- **Recommendations**: Text area for suggestions for future sessions

**Interactions:**

1. RBT completes all relevant fields
2. RBT clicks "Next" to proceed to report generation
3. System saves draft automatically

## 4. Report Generation

### 4.1 AI-Assisted Report Creation

1. System prepares form data for AI processing
2. System connects to ai-sdk service
3. Using structured prompts, system requests the AI to generate a comprehensive session report
4. The AI generates a professional report integrating all session data
5. System formats the report according to clinical standards
6. System displays the generated report for RBT review

### 4.2 Report Template Structure

The generated report follows this structure:

- **Header**: Client name, date, RBT name, session duration
- **Session Overview**: Brief summary of the session
- **Skill Acquisition**: Summary of programs worked on and progress
- **Behavior Analysis**: Summary of behaviors observed, patterns, and interventions
- **Reinforcement Effectiveness**: Analysis of reinforcers used and their effectiveness
- **Recommendations**: Suggestions for future sessions
- **Next Steps**: Planned focus areas for upcoming sessions

### 4.3 Report Review and Editing

**Interactions:**

1. RBT reviews the generated report
2. RBT can edit any section directly if needed
3. RBT can regenerate specific sections if needed
4. RBT can add additional notes or clarifications
5. System automatically saves changes

## 5. Submission and Follow-up

### 5.1 Report Submission

**Options:**

- **Save as Draft**: Saves current state for later completion
- **Submit for Review**: Finalizes report and submits to assigned BCBA
- **Download PDF**: Creates PDF version for offline use

**Submission Process:**

1. RBT clicks "Submit for Review"
2. System displays confirmation dialog
3. RBT confirms submission
4. System changes report status to "Submitted"
5. System notifies the assigned BCBA
6. System returns RBT to dashboard with confirmation message

### 5.2 Post-Submission Actions

After submission, RBT can:

- View the submitted report (read-only)
- Track review status in dashboard
- Receive notifications when BCBA provides feedback
- Make revisions if requested by BCBA

## Form Elements Specification

### Dropdown Values

All dropdown fields provide standardized options based on ABA therapy practices:

#### Location Options

```typescript
export const LOCATIONS = [
  { value: "home", label: "Home" },
  { value: "clinic", label: "Clinic" },
  { value: "school", label: "School" },
  { value: "community", label: "Community Setting" },
  { value: "telehealth", label: "Telehealth" },
  { value: "other", label: "Other" },
];
```

#### Prompt Level Options

```typescript
export const PROMPT_LEVELS = [
  { value: "full_physical", label: "Full Physical Prompt" },
  { value: "partial_physical", label: "Partial Physical Prompt" },
  { value: "gestural", label: "Gestural Prompt" },
  { value: "visual", label: "Visual Prompt" },
  { value: "verbal", label: "Verbal Prompt" },
  { value: "independent", label: "Independent (No Prompt)" },
];
```

#### Client Response Options

```typescript
export const CLIENT_RESPONSES = [
  { value: "independent", label: "Independent" },
  { value: "prompted", label: "Responded with Prompt" },
  { value: "no_response", label: "No Response" },
  { value: "partial", label: "Partial Response" },
  { value: "incorrect", label: "Incorrect Response" },
];
```

#### Behavior Types

```typescript
export const COMMON_BEHAVIORS = [
  { value: "aggression", label: "Aggression" },
  { value: "self_injury", label: "Self-Injury" },
  { value: "property_destruction", label: "Property Destruction" },
  { value: "elopement", label: "Elopement" },
  { value: "tantrums", label: "Tantrums" },
  { value: "verbal_outbursts", label: "Verbal Outbursts" },
  { value: "stereotypy", label: "Stereotypy" },
  { value: "noncompliance", label: "Noncompliance" },
  { value: "other", label: "Other" },
];
```

#### Reinforcer Types

```typescript
export const COMMON_REINFORCERS = [
  { value: "social_praise", label: "Social Praise" },
  { value: "token_economy", label: "Token Economy" },
  { value: "preferred_items", label: "Preferred Items" },
  { value: "preferred_activities", label: "Preferred Activities" },
  { value: "edibles", label: "Edibles" },
  { value: "breaks", label: "Breaks" },
  { value: "other", label: "Other" },
];
```

#### Reinforcer Effectiveness

```typescript
export const REINFORCER_RESPONSES = [
  { value: "highly_effective", label: "Highly Effective" },
  { value: "moderately_effective", label: "Moderately Effective" },
  { value: "slightly_effective", label: "Slightly Effective" },
  { value: "ineffective", label: "Ineffective" },
  { value: "refused", label: "Refused/Rejected" },
];
```

#### Client Engagement Levels

```typescript
export const ENGAGEMENT_LEVELS = [
  { value: "highly_engaged", label: "Highly Engaged" },
  { value: "moderately_engaged", label: "Moderately Engaged" },
  { value: "minimally_engaged", label: "Minimally Engaged" },
  { value: "disengaged", label: "Disengaged" },
];
```

## AI-SDK Integration Specification

### Report Generation Implementation

The report generation feature will use the ai-sdk package to process session data and generate professional reports.

#### Integration Setup

```typescript
import { OpenAI } from "ai-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

#### Example Prompt Structure

```typescript
const generateSessionReport = async (sessionData) => {
  const {
    client,
    sessionInfo,
    skillAcquisition,
    behaviors,
    reinforcers,
    notes,
  } = sessionData;

  const prompt = `
    Generate a professional ABA therapy session report based on the following data:
    
    CLIENT INFORMATION:
    Name: ${client.firstName} ${client.lastName}
    Age: ${client.age}
    
    SESSION INFORMATION:
    Date: ${sessionInfo.date}
    Duration: ${sessionInfo.startTime} to ${sessionInfo.endTime}
    Location: ${sessionInfo.location}
    
    SKILL ACQUISITION PROGRAMS:
    ${formatSkillAcquisitionForPrompt(skillAcquisition)}
    
    BEHAVIORS OBSERVED:
    ${formatBehaviorsForPrompt(behaviors)}
    
    REINFORCERS USED:
    ${formatReinforcersForPrompt(reinforcers)}
    
    ADDITIONAL NOTES:
    ${notes.generalNotes}
    
    Generate a comprehensive session report following this structure:
    1. Session Overview
    2. Skill Acquisition Summary
    3. Behavior Analysis
    4. Reinforcement Effectiveness
    5. Recommendations
    
    Use professional clinical language appropriate for behavioral health documentation.
  `;

  const response = await openai.complete({
    model: "gpt-4",
    prompt,
    max_tokens: 1000,
  });

  return response.text;
};
```

#### Data Formatting Helper Functions

```typescript
const formatSkillAcquisitionForPrompt = (skillPrograms) => {
  return skillPrograms
    .map(
      (program) =>
        `Program: ${program.name}
     Target: ${program.target}
     Prompt Level: ${program.promptLevel}
     Response: ${program.responseType}
     Trials: ${program.trialsSuccessful}/${program.trialsTotal}
     Notes: ${program.notes}`
    )
    .join("\n\n");
};

const formatBehaviorsForPrompt = (behaviors) => {
  return behaviors
    .map(
      (behavior) =>
        `Behavior: ${behavior.type}
     ${
       behavior.measurementType === "frequency"
         ? `Frequency: ${behavior.value} occurrences`
         : ""
     }
     ${
       behavior.measurementType === "duration"
         ? `Duration: ${behavior.value} seconds`
         : ""
     }
     ${
       behavior.measurementType === "intensity"
         ? `Intensity: ${behavior.value}/5`
         : ""
     }
     Antecedent: ${behavior.antecedent}
     Consequence: ${behavior.consequence}
     Notes: ${behavior.notes}`
    )
    .join("\n\n");
};

const formatReinforcersForPrompt = (reinforcers) => {
  return reinforcers
    .map(
      (reinforcer) =>
        `Type: ${reinforcer.type}
     Specific: ${reinforcer.specific}
     Effectiveness: ${reinforcer.effectiveness}
     Notes: ${reinforcer.notes}`
    )
    .join("\n\n");
};
```

## Mobile Considerations

The RBT user flow accommodates mobile usage patterns:

1. **Responsive Design**:

   - All form elements adapt to smaller screens
   - Single column layout on mobile devices
   - Touch-friendly input controls

2. **Mobile-specific Interactions**:

   - Swipe navigation between form sections
   - Bottom navigation for key actions
   - Collapsible sections to manage screen space

3. **Offline Capabilities**:
   - Data cached locally if connection lost
   - Form completion possible offline
   - Automatic sync when connection restored
