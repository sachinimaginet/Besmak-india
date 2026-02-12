import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  try {
    return new PrismaClient()
  } catch (error) {
    console.warn("Prisma Client failed to initialize. Using fallback mock.", error)
    return new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'then') return undefined;
        return () => {
          console.error(`Database operation '${String(prop)}' failed: Prisma not generated.`);
          return Promise.resolve(null);
        }
      }
    }) as unknown as PrismaClient
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
