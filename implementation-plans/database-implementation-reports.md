# Database Implementation Plan - Reports Extension

## Feature Overview

This implementation plan extends the original database architecture to include support for the Report Management System within the PraxisNotes application. It will provide data structures for storing, retrieving, and managing reports created by RBTs (Registered Behavior Technicians) during therapy sessions.

## Architecture Overview

Building upon the existing database layer, this extension will add:

1. Report-specific schema definitions
2. Types for sessions, reports, and their related entities
3. Relationship mappings between users, clients, and reports
4. Support for both legacy and activity-based reporting formats

### System Architecture Diagram

```
┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │
│ Session Management  │    │  Report Generation  │
│                     │    │                     │
└──────────┬──────────┘    └──────────┬──────────┘
           │                          │
           │                          │
           ▼                          ▼
┌────────────────────────────────────────────────┐
│                                                │
│               Database Layer                   │
│                                                │
│  ┌─────────────┐       ┌─────────────────┐     │
│  │ Core Entity │       │ Report Schemas  │     │
│  │   Schemas   │       │ & Relationships │     │
│  └─────────────┘       └─────────────────┘     │
│                                                │
└────────────────────────┬───────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │                 │
                │ PostgreSQL      │
                │ Database        │
                │                 │
                └─────────────────┘
```

## Key Components and Modules

### 1. Report Schema Definitions

- `report.table.ts` - Core report entity
- `session.table.ts` - Therapy session data
- `skill_tracking.table.ts` - Skill acquisition tracking
- `behavior_tracking.table.ts` - Client behavior tracking
- `reinforcement.table.ts` - Reinforcement methods used
- `activity.table.ts` - Activities performed in sessions (for activity-based format)
- `activity_behavior.table.ts` - Behaviors observed during activities
- `activity_prompt.table.ts` - Prompts used during activities
- `report_section.table.ts` - Sections of a structured report

### 2. Entity Relationships

- Reports belong to a User (RBT) and a Client
- Sessions belong to a Client
- Activities belong to a Session
- Behaviors belong to a Client and can be tracked in Sessions/Activities
- Skills belong to a Client and are tracked in Sessions

## Implementation Details

### Entity Relationships

1. **Report**

   - Belongs to one User (RBT)
   - Belongs to one Client
   - Associated with one Session

2. **Session**

   - Belongs to one Client
   - Has one Report
   - Has many Activities (activity-based approach)
   - Has many Skill Trackings
   - Has many Behavior Trackings
   - Has many Reinforcements

3. **Activity**

   - Belongs to one Session
   - Has many Activity Behaviors
   - Has many Activity Prompts
   - Has one ActivityReinforcement

4. **Behavior**

   - Belongs to one Client
   - Can be tracked in multiple Sessions

5. **Skill**
   - Belongs to one Client
   - Can be tracked in multiple Sessions

### Schema Definitions

#### 1. `session.table.ts`

```typescript
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sessionDate: timestamp("session_date").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  isActivityBased: boolean("is_activity_based").default(false).notNull(),
  status: varchar("status", { length: 50 }).default("draft").notNull(), // draft, submitted, reviewed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 2. `report.table.ts`

```typescript
export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  summary: text("summary"),
  fullContent: text("full_content").notNull(),
  status: varchar("status", { length: 50 }).default("draft").notNull(), // draft, submitted, reviewed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 3. `report_section.table.ts`

