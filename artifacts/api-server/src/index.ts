import app from "./app";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Test database connection at startup
async function testDbConnection() {
  try {
    logger.info("Testing database connection...");
    await db.execute(sql`SELECT 1`);
    logger.info("Database connection successful!");
  } catch (err) {
    logger.error({ err }, "Database connection test failed on startup");
  }
}

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  await testDbConnection();
});

