import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Generated tasks from the methodology assistant.
 * Stores tasks created by the LLM based on user goals and current lifecycle stage.
 */
export const generatedTasks = mysqlTable("generatedTasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stage: varchar("stage", { length: 32 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimate: int("estimate").notNull(),
  risk: varchar("risk", { length: 32 }).notNull(),
  priority: varchar("priority", { length: 32 }).notNull(),
  userGoal: text("userGoal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GeneratedTask = typeof generatedTasks.$inferSelect;
export type InsertGeneratedTask = typeof generatedTasks.$inferInsert;

/**
 * Rule explanations cache.
 * Stores LLM-generated explanations for methodology rules to reduce API calls.
 */
export const ruleExplanations = mysqlTable("ruleExplanations", {
  id: int("id").autoincrement().primaryKey(),
  ruleTitle: varchar("ruleTitle", { length: 128 }).notNull().unique(),
  ruleDescription: text("ruleDescription").notNull(),
  explanation: text("explanation").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RuleExplanation = typeof ruleExplanations.$inferSelect;
export type InsertRuleExplanation = typeof ruleExplanations.$inferInsert;
