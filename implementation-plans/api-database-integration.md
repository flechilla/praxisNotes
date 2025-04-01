# API Database Integration Implementation Plan

## Overview

This implementation plan outlines the steps needed to integrate the existing API routes with the database layer. The goal is to move from static/in-memory data to persistent storage using the database package.

## Current State Analysis

### Database Package (`packages/database`)

- Uses Drizzle ORM for database operations
- Has defined schemas and migrations
- Provides client configuration for database connections
- Includes type definitions for database models

### API Routes (`apps/web/app/api`)

Current API endpoints:

- `/api/behaviors`
- `/api/options`
- `/api/report`
- `/api/skills`
- `/api/generate` - For saving and managing report generation data

### New Packages to Create

#### Types Package (`packages/types`)

- Shared type definitions across the monorepo
- One type per file structure
- Clear organization by domain
- No business logic, only type definitions

#### Cache Package (`packages/cache`)

- Wrapper around Upstash Redis
- Provides type-safe caching operations
- Configurable TTL and cache strategies
- Monitoring and error handling

## Implementation Tasks

### 1. Create Shared Types Package

- [x] Create new package `packages/types`
  - [x] Set up TypeScript configuration
  - [x] Create directory structure by domain
  - [x] Add package to workspace
- [x] Create type definitions:
  - [x] `src/behavior/behavior.type.ts`
  - [x] `src/options/option.type.ts`
  - [x] `src/report/report.type.ts`
  - [x] `src/skills/skill.type.ts`
  - [x] `src/generate/generate.type.ts`
  - [x] `src/common/response.type.ts`
  - [x] `src/common/error.type.ts`

### 2. Create Cache Package

