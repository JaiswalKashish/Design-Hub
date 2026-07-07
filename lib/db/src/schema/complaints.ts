import { pgTable, text, serial, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const complaintStatusEnum = pgEnum("complaint_status", [
  "pending",
  "assigned",
  "in_progress",
  "resolved",
]);

export const complaintsTable = pgTable("complaints", {
  id: serial("id").primaryKey(),
  complaintId: text("complaint_id").notNull().unique(),
  userId: text("user_id").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  status: complaintStatusEnum("status").notNull().default("pending"),
  location: text("location"),
  imageUrl: text("image_url"),
  department: text("department"),
  priority: text("priority"),
  severity: text("severity"),
  officerName: text("officer_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const complaintTimelineTable = pgTable("complaint_timeline", {
  id: serial("id").primaryKey(),
  complaintDbId: integer("complaint_db_id").notNull(),
  status: text("status").notNull(),
  note: text("note"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaintsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaintsTable.$inferSelect;

export const insertTimelineSchema = createInsertSchema(complaintTimelineTable).omit({ id: true, timestamp: true });
export type InsertTimeline = z.infer<typeof insertTimelineSchema>;
export type ComplaintTimeline = typeof complaintTimelineTable.$inferSelect;
