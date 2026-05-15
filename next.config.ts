import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Custom Prisma output (prisma/schema.prisma → src/generated/prisma).
  // Vercel serverless bundles must include the Linux query engine binary.
  outputFileTracingIncludes: {
    "**": [
      "./src/generated/prisma/**/*",
      "./node_modules/@prisma/client/**/*",
    ],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
