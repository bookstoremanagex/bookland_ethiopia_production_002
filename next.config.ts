import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Custom Prisma output (prisma/schema.prisma → src/generated/prisma).
  // Only trace the generated client folder (not all of @prisma/client — that slows Vercel builds heavily).
  outputFileTracingIncludes: {
    "**": ["./src/generated/prisma/**/*"],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
