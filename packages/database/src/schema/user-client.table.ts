import { pgTable, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { clients } from "./client.table";
import { users } from "./user.table";

/**
 * User_Client table schema definition
 * Represents the many-to-many relationship between users and clients
 */
export const userClients = pgTable(
  "user_clients",
  {
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    clientId: uuid("client_id")
      .references(() => clients.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.clientId] }),
    };
  },
);

// Types derived from the schema
export type UserClient = typeof userClients.$inferSelect;
export type NewUserClient = typeof userClients.$inferInsert;

// Zod schemas for validation
export const insertUserClientSchema = createInsertSchema(userClients, {
  userId: z.string().uuid(),
  clientId: z.string().uuid(),
}).omit({ createdAt: true, updatedAt: true });

export const selectUserClientSchema = createSelectSchema(userClients);

/**
 * Define user-client relations
 */
export const userClientsRelations = relations(userClients, ({ one }) => ({
  user: one(users, {
    fields: [userClients.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [userClients.clientId],
    references: [clients.id],
  }),
}));
