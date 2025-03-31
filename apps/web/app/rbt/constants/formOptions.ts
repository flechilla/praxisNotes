export const locationOptions = [
  { value: "home", label: "Home" },
  { value: "school", label: "School" },
  { value: "clinic", label: "Clinic" },
  { value: "community", label: "Community Setting" },
  { value: "telehealth", label: "Telehealth" },
];

export const promptLevelOptions = [
  { value: "independent", label: "Independent" },
  { value: "gestural", label: "Gestural Prompt" },
  { value: "verbal", label: "Verbal Prompt" },
  { value: "model", label: "Model Prompt" },
  { value: "partial", label: "Partial Physical Prompt" },
  { value: "full", label: "Full Physical Prompt" },
];

export const behaviorIntensityOptions = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
];

export const antecedentOptions = [
  { value: "demand", label: "Presented with demand" },
  { value: "transition", label: "During transition" },
  { value: "denied", label: "Denied preferred item/activity" },
  { value: "attention", label: "Seeking attention" },
  { value: "sensory", label: "Sensory trigger" },
  { value: "other", label: "Other (specify in notes)" },
];

export const consequenceOptions = [
  { value: "attention", label: "Received attention" },
  { value: "escape", label: "Escaped demand" },
  { value: "access", label: "Gained access to item/activity" },
  { value: "sensory", label: "Sensory feedback" },
  { value: "redirection", label: "Redirection provided" },
  { value: "other", label: "Other (specify in notes)" },
];

export const interventionOptions = [
  { value: "redirection", label: "Redirection" },
  { value: "reinforcement", label: "Differential reinforcement" },
  { value: "extinction", label: "Extinction" },
  { value: "visual", label: "Visual supports" },
  { value: "prompting", label: "Prompting hierarchy" },
  { value: "other", label: "Other (specify in notes)" },
];

export const reinforcerTypeOptions = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "social", label: "Social" },
  { value: "activity", label: "Activity-based" },
];

export const effectivenessOptions = [
  { value: "1", label: "Not effective" },
  { value: "2", label: "Slightly effective" },
  { value: "3", label: "Moderately effective" },
  { value: "4", label: "Very effective" },
  { value: "5", label: "Extremely effective" },
];

// New options for activity-based tracking
export const promptTypeOptions = [
  { value: "verbal", label: "Verbal Prompt" },
  { value: "gestural", label: "Gestural Prompt" },
  { value: "model", label: "Model Prompt" },
  { value: "physical", label: "Physical Prompt" },
  { value: "visual", label: "Visual Prompt" },
  { value: "positional", label: "Positional Prompt" },
  { value: "other", label: "Other" },
];

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

export const interventionTypeOptions = [
  { value: "response_blocking", label: "Response Blocking" },
  { value: "redirection", label: "Redirection" },
  { value: "dro", label: "Differential Reinforcement of Other Behavior (DRO)" },
  {
    value: "dri",
    label: "Differential Reinforcement of Incompatible Behavior (DRI)",
  },
  { value: "escape_extinction", label: "Escape Extinction" },
  { value: "token_economy", label: "Token Economy" },
  { value: "visual_supports", label: "Visual Supports" },
  { value: "other", label: "Other" },
];
