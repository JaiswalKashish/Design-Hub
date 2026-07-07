import { pool } from "@workspace/db";
import { logger } from "./logger";

/**
 * Auto-creates all required database tables if they don't exist.
 * This runs on every server startup and is safe to run multiple times (idempotent).
 * Bypasses drizzle-kit push to work reliably in all environments.
 */
export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    logger.info("Running database migrations...");

    await client.query(`
      -- Enums (safe to create if not exists)
      DO $$ BEGIN
        CREATE TYPE message_role AS ENUM ('user', 'assistant');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      DO $$ BEGIN
        CREATE TYPE complaint_status AS ENUM ('pending', 'assigned', 'in_progress', 'resolved');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      -- User Profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id       TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        email         TEXT NOT NULL,
        photo_url     TEXT,
        language      TEXT NOT NULL DEFAULT 'en',
        state         TEXT,
        dark_mode     BOOLEAN NOT NULL DEFAULT false,
        notifications BOOLEAN NOT NULL DEFAULT true,
        created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Chat Sessions table
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id            SERIAL PRIMARY KEY,
        session_id    TEXT NOT NULL UNIQUE,
        user_id       TEXT NOT NULL,
        title         TEXT NOT NULL,
        message_count INTEGER NOT NULL DEFAULT 0,
        created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Chat Messages table
      CREATE TABLE IF NOT EXISTS chat_messages (
        id          SERIAL PRIMARY KEY,
        message_id  TEXT NOT NULL UNIQUE,
        session_id  TEXT NOT NULL,
        role        message_role NOT NULL,
        content     TEXT NOT NULL,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Complaints table
      CREATE TABLE IF NOT EXISTS complaints (
        id           SERIAL PRIMARY KEY,
        complaint_id TEXT NOT NULL UNIQUE,
        user_id      TEXT NOT NULL,
        category     TEXT NOT NULL,
        description  TEXT NOT NULL,
        status       complaint_status NOT NULL DEFAULT 'pending',
        location     TEXT,
        image_url    TEXT,
        department   TEXT,
        priority     TEXT,
        severity     TEXT,
        officer_name TEXT,
        created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Complaint Timeline table
      CREATE TABLE IF NOT EXISTS complaint_timeline (
        id              SERIAL PRIMARY KEY,
        complaint_db_id INTEGER NOT NULL,
        status          TEXT NOT NULL,
        note            TEXT,
        timestamp       TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    logger.info("Database migrations completed successfully!");
  } catch (err) {
    logger.error({ err }, "Database migration failed");
    throw err;
  } finally {
    client.release();
  }
}
