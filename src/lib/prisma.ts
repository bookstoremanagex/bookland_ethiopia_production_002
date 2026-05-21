import { PrismaClient } from "../generated/prisma";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobalV2: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobalV2 ?? prismaClientSingleton();

export default prisma;

// Reuse one client in dev and serverless (e.g. Vercel) to avoid connection churn.
globalThis.prismaGlobalV2 = prisma;
