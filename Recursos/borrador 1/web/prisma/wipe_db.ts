import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function wipe() {
  console.log("🔥 INICIANDO BORRADO DE BASE DE DATOS...");
  await prisma.plantSpecies.deleteMany({});
  console.log("✅ BASE DE DATOS BORRADA");
}
wipe().finally(() => prisma.$disconnect());
