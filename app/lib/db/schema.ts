import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const financeProfiles = sqliteTable("finance_profiles", {
  userId: text("user_id").primaryKey(),
  payload: text("payload").notNull(),
  updatedAtMs: integer("updated_at_ms").notNull(),
});
