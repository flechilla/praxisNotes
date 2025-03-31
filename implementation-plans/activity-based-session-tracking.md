# Implementation Plan: Activity-Based Session Tracking

## Objective

Redesign the RBT session form to follow an activity-based structure while maintaining the ability to select behaviors and skills from predefined dropdown options.

## Current Issues

- The current form separates activities, behaviors, and reinforcers into distinct sections
- This doesn't reflect the natural flow of RBT sessions, where behaviors occur during specific activities
- The example output shows that RBTs document their sessions as a series of activities, each with:
  - Activity description and goal
  - Behaviors that occurred during the activity
  - Interventions applied for those behaviors
  - Prompts required to complete the activity
  - Reinforcement provided upon completion

## Files to Modify

### 1. Type Definitions

- `apps/web/lib/types/SessionForm.ts`:
  - Add new `Activity` type
  - Update `SessionFormData` structure to include activities
  - Add new form step types

### 2. Form Components

- Create new components:
  - `apps/web/app/rbt/report/form/InitialStatus.tsx`
  - `apps/web/app/rbt/report/form/Activities.tsx`
  - `apps/web/app/rbt/report/form/ActivityForm.tsx`
- Update existing component:
  - `apps/web/app/rbt/report/SessionForm.tsx`

### 3. Report Generation

- `apps/web/lib/utils/reportGeneration.ts`:
  - Update prompt to handle activity-based structure
- `apps/web/app/api/report/generate/route.ts`:
  - Ensure API routes handle the new data structure

## Implementation Checklist

### 1. Type Definitions Update

- [ ] Create `Activity` type:

  ```typescript
  export type ActivityBehavior = {
    behaviorId?: string;
    behaviorName: string;
    definition?: string;
    intensity: string;
    interventionUsed: string[];
    interventionNotes?: string;
  };

  export type ActivityPrompt = {
    type: string; // "verbal", "gestural", "physical", etc.
    count: number;
  };

  export type ActivityReinforcement = {
    reinforcerId?: string;
    reinforcerName: string;
    type: string;
    notes?: string;
  };

  export type Activity = {
    id?: string;
    name: string;
    description: string;
    goal: string;
    location: string;
    duration?: number;
    behaviors: ActivityBehavior[];
    promptsUsed: ActivityPrompt[];
    completed: boolean;
    completionNotes?: string;
    reinforcement: ActivityReinforcement;
  };
  ```

- [ ] Create `InitialStatusFormData` type:

  ```typescript
  export type InitialStatusFormData = {
    clientStatus: string;
    caregiverReport: string;
    initialResponse: string;
    medicationChanges?: string;
  };
  ```

- [ ] Create `ActivitiesFormData` type:

  ```typescript
  export type ActivitiesFormData = {
    activities: Activity[];
  };
  ```

- [ ] Update `SessionFormData` type:

  ```typescript
  export type SessionFormData = {
    basicInfo: BasicInfoFormData;
    initialStatus: InitialStatusFormData;
    activities: ActivitiesFormData;
    generalNotes: GeneralNotesFormData;
  };
  ```

- [ ] Update `FormStep` type:
  ```typescript
  export type FormStep =
    | "basicInfo"
    | "initialStatus"
    | "activities"
    | "generalNotes"
    | "reportGeneration";
  ```

### 2. Form Component Creation

- [ ] Create `InitialStatus.tsx` component:

  - Fields for client status when session started
  - Caregiver reports field
  - Medication changes field
  - Initial response to RBT field

- [ ] Create `Activities.tsx` component:

  - List view of added activities
  - Add activity button
  - Edit/delete activity functionality
  - Activity summary table

- [ ] Create `ActivityForm.tsx` component:

  - Activity details section
    - Name, description, goal, location
    - Duration field
  - Behaviors section
    - Dropdown for selecting predefined behaviors
    - Intensity selection
    - Intervention selection (multiple choice)
    - Notes field
  - Prompts section
    - Selection of prompt types
    - Count for each prompt type
  - Completion section
    - Completed checkbox
    - Notes field
  - Reinforcement section
    - Dropdown for selecting predefined reinforcers
    - Type selection
    - Notes field

- [ ] Update `SessionForm.tsx`:
  - Modify step management
  - Update form state structure
  - Integrate new components
  - Ensure proper data flow between steps

### 3. Update Report Generation

