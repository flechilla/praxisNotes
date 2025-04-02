# PraxisNotes Database Package

This package provides the database infrastructure for the PraxisNotes application using Drizzle ORM with PostgreSQL and Supabase.

## Features

- Schema definitions using Drizzle ORM
- Type-safe database operations
- Migration management
- Seeding utilities for development

## Setup

1. Create a `.env` file in the packages/database directory with the following content:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/praxisnotes"
NODE_ENV="development"
```

2. Replace the `DATABASE_URL` with your actual PostgreSQL connection string or Supabase connection string.

## Usage

### Building the package

```
npm run build
```

### Running migrations

```
npm run migrate
```

### Seeding the database (for development)

```
npm run seed
```

## Database Schema

### Entities

1. **Organization**

   - Properties: id, name, slug, description, logoUrl
   - Relationships: Has many Users, Has many Clients

2. **User**

   - Properties: id, email, firstName, lastName, fullName, avatarUrl, authProvider, ...
   - Relationships: Belongs to one or more Organizations, Has one or more Roles, Has many Clients

3. **Role**

   - Properties: id, name, description
   - Relationships: Belongs to many Users

4. **Client**
   - Properties: id, name, email, phone, address, notes
   - Relationships: Belongs to one Organization, Belongs to one or more Users

### Relationship Tables

1. **organization_users** - Many-to-many relationship between Organizations and Users
2. **user_roles** - Many-to-many relationship between Users and Roles
3. **user_clients** - Many-to-many relationship between Users and Clients

## Using the Database in Other Packages

```typescript
import { db } from "@praxisnotes/database";
import { users, organizations } from "@praxisnotes/database/schema";

// Query example
const result = await db.query.users.findMany({
  where: (user, { eq }) => eq(user.isActive, true),
  with: {
    organizations: true,
    roles: true,
  },
});
```

## PostgreSQL Enum Types

When working with PostgreSQL enums in Drizzle, follow these guidelines to ensure proper migration generation:

1. Define enum types in the `/src/enums` directory using the `pgEnum` utility from Drizzle:

```typescript
// Example: src/enums/intensity-level.enum.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const intensityLevelEnum = pgEnum("intensity_level", [
  "1 - mild",
  "2 - moderate",
  "3 - significant",
  "4 - severe",
  "5 - extreme",
]);

// Add any helper types, constants, etc.
```

2. Export all enums from the `/src/enums/index.ts` file:

```typescript
// src/enums/index.ts
export * from "./intensity-level.enum";
export * from "./attention-level.enum";
// Export other enums...
```

3. Import the enums in your schema tables:

```typescript
import { intensityLevelEnum } from "../enums/intensity-level.enum";

export const myTable = pgTable("my_table", {
  // ...
  intensity: intensityLevelEnum("intensity"),
  // ...
});
```

4. Ensure the Drizzle config includes both schema and enum directories:

```typescript
// drizzle.config.ts
export default defineConfig({
  schema: ["./src/schema/*", "./src/enums/*"],
  // ...
});
```

5. Generate migrations:

```bash
npm run generate
```

This configuration ensures that enum types are properly defined before they are referenced in table definitions, avoiding the "type does not exist" errors during migration.
