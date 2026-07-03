import { PrismaClient } from "../generated/retail-prisma";

const retailPrismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var retailPrismaGlobal: undefined | ReturnType<typeof retailPrismaClientSingleton>;
}

const retailPrisma = globalThis.retailPrismaGlobal ?? retailPrismaClientSingleton();

export default retailPrisma;

globalThis.retailPrismaGlobal = retailPrisma;
