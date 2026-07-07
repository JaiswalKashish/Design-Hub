import { Router } from "express";
import { db } from "@workspace/db";
import { complaintsTable, complaintTimelineTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const allComplaints = await db
      .select()
      .from(complaintsTable)
      .orderBy(desc(complaintsTable.createdAt));

    const total = allComplaints.length;
    const resolved = allComplaints.filter((c) => c.status === "resolved").length;
    const pending = allComplaints.filter((c) => c.status === "pending").length;
    const assigned = allComplaints.filter((c) => c.status === "assigned").length;
    const inProgress = allComplaints.filter((c) => c.status === "in_progress").length;

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    for (const c of allComplaints) {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    }
    const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    // Recent complaints (last 10) with timelines
    const recent = allComplaints.slice(0, 10);
    const recentWithTimeline = await Promise.all(
      recent.map(async (c) => {
        const timeline = await db
          .select()
          .from(complaintTimelineTable)
          .where(eq(complaintTimelineTable.complaintDbId, c.id))
          .orderBy(complaintTimelineTable.timestamp);

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
          timeline: timeline.map((t) => ({
            status: t.status,
            timestamp: t.timestamp.toISOString(),
            note: t.note ?? null,
          })),
        };
      })
    );

    return res.json({
      totalComplaints: total,
      resolvedComplaints: resolved,
      pendingComplaints: pending,
      assignedComplaints: assigned,
      inProgressComplaints: inProgress,
      categoryBreakdown,
      recentComplaints: recentWithTimeline,
    });
  } catch (err) {
    req.log.error({ err }, "Admin stats error");
    return res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
