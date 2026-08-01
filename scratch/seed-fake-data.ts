import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process for reduced dummy data...');

  // 1. Get provinces
  const provinces = await prisma.province.findMany();
  if (provinces.length === 0) {
    console.error('No provinces found! Please run regular seed first.');
    return;
  }

  const punjab = provinces.find(p => p.name.includes('Punjab'));
  const sindh = provinces.find(p => p.name.includes('Sindh'));
  const kpk = provinces.find(p => p.name.includes('Khyber') || p.name.includes('Pakhtunkhwa'));
  const balochistan = provinces.find(p => p.name.includes('Balochistan'));
  const kashmir = provinces.find(p => p.name.includes('Kashmir') || p.name.includes('AJK'));

  // Target counts (reduced to hundreds)
  const punjabTarget = 105;
  const sindhTarget = 73;
  const kpkTarget = 48;
  const balochistanTarget = 19;
  const kashmirTarget = 10;

  console.log('Clearing old fake data...');
  await prisma.member.deleteMany({
    where: { memberId: { startsWith: 'YDP-FAKE' } }
  });
  await prisma.volunteerApplication.deleteMany({
    where: { email: { startsWith: 'fake_volunteer_' } }
  });

  console.log('Seeding Members...');

  const generateMembers = (provinceId: string, count: number, startId: number) => {
    if (!provinceId) return [];
    return Array.from({ length: count }).map((_, i) => ({
      memberId: `YDP-FAKE-${provinceId.substring(0, 4)}-${startId + i}`,
      firstName: `Member`,
      lastName: `${startId + i}`,
      email: `fake_member_${provinceId.substring(0, 4)}_${startId + i}@example.com`,
      phone: `+92300${Math.floor(1000000 + Math.random() * 9000000)}`,
      provinceId: provinceId,
      status: 'ACTIVE',
      membershipType: 'GENERAL',
      joinedAt: new Date(Date.now() - Math.random() * 10000000000), // Random time in past
    }));
  };

  const membersToInsert = [
    ...generateMembers(punjab?.id || '', punjabTarget, 10000),
    ...generateMembers(sindh?.id || '', sindhTarget, 20000),
    ...generateMembers(kpk?.id || '', kpkTarget, 30000),
    ...generateMembers(balochistan?.id || '', balochistanTarget, 40000),
    ...generateMembers(kashmir?.id || '', kashmirTarget, 50000),
  ];

  if (membersToInsert.length > 0) {
    const chunkSize = 500;
    for (let i = 0; i < membersToInsert.length; i += chunkSize) {
      await prisma.member.createMany({
        data: membersToInsert.slice(i, i + chunkSize),
        skipDuplicates: true,
      });
      console.log(`Inserted ${Math.min(i + chunkSize, membersToInsert.length)} members...`);
    }
  }

  console.log('Seeding Volunteers...');

  // Volunteer target 539 (reduced)
  const volunteersToInsert = Array.from({ length: 539 }).map((_, i) => ({
    firstName: `Volunteer`,
    lastName: `${i}`,
    email: `fake_volunteer_${i}@example.com`,
    phone: `+92300${Math.floor(1000000 + Math.random() * 9000000)}`,
    city: 'Lahore',
    skills: 'Community Service',
    availability: 'Weekends',
    status: 'APPROVED',
  }));

  if (volunteersToInsert.length > 0) {
    const chunkSize = 500;
    for (let i = 0; i < volunteersToInsert.length; i += chunkSize) {
      await prisma.volunteerApplication.createMany({
        data: volunteersToInsert.slice(i, i + chunkSize),
        skipDuplicates: true,
      });
      console.log(`Inserted ${Math.min(i + chunkSize, volunteersToInsert.length)} volunteers...`);
    }
  }

  // Events (we leave events as is since there are only 34 of them)
  console.log('Events are kept as is (only 34 rows).');

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
