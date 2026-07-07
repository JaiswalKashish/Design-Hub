import { Router } from "express";
import { db } from "@workspace/db";
import { userProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateUserProfileBody } from "@workspace/api-zod";

const router = Router();

// GET /api/profile/:userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  let [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId));

  if (!profile) {
    // Auto-create a default profile
    [profile] = await db
      .insert(userProfilesTable)
      .values({
        userId,
        name: "User",
        email: `${userId}@example.com`,
        language: "en",
        darkMode: false,
        notifications: true,
      })
      .returning();
  }

  return res.json({
    userId: profile.userId,
    name: profile.name,
    email: profile.email,
    photoUrl: profile.photoUrl ?? null,
    language: profile.language,
    state: profile.state ?? null,
    darkMode: profile.darkMode,
    notifications: profile.notifications,
  });
});

// PATCH /api/profile/:userId
router.patch("/:userId", async (req, res) => {
  const { userId } = req.params;
  const parse = UpdateUserProfileBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const data = parse.data;

  const updateData: Partial<typeof userProfilesTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.language !== undefined) updateData.language = data.language;
  if (data.state !== undefined) updateData.state = data.state;
  if (data.darkMode !== undefined) updateData.darkMode = data.darkMode;
  if (data.notifications !== undefined) updateData.notifications = data.notifications;

  let [profile] = await db
    .update(userProfilesTable)
    .set(updateData)
    .where(eq(userProfilesTable.userId, userId))
    .returning();

  if (!profile) {
    // Create if not exists
    [profile] = await db
      .insert(userProfilesTable)
      .values({ userId, name: data.name || "User", email: `${userId}@example.com`, ...updateData })
      .returning();
  }

  return res.json({
    userId: profile.userId,
    name: profile.name,
    email: profile.email,
    photoUrl: profile.photoUrl ?? null,
    language: profile.language,
    state: profile.state ?? null,
    darkMode: profile.darkMode,
    notifications: profile.notifications,
  });
});

export default router;
