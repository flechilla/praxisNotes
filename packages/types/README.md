# @praxisnotes/types

A centralized TypeScript type definitions package for the PraxisNotes application ecosystem.

## Overview

This package provides shared type definitions across all PraxisNotes applications and packages, ensuring type consistency and preventing duplication. It serves as the single source of truth for data structures and interfaces used throughout the PraxisNotes platform.

## Installation

Within the monorepo, you can reference this package in any project:

```json
{
  "dependencies": {
    "@praxisnotes/types": "*"
  }
}
```

## Package Structure

The package is organized into domain-specific directories, each containing related type definitions:

```
src/
├── activity/         # Activity-related types
├── behavior/         # Behavior types
├── client/           # Client types
├── common/           # Shared utility types
├── generate/         # Generation-related types
├── next-auth/        # Authentication types
├── options/          # Options and configuration types
├── reinforcement/    # Reinforcement types
├── report/           # Reporting types
├── session-form/     # Session form types
├── skills/           # Skills types
└── index.ts          # Main exports
```

## Usage

### Importing Types

You can import all types from the root:

```typescript
import {
  Activity,
  ApiResponse,
  Client,
  ReinforcementType,
} from "@praxisnotes/types";
```

Or import specific types from their subdirectories for more explicit imports:

```typescript
import { Activity, ActivityWithRelations } from "@praxisnotes/types/activity";
import { ApiResponse, SearchParams } from "@praxisnotes/types/common";
```

### Type Patterns

The package follows several consistent patterns:

#### Base Types

Foundational data structures that represent core entities:

```typescript
// Example of a base type
export type Activity = {
  id: string;
  name: string;
  description: string;
  // ...other properties
};
```

#### Relation Types

Types that include relationships with other entities:

```typescript
// Example of a relation type
export type ActivityWithRelations = Activity & {
  behaviors: ActivityBehavior[];
  promptsUsed: ActivityPrompt[];
  reinforcement: ActivityReinforcement[];
  skills: ActivitySkill[];
};
```

#### Create/Update Types

Types for creating or updating entities:

```typescript
// Create type
export type NewActivity = Omit<Activity, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  behaviors?: ActivityBehavior[];
  // ...other optional properties
};

// Update type
export type UpdateActivity = Partial<Omit<Activity, "id">> & {
  id: string;
  // ...other properties that can be updated
};
```

#### Form Types

Types specifically designed for form handling:

```typescript
export type ActivityForm = {
  name: string;
  description: string;
  goal: string;
  // ...other form fields
};
```

#### API Response Types

Standardized response structures for API calls:

```typescript
export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
};
```

## Best Practices

### Adding New Types

1. **Location:** Create new types in the appropriate domain-specific directory
2. **File Naming:** Use the format `feature-name.type.ts`
3. **Export:** Add exports to the directory's index.ts file
4. **Main Index:** Update the main src/index.ts to export your new types

### Type Definition Guidelines

1. **Use Type Over Interface:** Prefer `type` over `interface` for consistency
2. **Document Types:** Add JSDoc comments to explain complex types
3. **Use TypeScript Utility Types:** Leverage built-in utilities like `Omit`, `Pick`, `Partial`, etc.
4. **Keep Types Focused:** Each type should serve a specific purpose
5. **Avoid Any:** Never use the `any` type - create proper type definitions

### Example: Creating a New Type File

```typescript
/**
 * Example domain type definition
 */

// Base type
export type ExampleEntity = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

// Creation type
export type NewExampleEntity = Omit<
  ExampleEntity,
  "id" | "createdAt" | "updatedAt"
>;

// Update type
export type UpdateExampleEntity = Partial<Omit<ExampleEntity, "id">> & {
  id: string;
};

// Form type
export type ExampleEntityForm = {
  name: string;
  description: string;
};
```

## Building

The package uses `tsup` for building:

```bash
# Development with watch mode
npm run dev

# Production build
npm run build
```

## Contributing

When contributing to this package:

1. Ensure your types follow the project's naming and organization conventions
2. Add proper documentation with JSDoc comments
3. Keep imports clean and avoid circular dependencies
4. Run `npm run check-types` to verify type integrity before committing
