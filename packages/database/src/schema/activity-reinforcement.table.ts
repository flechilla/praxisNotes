import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { activities } from "./activity.table";
import { reinforcements } from "./reinforcement.table";
import { reinforcementEffectivenessEnum } from "./reinforcement.table";

/**
 * Activity reinforcement association table schema
 * Links activities with reinforcements and tracks their usage and effectiveness
 */
export const activityReinforcements = pgTable("activity_reinforcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .references(() => activities.id, { onDelete: "cascade" })
    .notNull(),
  reinforcementId: uuid("reinforcement_id")
    .references(() => reinforcements.id, { onDelete: "cascade" })
    .notNull(),
  effectiveness: reinforcementEffectivenessEnum("effectiveness"),
  frequency: integer("frequency").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Define activity reinforcement association relations
 */
export const activityReinforcementAssociationsRelations = relations(
  activityReinforcements,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityReinforcements.activityId],
      references: [activities.id],
    }),
    reinforcement: one(reinforcements, {
      fields: [activityReinforcements.reinforcementId],
      references: [reinforcements.id],
    }),
  }),
);

// Types derived from the schema
export type ActivityReinforcementAssociation =
  typeof activityReinforcements.$inferSelect;
export type ActivityReinforcementAssociationInsert =
  typeof activityReinforcements.$inferInsert;

// Zod schemas for validation
export const insertActivityReinforcementAssociationSchema = createInsertSchema(
  activityReinforcements,
);

export const selectActivityReinforcementAssociationSchema = createSelectSchema(
  activityReinforcements,
);
