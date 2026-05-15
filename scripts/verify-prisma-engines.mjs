import { existsSync } from "node:fs";
import path from "node:path";

const engineDir = path.join(process.cwd(), "src", "generated", "prisma");
const rhelEngine = path.join(
  engineDir,
  "libquery_engine-rhel-openssl-3.0.x.so.node"
);

if (!existsSync(rhelEngine)) {
  console.error(
    "\n[build] Prisma query engine missing (required for Vercel/Linux):\n  " +
      rhelEngine +
      "\n\nRun: npx prisma generate\n"
  );
  process.exit(1);
}

console.log("[build] Prisma query engine OK:", path.basename(rhelEngine));
