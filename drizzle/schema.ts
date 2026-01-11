import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

// Consolidated users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  phone: text("phone"),
  createdAt: text("createdAt"),
  updatedAt: text("updatedAt"),
  // ...any other fields
})

// Applications table
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  program: text("program").notNull(),        // intensive, mastery, alumni
  status: text("status").notNull(),          // pending, shortlisted, accepted, rejected
  experience: text("experience").notNull(),
  motivation: text("motivation").notNull(),
  // store commitment as integer 0/1 for sqlite
  commitment: integer("commitment").notNull(),
  submittedAt: text("submittedAt").notNull(),
  notes: text("notes"),
})
