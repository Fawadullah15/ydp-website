const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const leadership = await prisma.leadershipProfile.findMany({
    where: { level: 'PROVINCIAL' },
    include: { province: true }
  });
  console.log(JSON.stringify(leadership, null, 2));
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
