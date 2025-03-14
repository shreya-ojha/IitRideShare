import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  studentId: text("student_id").notNull(),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  availableSeats: integer("available_seats").notNull(),
  costPerSeat: integer("cost_per_seat").notNull(),
  status: text("status").notNull().default("active"),
});

export const rideRequests = pgTable("ride_requests", {
  id: serial("id").primaryKey(),
  rideId: integer("ride_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  studentId: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  studentId: z.string().regex(/^\d{8}$/, "Student ID must be 8 digits"),
});

export const insertRideSchema = createInsertSchema(rides).pick({
  source: true,
  destination: true,
  departureTime: true,
  availableSeats: true,
  costPerSeat: true,
}).extend({
  availableSeats: z.number().min(1).max(4),
  costPerSeat: z.number().min(10),
});

export const insertRideRequestSchema = createInsertSchema(rideRequests).pick({
  rideId: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type RideRequest = typeof rideRequests.$inferSelect;
export type InsertRideRequest = z.infer<typeof insertRideRequestSchema>;