```typescript
export const reportSections = pgTable("report_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .references(() => reports.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 4. `skill_tracking.table.ts`

```typescript
export const skillTrackings = pgTable("skill_trackings", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  program: varchar("program", { length: 255 }).notNull(),
  promptLevel: varchar("prompt_level", { length: 100 }),
  trials: integer("trials").default(0),
  mastery: integer("mastery").default(0),
  correct: integer("correct").default(0),
  prompted: integer("prompted").default(0),
  incorrect: integer("incorrect").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 5. `behavior_tracking.table.ts`

```typescript
export const behaviorTrackings = pgTable("behavior_trackings", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  definition: text("definition"),
  frequency: integer("frequency").default(0),
  duration: integer("duration").default(0), // in minutes or seconds
  intensity: varchar("intensity", { length: 100 }),
  antecedent: text("antecedent"),
  consequence: text("consequence"),
  intervention: text("intervention"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 6. `reinforcement.table.ts`

```typescript
export const reinforcements = pgTable("reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  effectiveness: varchar("effectiveness", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 7. `activity.table.ts`

```typescript
export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  goal: varchar("goal", { length: 255 }),
  location: varchar("location", { length: 255 }),
  duration: integer("duration"), // in minutes
  completed: boolean("completed").default(false).notNull(),
  completionNotes: text("completion_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 8. `activity_behavior.table.ts`

```typescript
export const activityBehaviors = pgTable("activity_behaviors", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  behaviorName: varchar("behavior_name", { length: 255 }).notNull(),
  definition: text("definition"),
  intensity: varchar("intensity", { length: 100 }),
  interventionUsed: text("intervention_used"), // stored as JSON string
  interventionNotes: text("intervention_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 9. `activity_prompt.table.ts`

```typescript
export const activityPrompts = pgTable("activity_prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  count: integer("count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 10. `activity_reinforcement.table.ts`

```typescript
export const activityReinforcements = pgTable("activity_reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  reinforcerName: varchar("reinforcer_name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 11. `initial_status.table.ts`

```typescript
export const initialStatuses = pgTable("initial_statuses", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  clientStatus: text("client_status"),
  caregiverReport: text("caregiver_report"),
  initialResponse: text("initial_response"),
  medicationChanges: text("medication_changes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### 12. `general_notes.table.ts`

```typescript
export const generalNotes = pgTable("general_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  sessionNotes: text("session_notes"),
  caregiverFeedback: text("caregiver_feedback"),
  environmentalFactors: text("environmental_factors"),
  nextSessionFocus: text("next_session_focus"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

## Code Structure

```
packages/
  database/
    src/
      schema/
        # Core entities (from previous plan)
        organization.table.ts
        user.table.ts
        role.table.ts
        client.table.ts

        # Relationships (from previous plan)
        organization_user.table.ts
        user_role.table.ts
        user_client.table.ts

        # Report-related entities
        session.table.ts
        report.table.ts
        report_section.table.ts
        skill_tracking.table.ts
        behavior_tracking.table.ts
        reinforcement.table.ts
        activity.table.ts
        activity_behavior.table.ts
        activity_prompt.table.ts
        activity_reinforcement.table.ts
        initial_status.table.ts
        general_notes.table.ts
```

## Integration Strategy

### Phase 1: Schema Implementation

1. Implement the table schema definitions
2. Create migration scripts
3. Add types and relationships

### Phase 2: API Integration

1. Create API endpoints for session CRUD operations
2. Create API endpoints for report generation and management
3. Implement service layer functions for data access

### Phase 3: Client-side Integration

1. Connect form submission to the database
2. Add report listing and viewing functionality
3. Implement report editing and management features

## Implementation Checklist

1. [x] Define Report and Session related types in a dedicated types directory
2. [x] Implement session.table.ts schema
3. [x] Implement report.table.ts schema
4. [x] Implement report_section.table.ts schema
5. [x] Implement skill_tracking.table.ts schema
6. [x] Implement behavior_tracking.table.ts schema
7. [x] Implement reinforcement.table.ts schema
8. [x] Implement activity.table.ts schema
9. [x] Implement activity_behavior.table.ts schema
10. [x] Implement activity_prompt.table.ts schema
11. [x] Implement activity_reinforcement.table.ts schema
12. [x] Implement initial_status.table.ts schema
13. [x] Implement general_notes.table.ts schema
14. [x] Update database index.ts to export all new schemas
15. [ ] Create migration script for report-related tables
16. [ ] Update seed script to include sample session and report data
17. [ ] Create API endpoints for session management
18. [ ] Create API endpoints for report management
19. [ ] Implement client-side integration for session form submission
20. [ ] Implement client-side integration for report generation and display
