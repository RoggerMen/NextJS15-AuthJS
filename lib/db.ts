// BUSCAR BEST PRACTICE FOR INSTANTIATING PRISMA CLIENT WITH NEXTJS
// OR Comprehensive Guide to Using Prisma ORM with Next.js
// Si buscas simplicidad y no necesitas la máxima flexibilidad, este enfoque es más directo.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Si prefieres un enfoque más limpio y moderno, con compatibilidad mejorada gracias al uso de globalThis y modularidad, este es la mejor opción.
// import {PrismaClient} from "@prisma/client"

// const prismaClientSingleton = () => {
//     return new PrismaClient();
// };

// declare const globalthis : {
//     prismaGlobal: returnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== "production") globalthis.prismaGlobal = prismaClientSingleton;