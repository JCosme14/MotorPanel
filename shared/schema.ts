import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User settings for the dashboard
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  theme: text("theme").notNull().default("light"),
  speedUnit: text("speed_unit").notNull().default("kmh"),
  distanceUnit: text("distance_unit").notNull().default("km"),
  temperatureUnit: text("temperature_unit").notNull().default("celsius"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  userId: true,
  theme: true,
  speedUnit: true,
  distanceUnit: true,
  temperatureUnit: true,
});

// Warning notifications
export const warnings = pgTable("warnings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull().default("warning"),
  active: boolean("active").notNull().default(true),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertWarningSchema = createInsertSchema(warnings).pick({
  title: true,
  description: true,
  severity: true,
  active: true,
});

// Trip data
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  startOdometer: real("start_odometer").notNull(),
  endOdometer: real("end_odometer"),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  avgSpeed: real("avg_speed"),
  maxSpeed: real("max_speed"),
  fuelUsed: real("fuel_used"),
});

export const insertTripSchema = createInsertSchema(trips).pick({
  userId: true,
  startOdometer: true,
  endOdometer: true,
  startTime: true,
  endTime: true,
  avgSpeed: true,
  maxSpeed: true,
  fuelUsed: true,
});

// Type exports
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type InsertWarning = z.infer<typeof insertWarningSchema>;
export type Warning = typeof warnings.$inferSelect;

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;
