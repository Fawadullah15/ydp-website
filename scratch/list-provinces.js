const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const provinces = await prisma.province.findMany({
    select: { id: true, name: true }
  });
  console.log(JSON.stringify(provinces, null, 2));
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
