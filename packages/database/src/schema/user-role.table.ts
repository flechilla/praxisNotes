import { pgTable, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { roles } from "./role.table";
import { users } from "./user.table";

/**
 * User_Role table schema definition
 * Represents the many-to-many relationship between users and roles
 */
export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    roleId: uuid("role_id")
      .references(() => roles.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.roleId] }),
    };
  },
);

// Types derived from the schema
export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;

// Zod schemas for validation
export const insertUserRoleSchema = createInsertSchema(userRoles, {
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
}).omit({ createdAt: true, updatedAt: true });

export const selectUserRoleSchema = createSelectSchema(userRoles);
