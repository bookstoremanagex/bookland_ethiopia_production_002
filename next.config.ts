import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Custom Prisma `output` (see prisma/schema.prisma) lives outside
  // `node_modules/.prisma/client`. Next must explicitly trace the query engine
  // binaries into each serverless bundle on Vercel.
  // Glob `**` matches every route (including `/`); see next/dist/build/collect-build-traces.js + picomatch `contains`.
  outputFileTracingIncludes: {
   // "**": ["./src/generated/prisma/**/*"],
    '/**/*': ['./node_modules/.prisma/client/**/*'],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
