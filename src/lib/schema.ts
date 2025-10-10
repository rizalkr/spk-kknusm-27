import { pgTable, text, numeric, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    profit: numeric("profit").notNull(),
    sales: numeric("sales").notNull(),
    cost: numeric("cost").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("products_user_idx").on(table.userId),
  })
);

export const weights = pgTable("weights", {
  id: text("id").primaryKey(),
  profit: numeric("profit").notNull(),
  sales: numeric("sales").notNull(),
  cost: numeric("cost").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").default("member").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

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
