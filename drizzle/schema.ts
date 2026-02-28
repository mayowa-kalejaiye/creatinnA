import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

// Users table (extended)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  phone: text("phone"),
  role: text("role").notNull(),
  createdAt: text("createdAt"),
  updatedAt: text("updatedAt"),
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

// Course table (capitalized to match existing raw SQL usage)
export const Course = sqliteTable("Course", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  price: integer("price"),
  duration: text("duration"),
  level: text("level"),
  isPublished: integer("isPublished"),
  category: text("category"),
  createdAt: text("createdAt"),
  updatedAt: text("updatedAt"),
})

// Enrollment
export const Enrollment = sqliteTable("Enrollment", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  courseId: text("courseId").notNull(),
  status: text("status").notNull(),
  progress: integer("progress"),
  enrolledAt: text("enrolledAt"),
  updatedAt: text("updatedAt"),
})

// Module and Lesson
export const Module = sqliteTable("Module", {
  id: text("id").primaryKey(),
  courseId: text("courseId").notNull(),
  title: text("title").notNull(),
  position: integer("position"),
  createdAt: text("createdAt"),
  updatedAt: text("updatedAt"),
})

export const Lesson = sqliteTable("Lesson", {
  id: text("id").primaryKey(),
  moduleId: text("moduleId").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  duration: integer("duration"),
  createdAt: text("createdAt"),
  updatedAt: text("updatedAt"),
})

// Payments
export const Payment = sqliteTable("Payment", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency"),
  status: text("status"),
  provider: text("provider"),
  providerId: text("providerId"),
  createdAt: text("createdAt"),
})

// Cohorts
export const Cohort = sqliteTable("Cohort", {
  id: text("id").primaryKey(),
  courseId: text("courseId").notNull(),
  name: text("name").notNull(),
  capacity: integer("capacity"),
  startDate: text("startDate"),
  endDate: text("endDate"),
  createdAt: text("createdAt"),
})

// Progress (per-lesson tracking)
export const Progress = sqliteTable("Progress", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  lessonId: text("lessonId").notNull(),
  completed: integer("completed").notNull(),
  watchTime: integer("watchTime"),
  createdAt: text("createdAt"),
  updatedAt: text("updatedAt"),
})
