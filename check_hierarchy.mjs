import { loadEnv } from "./scripts/load-env.mjs";
loadEnv();
const { PrismaClient } = await import("./src/generated/prisma/index.js");
const p = new PrismaClient();
try {
  const rows = await p.$queryRaw`SELECT id, name, parentId, \`order\` FROM menus ORDER BY id`;
  const byId = new Map(rows.map(r => [r.id, r]));
  for (const r of rows) {
    const parent = r.parentId ? ` <- parent: ${byId.get(r.parentId)?.name} (${r.parentId})` : "";
    console.log(`${r.id}\t${r.name}${parent}`);
  }
} finally {
  await p.$disconnect();
}
