import { loadEnv } from "./load-env.mjs";

loadEnv();

const requireDb = process.env.REQUIRE_DATABASE === "true";
const CHECK_TIMEOUT_MS = Number(process.env.DATABASE_CHECK_TIMEOUT_MS ?? 8000);

// Vercel/CI builds must not block on DB reachability (firewalls/timeouts hang the deploy).
if (
  (process.env.VERCEL || process.env.CI) &&
  process.env.CHECK_DATABASE_ON_BUILD !== "true"
) {
  console.log("[build] Database: skipped (Vercel/CI — set CHECK_DATABASE_ON_BUILD=true to enable)");
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.warn("[build] Database: NOT CONNECTED (DATABASE_URL is not set)");
  process.exit(requireDb ? 1 : 0);
}

let prisma;
try {
  const { PrismaClient } = await import("../src/generated/prisma/index.js");
  prisma = new PrismaClient();

  await Promise.race([
    prisma.$queryRawUnsafe("SELECT 1"),
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`Timed out after ${CHECK_TIMEOUT_MS}ms`)),
        CHECK_TIMEOUT_MS
      );
    }),
  ]);

  console.log("[build] Database: CONNECTED");
  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn("[build] Database: NOT CONNECTED");
  console.warn(`[build] ${message}`);
  process.exit(requireDb ? 1 : 0);
} finally {
  if (prisma) await prisma.$disconnect();
}
