# Strict Type Definitions and Consistency Implementation Plan

## Overview

This document outlines the implementation plan for improving type definitions and consistency across the PraxisNotes project. The goal is to consolidate type definitions, ensure proper type safety, and establish consistent patterns for type definitions.

## Current State Analysis

The project currently has type definitions split between multiple locations:

1. **Shared Types Package**: `packages/types/src/` with domain-specific subdirectories
2. **Web App Local Types**: `apps/web/lib/types/` with application-specific types
3. **Database Types**: `packages/database/src/schema/` with table definitions and related types

Issues identified:

- Inconsistent use of `type` vs `interface` (e.g., NextAuth interfaces)
- Usage of `any` types that reduce type safety (e.g., in `client.service.ts`)
- Duplicated types (e.g., `DBClient` in web app and `Client` in database package)
- Inconsistent naming conventions (e.g., `DBClient` vs more standardized names)
- Some types lack proper JSDoc documentation

## Implementation Plan

### 1. Audit Type Definitions

- [x] Identify all locations containing type definitions
- [x] Identify instances of `interface` that should be converted to `type`
  - NextAuth interfaces in `apps/web/lib/types/next-auth.ts`
- [x] Identify any `any` types that need proper typing
  - `any` types in `client.service.ts`, `reinforcersApi.ts`, `behaviorsApi.ts`
- [x] Identify duplicated or similar type definitions
  - Compare `DBClient` with database `Client` type
  - Review other potential duplications across packages

### 2. Consolidate Client-Related Types

- [x] Create a `client` directory in `packages/types/src/`
- [x] Create a proper client type definition in `packages/types/src/client/client.type.ts`
- [x] Export the type from the barrel file
- [x] Update imports in the web app to use the shared types

### 3. Standardize NextAuth Types

- [x] Keep interfaces in `next-auth.ts` since they're extending the module declarations
- [x] Improve documentation for NextAuth types
- [x] Verify consistency with other auth-related code

### 4. Replace `any` Types in Services and APIs

- [x] Fix `client.service.ts` by replacing `any` types with proper types
- [x] Fix `reinforcersApi.ts` by using proper reinforcement type
- [x] Fix `behaviorsApi.ts` by using proper behavior type

### 5. Create Type Utilities for Common Patterns

- [x] Create `packages/types/src/common/api.type.ts` for API-related utility types
- [x] Create `packages/types/src/common/form.type.ts` for form-related utility types
- [x] Add pagination, filtering, and sorting utility types

## Specific Files Modified

### Shared Types Package

- [x] Create: `packages/types/src/client/client.type.ts`
- [x] Update: `packages/types/src/index.ts` to export new types
- [x] Create: `packages/types/src/common/api.type.ts` for API utilities
- [x] Create: `packages/types/src/common/form.type.ts` for form utilities
- [x] Create: `packages/types/src/behavior/behavior.type.ts` for behavior types
- [x] Create: `packages/types/src/reinforcement/reinforcement.type.ts` for reinforcement types

### Web App

- [x] Update: `apps/web/lib/types/Client.ts` to import from shared package
- [x] Fix: `apps/web/lib/services/client.service.ts` to replace `any` types
- [x] Fix: `apps/web/lib/api/reinforcersApi.ts` to replace `any` types
- [x] Fix: `apps/web/lib/api/behaviorsApi.ts` to replace `any` types
- [x] Improve: `apps/web/lib/types/next-auth.ts` with better documentation

### Database Package

- [ ] Ensure types from `packages/database/src/schema/*.table.ts` are properly exported
- [ ] Consider creating type index exports for database entities

## Testing Strategy

- [ ] Verify type checking with `tsc --noEmit`
- [ ] Ensure all imports resolve correctly
- [ ] Validate consistent usage in components and services

## Next Steps

The major improvements have been completed, but some additional steps could further enhance type safety:

1. Add more specific utility types for forms, API responses, and other common patterns
2. Create a comprehensive index of all available types for developer reference
3. Add stronger validation at API boundaries using Zod or similar validation libraries
4. Consider generating types from database schema to ensure consistency

## Completion Criteria

- [x] All shared types are consolidated in the `@praxisnotes/types` package
- [x] No usage of `interface` except where declaration merging is needed (NextAuth)
- [x] No usage of `any` types in the codebase
- [x] All type definitions have proper JSDoc documentation
- [x] Consistent naming conventions across all type definitions
- [ ] Type errors resolved across the project