- [ ] Update `createReportPrompt` function to handle activity-based structure:

  ```typescript
  // Update section in createReportPrompt
  const activitiesSection = formData.activities.activities
    .map(
      (activity) => `
      ACTIVITY: ${activity.name}
      - Description: ${activity.description}
      - Goal: ${activity.goal}
      - Location: ${activity.location}
      ${activity.duration ? `- Duration: ${activity.duration} minutes` : ""}
      
      BEHAVIORS DURING ACTIVITY:
      ${activity.behaviors
        .map(
          (behavior) => `
    - Behavior: ${behavior.behaviorName}
    - Intensity: ${behavior.intensity}
    - Interventions: ${behavior.interventionUsed.join(", ")}
    ${behavior.interventionNotes ? `- Notes: ${behavior.interventionNotes}` : ""}
    `
        )
        .join("\n")}
      
      PROMPTS USED:
      ${activity.promptsUsed
        .map(
          (prompt) => `
    - ${prompt.type}: ${prompt.count} times
    `
        )
        .join("\n")}
      
      COMPLETION:
      - Status: ${activity.completed ? "Completed" : "Not completed"}
      ${activity.completionNotes ? `- Notes: ${activity.completionNotes}` : ""}
      
      REINFORCEMENT:
      - Reinforcer: ${activity.reinforcement.reinforcerName}
      - Type: ${activity.reinforcement.type}
      ${activity.reinforcement.notes ? `- Notes: ${activity.reinforcement.notes}` : ""}
      `
    )
    .join("\n\n");
  ```

- [ ] Add initial status section to prompt:

  ```typescript
  const initialStatusSection = `
  CLIENT INITIAL STATUS:
  - Status on arrival: ${formData.initialStatus.clientStatus}
  - Caregiver report: ${formData.initialStatus.caregiverReport}
  - Initial response: ${formData.initialStatus.initialResponse}
  ${formData.initialStatus.medicationChanges ? `- Medication changes: ${formData.initialStatus.medicationChanges}` : ""}
  `;
  ```

- [ ] Update API route (`route.ts`) to handle new data structure

### 4. UI Constants and Options Updates

- [ ] Create prompt type options:

  ```typescript
  export const promptTypeOptions = [
    { value: "verbal", label: "Verbal Prompt" },
    { value: "gestural", label: "Gestural Prompt" },
    { value: "model", label: "Model Prompt" },
    { value: "physical", label: "Physical Prompt" },
    { value: "visual", label: "Visual Prompt" },
    { value: "positional", label: "Positional Prompt" },
    { value: "other", label: "Other" },
  ];
  ```

- [ ] Create common activity locations:

  ```typescript
  export const activityLocationOptions = [
    { value: "table", label: "At Table" },
    { value: "floor", label: "On Floor" },
    { value: "play_area", label: "Play Area" },
    { value: "kitchen", label: "Kitchen" },
    { value: "bedroom", label: "Bedroom" },
    { value: "bathroom", label: "Bathroom" },
    { value: "outdoors", label: "Outdoors" },
    { value: "other", label: "Other" },
  ];
  ```

- [ ] Create intervention type options:
  ```typescript
  export const interventionTypeOptions = [
    { value: "response_blocking", label: "Response Blocking" },
    { value: "redirection", label: "Redirection" },
    {
      value: "dro",
      label: "Differential Reinforcement of Other Behavior (DRO)",
    },
    {
      value: "dri",
      label: "Differential Reinforcement of Incompatible Behavior (DRI)",
    },
    { value: "escape_extinction", label: "Escape Extinction" },
    { value: "token_economy", label: "Token Economy" },
    { value: "visual_supports", label: "Visual Supports" },
    { value: "other", label: "Other" },
  ];
  ```

## Testing Plan

1. Unit Tests

   - [ ] Test new type definitions
   - [ ] Test form components in isolation
   - [ ] Test report generation with new data structure

2. Integration Tests

   - [ ] Test complete form flow
   - [ ] Verify data is correctly passed between components
   - [ ] Ensure report generation handles all edge cases

3. User Testing
   - [ ] Get feedback from RBTs on the new activity-based flow
   - [ ] Verify the reports generated match expectations
   - [ ] Collect usability feedback

## Migration Plan

1. Develop in parallel with existing implementation
2. Allow users to opt-in to the new interface
3. Provide migration path for existing data
4. Gradually phase out old interface after successful adoption

## Timeline

1. Type Definitions (1 day)
2. Form Components (3 days)
3. Report Generation Updates (1 day)
4. UI Constants and Options (1 day)
5. Testing and Refinement (2 days)

## Success Criteria

1. RBTs can document sessions in a more natural, chronological flow
2. Reports reflect the narrative structure shown in the example
3. All existing functionality (behavior/skill selection from dropdowns) is preserved
4. The form is easier to complete and reduces redundant data entry
