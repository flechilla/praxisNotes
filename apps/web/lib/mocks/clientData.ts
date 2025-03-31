import { ClientInfo } from "../types/SessionForm";

export const mockClients: ClientInfo[] = [
  {
    id: "c1",
    firstName: "Alex",
    lastName: "Johnson",
    dob: "2016-05-12",
    guardian: "Maria Johnson",
    diagnosis: "Autism Spectrum Disorder",
    provider: "Sunshine Behavioral Health",
  },
  {
    id: "c2",
    firstName: "Sam",
    lastName: "Thompson",
    dob: "2014-08-23",
    guardian: "David Thompson",
    diagnosis: "ADHD",
    provider: "Bright Future Therapy",
  },
  {
    id: "c3",
    firstName: "Jordan",
    lastName: "Lee",
    dob: "2018-02-10",
    guardian: "Sarah Lee",
    diagnosis: "Developmental Delay",
    provider: "Growing Minds Center",
  },
  {
    id: "c4",
    firstName: "Brandon",
    lastName: "Morris",
    dob: "2017-06-15",
    guardian: "Victoria Brown",
    diagnosis: "Autism Spectrum Disorder, Level 2",
    provider: "Sunshine Behavioral Health",
  },
];

export const getClientById = (id: string): ClientInfo | undefined => {
  return mockClients.find((client) => client.id === id);
};

export const mockProgramOptions = [
  { id: "p1", name: "Communication Training" },
  { id: "p2", name: "Social Skills Development" },
  { id: "p3", name: "Self-Regulation Techniques" },
  { id: "p4", name: "Attention Building" },
  { id: "p5", name: "Independent Play Training" },
  { id: "p6", name: "Instruction Following" },
  { id: "p7", name: "Language Acquisition" },
  { id: "p8", name: "Fine Motor Development" },
  { id: "p9", name: "Self-Help Skills" },
];

export const mockBehaviorOptions = [
  { id: "b1", name: "Hand flapping" },
  { id: "b2", name: "Verbal outbursts" },
  { id: "b3", name: "Task avoidance" },
  { id: "b4", name: "Self-stimulatory behavior" },
  { id: "b5", name: "Elopement" },
  { id: "b6", name: "Refusal behaviors" },
  { id: "b7", name: "Tantrums" },
  { id: "b8", name: "Repetitive questioning" },
  { id: "b9", name: "Food selectivity" },
];

export const mockReinforcerOptions = [
  { id: "r1", type: "Primary", name: "Preferred snack" },
  { id: "r2", type: "Primary", name: "Favorite toy" },
  { id: "r3", type: "Secondary", name: "Praise" },
  { id: "r4", type: "Secondary", name: "Token system" },
  { id: "r5", type: "Primary", name: "Sensory stimulation" },
  { id: "r6", type: "Secondary", name: "Special activity" },
];
