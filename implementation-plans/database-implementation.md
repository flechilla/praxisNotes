# Database Implementation Plan

## Feature Overview

This implementation plan outlines the database architecture for the project using Drizzle ORM with PostgreSQL and Supabase. The database will manage organizations, users, roles, and clients while maintaining appropriate relationships between these entities.

## Architecture Overview

The database layer will be implemented as a shared package within the monorepo structure. It will provide:

1. Schema definitions for all entities
2. Type definitions derived from the schema
3. Query builders and helpers
4. Migration management
5. Integration with Supabase

### System Architecture Diagram

```
┌────────────────────┐     ┌────────────────────┐
│                    │     │                    │
│    Web App         │     │    Other Apps      │
│                    │     │                    │
└─────────┬──────────┘     └──────────┬─────────┘
          │                           │
          │                           │
          ▼                           ▼
┌──────────────────────────────────────────────┐
│                                              │
│           Database Package                   │
│                                              │
│  ┌─────────────┐      ┌──────────────────┐   │
│  │ Schema      │      │ Query Builders   │   │
│  │ Definitions │      │ & Helpers        │   │
│  └─────────────┘      └──────────────────┘   │
│                                              │
│  ┌─────────────┐      ┌──────────────────┐   │
│  │ Migrations  │      │ Supabase Client  │   │
│  │             │      │ Integration      │   │
│  └─────────────┘      └──────────────────┘   │
│                                              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │                        │
          │  PostgreSQL Database   │
          │  (Supabase)            │
          │                        │
          └────────────────────────┘
```

## Key Components and Modules

### 1. Schema Definitions

- Entity-specific schema files following the pattern `<entity-name>.table.ts`
- Core entities include: Organization, User, Role, Client, and their relationships

### 2. Database Client

- Configuration for Supabase and Drizzle
- Connection management

### 3. Migration System

- Version-controlled schema changes
- Automated migration scripts

### 4. Query Helpers

- Reusable queries for common operations
- Type-safe query building

## Implementation Details

### Entity Relationships

1. **Organization**
   - Has many Users
   - Has many Clients
2. **User**
   - Belongs to one or more Organizations
   - Has one or more Roles
   - Has many Clients
3. **Role**
   - Belongs to many Users
4. **Client**
   - Belongs to one Organization
   - Belongs to one or more Users

### Schema Definitions

We will implement the following schema definition files:

1. **organization.table.ts** - Define organization entity
2. **user.table.ts** - Define user entity
3. **role.table.ts** - Define role entity
4. **client.table.ts** - Define client entity
5. **organization_user.table.ts** - Define many-to-many relationship between organizations and users
6. **user_role.table.ts** - Define many-to-many relationship between users and roles
7. **user_client.table.ts** - Define many-to-many relationship between users and clients

### Code Structure

```
packages/
  database/
    package.json
    drizzle.config.ts
    src/
      index.ts                  # Main export file
      client.ts                 # Database client setup
      schema/                   # Schema definitions
        organization.table.ts
        user.table.ts
        role.table.ts
        client.table.ts
        organization_user.table.ts
        user_role.table.ts
        user_client.table.ts
        index.ts                # Export all schemas
      migrations/               # Generated migrations
      seed/                     # Seed data for development
```

## Code Samples

### Sample: organization.table.ts

```typescript
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

// Zod schemas for validation
export const insertOrganizationSchema = createInsertSchema(organizations);
export const selectOrganizationSchema = createSelectSchema(organizations);
```

### Sample: client.ts

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection string from environment variables
const connectionString = process.env.DATABASE_URL;

// For query execution
export const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// For migrations
export const runMigrations = async () => {
  const migrationClient = postgres(connectionString, { max: 1 });
  const migrationDb = drizzle(migrationClient);

  await migrate(migrationDb, { migrationsFolder: "./migrations" });
  await migrationClient.end();

  console.log("Migrations completed");
};
```

## Integration and Testing Strategy

### Integration

1. Create a new package in the monorepo for the database layer
2. Add necessary dependencies (drizzle-orm, postgres, etc.)
3. Implement schema definitions and database client
4. Set up migrations system
5. Create seed data for development

### Testing

1. Unit tests for schema definitions and relationships
2. Integration tests for database queries
3. End-to-end tests for database operations in the context of the application

## Impact on Existing Architecture

This implementation will introduce a new shared package for database operations. The web application and any other services will use this package to interact with the database, ensuring consistency in data access patterns.

## Future Considerations

1. **Caching Layer**: Consider adding Redis for caching frequently accessed data
2. **Data Validation**: Enhance validation with Zod schemas for all database operations
3. **Audit Logging**: Implement audit logging for sensitive database operations
4. **Performance Optimization**: Add indexes and query optimization as the application scales
5. **Sharding Strategy**: Consider sharding strategy for when data grows significantly

## Implementation Checklist

1. [x] Set up database package structure
2. [x] Add required dependencies (drizzle-orm, postgres, etc.)
3. [x] Configure Supabase connection
4. [x] Implement schema definitions for all entities
5. [x] Set up migration system
6. [x] Create seed data for development
7. [x] Implement query helpers
8. [x] Write documentation for database usage
9. [ ] Set up unit and integration tests
10. [ ] Configure CI/CD for database migrations
