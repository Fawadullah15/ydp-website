import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process for dummy data...');

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

  // Target counts
  const punjabTarget = 1045;
  const sindhTarget = 732;
  const kpkTarget = 483;
  const balochistanTarget = 194;
  const kashmirTarget = 96;

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
    // Delete existing fake members if any (to make script rerunnable)
    await prisma.member.deleteMany({
      where: { memberId: { startsWith: 'YDP-FAKE' } }
    });
    
    // Chunk insert for members
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

  // Volunteer target 5392
  const volunteersToInsert = Array.from({ length: 5392 }).map((_, i) => ({
    firstName: `Volunteer`,
    lastName: `${i}`,
    email: `fake_volunteer_${i}@example.com`,
    phone: `+92300${Math.floor(1000000 + Math.random() * 9000000)}`,
    city: 'Lahore',
    interests: 'Community Service',
    availability: 'Weekends',
    status: 'APPROVED',
  }));

  if (volunteersToInsert.length > 0) {
    await prisma.volunteerApplication.deleteMany({
      where: { email: { startsWith: 'fake_volunteer_' } }
    });

    const chunkSize = 1000;
    for (let i = 0; i < volunteersToInsert.length; i += chunkSize) {
      await prisma.volunteerApplication.createMany({
        data: volunteersToInsert.slice(i, i + chunkSize),
        skipDuplicates: true,
      });
      console.log(`Inserted ${Math.min(i + chunkSize, volunteersToInsert.length)} volunteers...`);
    }
  }

  // Events (we just need 34 total)
  console.log('Seeding Events...');
  const currentEvents = await prisma.event.count();
  if (currentEvents < 34) {
    const defaultAuthor = await prisma.user.findFirst();
    if (!defaultAuthor) {
       console.log('No users found to author events. Skipping events...');
    } else {
      const eventsToInsert = Array.from({ length: 34 - currentEvents }).map((_, i) => ({
        title: `Past Fake Event ${i}`,
        slug: `past-fake-event-${i}-${Date.now()}`,
        status: 'COMPLETED',
        isPublic: true,
        startDate: new Date(Date.now() - 10000000000),
        endDate: new Date(Date.now() - 9000000000),
        city: 'Islamabad',
        authorId: defaultAuthor.id,
      }));
      await prisma.event.createMany({
        data: eventsToInsert,
        skipDuplicates: true,
      });
      console.log(`Inserted ${eventsToInsert.length} events...`);
    }
  }

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
