import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.setting.findMany();
  console.log('Settings:', settings);
  
  const memberCount = await prisma.member.count();
  console.log('Actual DB Member Count:', memberCount);
  
  const volunteerCount = await prisma.volunteerApplication.count();
  console.log('Actual DB Volunteer Count:', volunteerCount);
  
  const eventCount = await prisma.event.count();
  console.log('Actual DB Event Count:', eventCount);
}

main().finally(() => prisma.$disconnect());
