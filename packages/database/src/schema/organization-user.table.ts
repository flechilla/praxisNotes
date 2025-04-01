import {
  pgTable,
  timestamp,
  uuid,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { organizations } from "./organization.table";
import { users } from "./user.table";

/**
 * Organization_User table schema definition
 * Represents the many-to-many relationship between organizations and users
 */
export const organizationUsers = pgTable(
  "organization_users",
  {
    organizationId: uuid("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.organizationId, table.userId] }),
    };
  },
);

// Types derived from the schema
export type OrganizationUser = typeof organizationUsers.$inferSelect;
export type NewOrganizationUser = typeof organizationUsers.$inferInsert;

// Zod schemas for validation
export const insertOrganizationUserSchema = createInsertSchema(
  organizationUsers,
  {
    organizationId: z.string().uuid(),
    userId: z.string().uuid(),
    isDefault: z.boolean().optional(),
  },
).omit({ createdAt: true, updatedAt: true });

export const selectOrganizationUserSchema =
  createSelectSchema(organizationUsers);
