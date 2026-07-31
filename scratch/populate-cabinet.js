const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const punjabId = "cms1x0xv20001l1mhg4y10lf2";
const sindhId = "cms1x0xvw0003l1mhb3x6bdxu";
const kashmirId = "cms1x0xwq0005l1mh3jr9zfx5";
const kpkId = "cms1x0xvi0002l1mhhk6vk0ze";

const cabinets = [
  // Punjab
  { name: "Ms Sualeha Kanwal", position: "President YDP Punjab", provinceId: punjabId, sortOrder: 1, photo: "/api/uploads/039d8fabf53b39c7.png", bio: "Ms. Sualeha Kanwal is the President of YDP Punjab. She is the overall head of YDP activities in Punjab, implementing national policies at the provincial level and representing Punjab youth at national forums." },
  { name: "Ms Somia Khan", position: "Senior Vice President", provinceId: punjabId, sortOrder: 2 },
  { name: "Mr Hamza Ahmad Raza", position: "Vice President YDP Punjab", provinceId: punjabId, sortOrder: 3, photo: "/api/uploads/63fbc3098db15566.png", bio: "Hamza Ahmad Raza serves as the vice president of YDP Punjab, driving youth empowerment, leadership initiatives, and strategic development across the province" },
  { name: "Ms Rukhshanda Shabbir", position: "General Secretary", provinceId: punjabId, sortOrder: 4 },
  { name: "Mr Sheikh Muhammad Usama", position: "Join Secretary", provinceId: punjabId, sortOrder: 5 },
  { name: "Ms Muneeba", position: "Media & Communication Secretary", provinceId: punjabId, sortOrder: 6 },
  { name: "Ms Rafia Farooq", position: "Social Welfare Secretary", provinceId: punjabId, sortOrder: 7 },
  { name: "Ms Aneela Naik", position: "Publicity Secretary & Executive Member", provinceId: punjabId, sortOrder: 8 },
  { name: "Ms Qurat ul ain", position: "Executive Member", provinceId: punjabId, sortOrder: 9 },

  // Sindh
  { name: "Miss Sassi", position: "President", provinceId: sindhId, sortOrder: 1, bio: "Ms. Sassi Rahim leads the YDP Sindh chapter, driving provincial strategy and youth engagement. She coordinates with districts and the national body to oversee welfare and development projects in Sindh." },
  { name: "Mr. Waqas Khan", position: "Vice President", provinceId: sindhId, sortOrder: 2 },
  { name: "Mr. Sanaullah Chopan", position: "Joint Secretary", provinceId: sindhId, sortOrder: 3 },
  { name: "Mr. Wajahat Awan", position: "Finance Secretary", provinceId: sindhId, sortOrder: 4 },
  { name: "Miss Maheen", position: "Media & Communication Secretary", provinceId: sindhId, sortOrder: 5 },
  { name: "Miss Ayesha Bashir", position: "Event and Coordination Secretary", provinceId: sindhId, sortOrder: 6 },
  { name: "Dr. Rao Ali Raza", position: "Education and Training Secretary", provinceId: sindhId, sortOrder: 7 },
  { name: "Mr. Hub Ali Bhutto", position: "Membership & Welfare Secretary", provinceId: sindhId, sortOrder: 8 },

  // Kashmir
  { name: "Syeda Zahra Fatima", position: "President", provinceId: kashmirId, sortOrder: 1, photo: "/uploads/90f78615444577a3.png", bio: "Ms. Syeda Zahra Fatima leads the YDP Kashmir chapter, working to empower young people in Azad Kashmir through leadership development, civic engagement, and community service." },
  { name: "Syed Hassan Raza Hamdami", position: "Vice President", provinceId: kashmirId, sortOrder: 2 },
  { name: "Haider Ilyas", position: "District & Chapter Head", provinceId: kashmirId, sortOrder: 3 },
  { name: "Raja Sultan Mansoor", position: "Finance Secretary", provinceId: kashmirId, sortOrder: 4 },
  { name: "Farrah Latif", position: "Joint Secretary", provinceId: kashmirId, sortOrder: 5 },
  { name: "Khawaja Qaria Tamkeen Hafeez", position: "Legal Affairs & Policy Secretary", provinceId: kashmirId, sortOrder: 6 },
  { name: "Ishraq Asif Mughal", position: "Communication & Media Secretary", provinceId: kashmirId, sortOrder: 7 },
  { name: "Abdul Rauf Mir", position: "Secretary to President", provinceId: kashmirId, sortOrder: 8 },
  { name: "Kubra BiBi", position: "Event Manager", provinceId: kashmirId, sortOrder: 9 },
  { name: "Raja Muhammad Shahid", position: "Public Relations Secretary", provinceId: kashmirId, sortOrder: 10 },
  { name: "Junaid Ali", position: "General Secretary", provinceId: kashmirId, sortOrder: 11 },
  { name: "Raja Farhan", position: "Executive Member", provinceId: kashmirId, sortOrder: 12 },
  { name: "Tayyab Abbas", position: "Executive Member", provinceId: kashmirId, sortOrder: 13 },
  { name: "Basit Aziz", position: "Executive Member", provinceId: kashmirId, sortOrder: 14 },
  { name: "Atif Qayyum", position: "Social Welfare Secretary", provinceId: kashmirId, sortOrder: 15 },

  // Khyber Pakhtunkhwa (KPK)
  { name: "Muhammad Bilal Jawad", position: "President", provinceId: kpkId, sortOrder: 1, bio: "Mr. Bilal Jawad heads all YDP initiatives in Khyber Pakhtunkhwa, strengthening youth participation and leadership, and serving as a liaison with government and civil society organizations." },
  { name: "Fawadullah Imraj", position: "Vice President", provinceId: kpkId, sortOrder: 2 },
  { name: "Ihtisham ul Haq", position: "General Secretary", provinceId: kpkId, sortOrder: 3 },
  { name: "Tufail Khan", position: "Joint Secretary", provinceId: kpkId, sortOrder: 4 },
  { name: "Ikhlas Ahmad", position: "Finance Secretary", provinceId: kpkId, sortOrder: 5 },
  { name: "Lentha Iqbal", position: "Event Manager", provinceId: kpkId, sortOrder: 6 },
  { name: "Muhammad Ahmad", position: "Legal Affairs & Policy Secretary", provinceId: kpkId, sortOrder: 7 },
  { name: "Kainat Sabir", position: "District & Chapters Head", provinceId: kpkId, sortOrder: 8 },
  { name: "Ayesha Khan", position: "Communications & Media Secretary", provinceId: kpkId, sortOrder: 9 },
  { name: "Muzzammil Khan", position: "Social Welfare Secretary", provinceId: kpkId, sortOrder: 10 },
  { name: "Khezar Hayat", position: "Research & Planning Secretary", provinceId: kpkId, sortOrder: 11 },
  { name: "Waqas Ali Khan", position: "Media & Content Secretary", provinceId: kpkId, sortOrder: 12 },
  { name: "Aslam Khan", position: "Public Relations Secretary", provinceId: kpkId, sortOrder: 13 },
  { name: "Hazrat Umar", position: "Information Secretary", provinceId: kpkId, sortOrder: 14 },
  { name: "Hooria Nasir", position: "Secretary to President", provinceId: kpkId, sortOrder: 15 }
];

async function main() {
  console.log("Deleting existing provincial cabinets for Punjab, Sindh, Kashmir, KPK...");
  await prisma.leadershipProfile.deleteMany({
    where: {
      level: 'PROVINCIAL',
      provinceId: { in: [punjabId, sindhId, kashmirId, kpkId] }
    }
  });
  
  console.log("Inserting new cabinets...");
  for (const member of cabinets) {
    await prisma.leadershipProfile.create({
      data: {
        name: member.name,
        position: member.position,
        level: 'PROVINCIAL',
        sortOrder: member.sortOrder,
        provinceId: member.provinceId,
        photo: member.photo || null,
        bio: member.bio || null
      }
    });
  }
  
  console.log("Done!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
