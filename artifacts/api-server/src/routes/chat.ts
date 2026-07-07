import { Router } from "express";
import { db } from "@workspace/db";
import { chatSessionsTable, chatMessagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { sendCivicMessage } from "../lib/gemini";
import {
  SendChatMessageBody,
  CreateChatSessionBody,
  ListChatSessionsQueryParams,
} from "@workspace/api-zod";

const router = Router();

// POST /api/chat/message
router.post("/message", async (req, res) => {
  const parse = SendChatMessageBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { message, sessionId, userId } = parse.data;

  try {
    // Verify session exists
    const [session] = await db
      .select()
      .from(chatSessionsTable)
      .where(eq(chatSessionsTable.sessionId, sessionId));

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Save user message
    const userMsgId = randomUUID();
    await db.insert(chatMessagesTable).values({
      messageId: userMsgId,
      sessionId,
      role: "user",
      content: message,
    });

    // Get AI response
    const reply = await sendCivicMessage(message);

    // Save assistant message
    const asstMsgId = randomUUID();
    await db.insert(chatMessagesTable).values({
      messageId: asstMsgId,
      sessionId,
      role: "assistant",
      content: reply,
    });

    // Update session message count + timestamp
    const allMessages = await db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.sessionId, sessionId));

    await db
      .update(chatSessionsTable)
      .set({
        messageCount: allMessages.length,
        updatedAt: new Date(),
      })
      .where(eq(chatSessionsTable.sessionId, sessionId));

    return res.json({ reply, sessionId });
  } catch (err) {
    req.log.error({ err }, "Chat message error");
    return res.status(500).json({ error: "Failed to process message" });
  }
});

// GET /api/chat/sessions
router.get("/sessions", async (req, res) => {
  const parse = ListChatSessionsQueryParams.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: "Missing userId" });
  }
  const { userId } = parse.data;

  try {
    const sessions = await db
      .select()
      .from(chatSessionsTable)
      .where(eq(chatSessionsTable.userId, userId))
      .orderBy(chatSessionsTable.updatedAt);

    return res.json(
      sessions.map((s) => ({
        id: s.sessionId,
        userId: s.userId,
        title: s.title,
        messageCount: s.messageCount,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "List sessions error");
    return res.status(500).json({ error: "Failed to list sessions" });
  }
});

// POST /api/chat/sessions
router.post("/sessions", async (req, res) => {
  const parse = CreateChatSessionBody.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { userId, title } = parse.data;
  const sessionId = randomUUID();

  try {
    const [session] = await db
      .insert(chatSessionsTable)
      .values({ sessionId, userId, title })
      .returning();

    return res.status(201).json({
      id: session.sessionId,
      userId: session.userId,
      title: session.title,
      messageCount: session.messageCount,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Create session error");
    return res.status(500).json({ error: "Failed to create session" });
  }
});

// GET /api/chat/sessions/:sessionId/messages
router.get("/sessions/:sessionId/messages", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const messages = await db
      .select()
      .from(chatMessagesTable)
      .where(eq(chatMessagesTable.sessionId, sessionId))
      .orderBy(chatMessagesTable.createdAt);

    return res.json(
      messages.map((m) => ({
        id: m.messageId,
        sessionId: m.sessionId,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Get messages error");
    return res.status(500).json({ error: "Failed to get messages" });
  }
});

export default router;
