import { loadEnv } from "./load-env.mjs";

loadEnv();

const requireDb = process.env.REQUIRE_DATABASE === "true";

if (!process.env.DATABASE_URL) {
  console.warn("[build] Database: NOT CONNECTED (DATABASE_URL is not set)");
  process.exit(requireDb ? 1 : 0);
}

let prisma;
try {
  const { PrismaClient } = await import("../src/generated/prisma/index.js");
  prisma = new PrismaClient();
  await prisma.$queryRawUnsafe("SELECT 1");
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
