import { Router } from "express";
import { db } from "@workspace/db";
import { complaintsTable, complaintTimelineTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { analyzeComplaintWithAI } from "../lib/gemini";
import {
  CreateComplaintBody,
  UpdateComplaintStatusBody,
  AnalyzeComplaintBody,
  ListComplaintsQueryParams,
} from "@workspace/api-zod";

const router = Router();

function generateComplaintId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "SB-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function getComplaintWithTimeline(complaintDbId: number) {
  const timeline = await db
    .select()
    .from(complaintTimelineTable)
    .where(eq(complaintTimelineTable.complaintDbId, complaintDbId))
    .orderBy(complaintTimelineTable.timestamp);

  return timeline.map((t) => ({
    status: t.status,
    timestamp: t.timestamp.toISOString(),
    note: t.note ?? null,
  }));
}

type TimelineItem = { status: string; timestamp: string; note: string | null };

function formatComplaint(
  c: typeof complaintsTable.$inferSelect,
  timeline: TimelineItem[]
) {
  return {
    id: String(c.id),
    complaintId: c.complaintId,
    userId: c.userId,
    category: c.category,
    description: c.description,
    status: c.status,
    location: c.location ?? null,
    imageUrl: c.imageUrl ?? null,
    department: c.department ?? null,
    priority: c.priority ?? null,
    severity: c.severity ?? null,
    officerName: c.officerName ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    timeline,
  };
}

// POST /api/complaints/analyze (must come before /:complaintId)
router.post("/analyze", async (req, res) => {
  const parse = AnalyzeComplaintBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { description, category } = parse.data;

  try {
    const analysis = await analyzeComplaintWithAI(description, category);
    return res.json(analysis);
  } catch (err) {
    req.log.error({ err }, "Complaint analysis error");
    return res.status(500).json({ error: "Failed to analyze complaint" });
  }
});

// GET /api/complaints
router.get("/", async (req, res) => {
  const parse = ListComplaintsQueryParams.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { userId, status } = parse.data;

  try {
    const conditions = [];
    if (userId) conditions.push(eq(complaintsTable.userId, userId));
    if (status)
      conditions.push(
        eq(
          complaintsTable.status,
          status as "pending" | "assigned" | "in_progress" | "resolved"
        )
      );

    const complaints = await db
      .select()
      .from(complaintsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(complaintsTable.createdAt))
      .limit(50);

    const result = await Promise.all(
      complaints.map(async (c) => {
        const timeline = await getComplaintWithTimeline(c.id);
        return formatComplaint(c, timeline);
      })
    );

    return res.json(result);
  } catch (err) {
    req.log.error({ err }, "List complaints error");
    return res.status(500).json({ error: "Failed to list complaints" });
  }
});

// POST /api/complaints
router.post("/", async (req, res) => {
  const parse = CreateComplaintBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const data = parse.data;
  const complaintId = generateComplaintId();

  try {
    const [complaint] = await db
      .insert(complaintsTable)
      .values({
        complaintId,
        userId: data.userId,
        category: data.category,
        description: data.description,
        location: data.location,
        imageUrl: data.imageUrl,
        department: data.department,
        priority: data.priority,
        severity: data.severity,
        status: "pending",
      })
      .returning();

    // Add initial timeline event
    await db.insert(complaintTimelineTable).values({
      complaintDbId: complaint.id,
      status: "pending",
      note: "Complaint submitted successfully",
    });

    const timeline = await getComplaintWithTimeline(complaint.id);
    return res.status(201).json(formatComplaint(complaint, timeline));
  } catch (err) {
    req.log.error({ err }, "Create complaint error");
    return res.status(500).json({ error: "Failed to create complaint" });
  }
});

// GET /api/complaints/:complaintId
router.get("/:complaintId", async (req, res) => {
  const { complaintId } = req.params;

  try {
    const [complaint] = await db
      .select()
      .from(complaintsTable)
      .where(eq(complaintsTable.complaintId, complaintId));

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    const timeline = await getComplaintWithTimeline(complaint.id);
    return res.json(formatComplaint(complaint, timeline));
  } catch (err) {
    req.log.error({ err }, "Get complaint error");
    return res.status(500).json({ error: "Failed to get complaint" });
  }
});

// PATCH /api/complaints/:complaintId
router.patch("/:complaintId", async (req, res) => {
  const { complaintId } = req.params;
  const parse = UpdateComplaintStatusBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { status, officerName, note } = parse.data;

  try {
    const [complaint] = await db
      .update(complaintsTable)
      .set({
        status: status as "pending" | "assigned" | "in_progress" | "resolved",
        officerName: officerName ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(complaintsTable.complaintId, complaintId))
      .returning();

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    await db.insert(complaintTimelineTable).values({
      complaintDbId: complaint.id,
      status,
      note: note ?? null,
    });

    const timeline = await getComplaintWithTimeline(complaint.id);
    return res.json(formatComplaint(complaint, timeline));
  } catch (err) {
    req.log.error({ err }, "Update complaint status error");
    return res.status(500).json({ error: "Failed to update complaint" });
  }
});

export default router;