- [x] Create new package `packages/cache`
  - [x] Set up TypeScript configuration
  - [x] Add Upstash Redis dependency (https://www.npmjs.com/package/@upstash/redis)
  - [x] Add package to workspace
- [x] Implement cache service:
  - [x] Create Redis client configuration
  - [x] Implement type-safe cache operations
  - [x] Add error handling and retries
  - [x] Add monitoring and logging
  - [x] Create cache key management
- [x] Create cache strategies:
  - [x] Time-based expiration
  - [ ] LRU cache implementation
  - [ ] Cache invalidation patterns
  - [ ] Bulk operations support

### 3. Database Client Integration

- [x] Create a shared database client utility in `apps/web/lib/db.ts`
  - [x] Import and configure the database client from `@praxisnotes/database`
  - [x] Implement connection pooling for better performance
  - [x] Add error handling and connection management

### 4. API Route Updates

#### Behaviors API

- [ ] Update `apps/web/app/api/behaviors/route.ts`
  - [ ] Replace static data with database queries
  - [ ] Implement proper error handling
  - [ ] Add validation for input data
  - [ ] Update response types

#### Options API

- [ ] Update `apps/web/app/api/options/route.ts`
  - [ ] Integrate database queries
  - [ ] Add caching layer for frequently accessed options
  - [ ] Implement error handling
  - [ ] Update response types

#### Report API

- [ ] Update `apps/web/app/api/report/route.ts`
  - [ ] Implement database operations for report data
  - [ ] Add transaction support for multi-step operations
  - [ ] Update error handling
  - [ ] Update response types

#### Skills API

- [ ] Update `apps/web/app/api/skills/route.ts`
  - [ ] Replace static data with database queries
  - [ ] Add proper error handling
  - [ ] Implement data validation
  - [ ] Update response types

#### Generate API

- [ ] Update `apps/web/app/api/generate/route.ts`
  - [ ] Implement database operations for storing generation data
  - [ ] Save user inputs and form configurations
  - [ ] Store generated report data and metadata
  - [ ] Add timestamps for tracking generation history
  - [ ] Implement proper error handling
  - [ ] Add validation for input data
  - [ ] Update response types
  - [ ] Add support for retrieving generation history
  - [ ] Implement cleanup/archival strategy for old generation data

### 5. Error Handling & Middleware

- [x] Create shared error handling utilities in `apps/web/lib/errors.ts`
- [ ] Implement middleware for:
  - [ ] Request validation
  - [ ] Error transformation
  - [ ] Response formatting

### 6. Documentation

- [ ] Update API documentation with new database-backed endpoints
- [ ] Document error codes and handling
- [ ] Add examples for common operations

## Files to Create/Modify

### New Packages

#### Types Package

- [x] New: `packages/types/package.json`
- [x] New: `packages/types/tsconfig.json`
- [x] New: `packages/types/src/behavior/behavior.type.ts`
- [x] New: `packages/types/src/options/option.type.ts`
- [x] New: `packages/types/src/report/report.type.ts`
- [x] New: `packages/types/src/skills/skill.type.ts`
- [x] New: `packages/types/src/generate/generate.type.ts`
- [x] New: `packages/types/src/common/response.type.ts`
- [x] New: `packages/types/src/common/error.type.ts`
- [x] New: `packages/types/src/index.ts`

#### Cache Package

- [x] New: `packages/cache/package.json`
- [x] New: `packages/cache/tsconfig.json`
- [x] New: `packages/cache/src/client.ts`
- [x] New: `packages/cache/src/strategies/index.ts`
- [x] New: `packages/cache/src/strategies/time-based.ts`
- [ ] New: `packages/cache/src/strategies/lru.ts`
- [x] New: `packages/cache/src/utils/key-manager.ts`
- [ ] New: `packages/cache/src/monitoring/index.ts`
- [x] New: `packages/cache/src/index.ts`

### API Routes

- [ ] Modify: `apps/web/app/api/behaviors/route.ts`

  - Purpose: Update to use database operations
  - Changes: Replace static data with database queries

- [ ] Modify: `apps/web/app/api/options/route.ts`

  - Purpose: Integrate database layer
  - Changes: Add database operations and caching

- [ ] Modify: `apps/web/app/api/report/route.ts`

  - Purpose: Add database persistence
  - Changes: Implement database operations for reports

- [ ] Modify: `apps/web/app/api/skills/route.ts`

  - Purpose: Update to use database
  - Changes: Replace static data with database queries

- [ ] Modify: `apps/web/app/api/generate/route.ts`
  - Purpose: Store and manage report generation data
  - Changes:
    - Implement database operations for generation data
    - Add generation history tracking
    - Include metadata storage
    - Add data cleanup strategies

### Utilities and Types

- [x] New: `apps/web/lib/errors.ts`

  - Purpose: Shared error handling
  - Changes: Create new file for error utilities

- [x] New: `apps/web/lib/db.ts`
  - Purpose: Database client utility
  - Changes: Create database connection and error handling

## Implementation Strategy

1. Create and publish shared types package ✅
2. Create and publish cache package ✅
3. Start with the generate API as the first priority
4. Create and test the database client utility ✅
5. Implement the basic error handling utilities ✅
6. Gradually update each API endpoint
7. Add tests for each component
8. Document changes and update API documentation

## Success Criteria

1. All API endpoints successfully use the database layer
2. Proper error handling and validation in place
3. Tests passing with good coverage
4. Documentation updated and accurate
5. No TypeScript any types used
6. All builds passing with `npm run validate` and `npm run build`
7. Generation data successfully persisted and retrievable
8. Generation history properly tracked with timestamps
9. Efficient cleanup strategy for old generation data
10. Types package successfully shared across all packages
11. Cache operations working efficiently with Upstash Redis
12. Type safety maintained across all packages

## Dependencies

- @praxisnotes/database package
- @praxisnotes/types package (new) ✅
- @praxisnotes/cache package (new) ✅
- @upstash/redis
- Next.js API routes
- TypeScript configuration
- Testing framework

## Notes

- Ensure backward compatibility during the transition
- Consider implementing feature flags for gradual rollout
- Monitor performance impacts and optimize as needed
- Follow the project's TypeScript guidelines strictly
- Implement data retention policies for generated reports
- Consider implementing analytics for generation patterns
- Add monitoring for generation performance and storage usage
- Implement proper cache invalidation strategies
- Monitor Redis memory usage and performance
- Consider implementing cache warming strategies
- Use proper TypeScript path aliases for improved imports
