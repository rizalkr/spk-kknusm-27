import { pgTable, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  profit: numeric("profit").notNull(),
  sales: numeric("sales").notNull(),
  cost: numeric("cost").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const weights = pgTable("weights", {
  id: text("id").primaryKey(),
  profit: numeric("profit").notNull(),
  sales: numeric("sales").notNull(),
  cost: numeric("cost").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ProductRow = typeof products.$inferSelect;
export type InsertProductRow = typeof products.$inferInsert;

export type WeightRow = typeof weights.$inferSelect;
export type InsertWeightRow = typeof weights.$inferInsert;

export type UserRow = typeof users.$inferSelect;
export type InsertUserRow = typeof users.$inferInsert;

export const DEFAULT_WEIGHTS_ID = "default";
export const DEFAULT_WEIGHTS = {
  profit: 40,
  sales: 40,
  cost: 20,
} as const;
