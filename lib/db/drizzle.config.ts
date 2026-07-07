import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const databaseUrl = process.env.DATABASE_URL;
const isLocalhost = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
    ssl: isLocalhost ? undefined : { rejectUnauthorized: false }
  },
});
