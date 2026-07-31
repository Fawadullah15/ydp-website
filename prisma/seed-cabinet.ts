import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating cabinet members with official data...')

  // Get all provinces
  const provinces = await prisma.province.findMany()
  const prov: Record<string, string> = {}
  for (const p of provinces) {
    prov[p.slug] = p.id
  }
  console.log('✅ Provinces loaded:', Object.keys(prov))

  // ── Step 1: Delete all existing PROVINCIAL members ──────────────────
  const deleted = await prisma.leadershipProfile.deleteMany({
    where: { level: 'PROVINCIAL' }
  })
  console.log(`🗑️  Deleted ${deleted.count} old provincial members`)

  // ── Step 2: Re-insert correct official cabinet data ─────────────────
  const officialCabinet = [

    // =================== KPK CABINET (Official 2026-2027) ===================
    { name: 'Muhammad Bilal Jawad',      position: 'President YDP KPK',                       level: 'PROVINCIAL', sortOrder: 10, provinceId: prov['kpk'] },
    { name: 'Fawadullah Imraj',          position: 'Vice President YDP KPK',                   level: 'PROVINCIAL', sortOrder: 11, provinceId: prov['kpk'] },
    { name: 'Ihtisham ul Haq',           position: 'General Secretary YDP KPK',                level: 'PROVINCIAL', sortOrder: 12, provinceId: prov['kpk'] },
    { name: 'Tufail Khan',               position: 'Joint Secretary YDP KPK',                  level: 'PROVINCIAL', sortOrder: 13, provinceId: prov['kpk'] },
    { name: 'Ikhlas Ahmad',              position: 'Finance Secretary YDP KPK',                level: 'PROVINCIAL', sortOrder: 14, provinceId: prov['kpk'] },
    { name: 'Lentha Iqbal',              position: 'Event Manager YDP KPK',                    level: 'PROVINCIAL', sortOrder: 15, provinceId: prov['kpk'] },
    { name: 'Muhammad Ahmad',            position: 'Legal Affairs & Policy Secretary YDP KPK', level: 'PROVINCIAL', sortOrder: 16, provinceId: prov['kpk'] },
    { name: 'Kainat Sabir',              position: 'District & Chapters Head YDP KPK',         level: 'PROVINCIAL', sortOrder: 17, provinceId: prov['kpk'] },
    { name: 'Ayesha Khan',               position: 'Communications & Media Secretary YDP KPK', level: 'PROVINCIAL', sortOrder: 18, provinceId: prov['kpk'] },
    { name: 'Muzzammil Khan',            position: 'Social Welfare Secretary YDP KPK',         level: 'PROVINCIAL', sortOrder: 19, provinceId: prov['kpk'] },
    { name: 'Khezar Hayat',              position: 'Research & Planning Secretary YDP KPK',    level: 'PROVINCIAL', sortOrder: 20, provinceId: prov['kpk'] },
    { name: 'Waqas Ali Khan',            position: 'Media & Content Secretary YDP KPK',        level: 'PROVINCIAL', sortOrder: 21, provinceId: prov['kpk'] },
    { name: 'Aslam Khan',                position: 'Public Relations Secretary YDP KPK',       level: 'PROVINCIAL', sortOrder: 22, provinceId: prov['kpk'] },
    { name: 'Hazrat Umar',               position: 'Information Secretary YDP KPK',            level: 'PROVINCIAL', sortOrder: 23, provinceId: prov['kpk'] },
    { name: 'Hooria Nasir',              position: 'Secretary to President YDP KPK',           level: 'PROVINCIAL', sortOrder: 24, provinceId: prov['kpk'] },

    // =================== PUNJAB CABINET (Official 2026-2027) ===================
    { name: 'Ms. Sualeha Kanwal',        position: 'President YDP Punjab',                        level: 'PROVINCIAL', sortOrder: 30, provinceId: prov['punjab'] },
    { name: 'Ms. Somia Khan',            position: 'Senior Vice President YDP Punjab',             level: 'PROVINCIAL', sortOrder: 31, provinceId: prov['punjab'] },
    { name: 'Mr. Hamza Ahmad Raza',      position: 'Vice President YDP Punjab',                    level: 'PROVINCIAL', sortOrder: 32, provinceId: prov['punjab'] },
    { name: 'Ms. Rukhshanda Shabbir',    position: 'General Secretary YDP Punjab',                 level: 'PROVINCIAL', sortOrder: 33, provinceId: prov['punjab'] },
    { name: 'Mr. Sheikh Muhammad Usama', position: 'Joint Secretary YDP Punjab',                   level: 'PROVINCIAL', sortOrder: 34, provinceId: prov['punjab'] },
    { name: 'Ms. Muneeba',               position: 'Media & Communication Secretary YDP Punjab',   level: 'PROVINCIAL', sortOrder: 35, provinceId: prov['punjab'] },
    { name: 'Ms. Rafia Farooq',          position: 'Social Welfare Secretary YDP Punjab',          level: 'PROVINCIAL', sortOrder: 36, provinceId: prov['punjab'] },
    { name: 'Ms. Aneela Naik',           position: 'Publicity Secretary & Executive Member Punjab', level: 'PROVINCIAL', sortOrder: 37, provinceId: prov['punjab'] },
    { name: 'Ms. Qurat ul Ain',          position: 'Executive Member YDP Punjab',                  level: 'PROVINCIAL', sortOrder: 38, provinceId: prov['punjab'] },

    // =================== SINDH CABINET (Official 2026-2027) ===================
    { name: 'Miss Sassi',                position: 'President YDP Sindh',                          level: 'PROVINCIAL', sortOrder: 50, provinceId: prov['sindh'] },
    { name: 'Mr. Waqas Khan',            position: 'Vice President YDP Sindh',                     level: 'PROVINCIAL', sortOrder: 51, provinceId: prov['sindh'] },
    { name: 'Mr. Sanaullah Chopan',      position: 'Joint Secretary YDP Sindh',                    level: 'PROVINCIAL', sortOrder: 52, provinceId: prov['sindh'] },
    { name: 'Mr. Wajahat Awan',          position: 'Finance Secretary YDP Sindh',                  level: 'PROVINCIAL', sortOrder: 53, provinceId: prov['sindh'] },
    { name: 'Miss Maheen',               position: 'Media & Communication Secretary YDP Sindh',    level: 'PROVINCIAL', sortOrder: 54, provinceId: prov['sindh'] },
    { name: 'Miss Ayesha Bashir',        position: 'Event and Coordination Secretary YDP Sindh',   level: 'PROVINCIAL', sortOrder: 55, provinceId: prov['sindh'] },
    { name: 'Dr. Rao Ali Raza',          position: 'Education and Training Secretary YDP Sindh',   level: 'PROVINCIAL', sortOrder: 56, provinceId: prov['sindh'] },
    { name: 'Mr. Hub Ali Bhutto',        position: 'Membership & Welfare Secretary YDP Sindh',     level: 'PROVINCIAL', sortOrder: 57, provinceId: prov['sindh'] },

    // =================== KASHMIR CABINET (Official) ===================
    { name: 'Syeda Zahra Fatima',            position: 'President YDP Kashmir',                        level: 'PROVINCIAL', sortOrder: 70, provinceId: prov['kashmir'] },
    { name: 'Syed Hassan Raza Hamdami',      position: 'Vice President YDP Kashmir',                   level: 'PROVINCIAL', sortOrder: 71, provinceId: prov['kashmir'] },
    { name: 'Haider Ilyas',                  position: 'District & Chapter Head YDP Kashmir',          level: 'PROVINCIAL', sortOrder: 72, provinceId: prov['kashmir'] },
    { name: 'Raja Sultan Mansoor',           position: 'Finance Secretary YDP Kashmir',                level: 'PROVINCIAL', sortOrder: 73, provinceId: prov['kashmir'] },
    { name: 'Farrah Latif',                  position: 'Joint Secretary YDP Kashmir',                  level: 'PROVINCIAL', sortOrder: 74, provinceId: prov['kashmir'] },
    { name: 'Khawaja Qaria Tamkeen Hafeez',  position: 'Legal Affairs & Policy Secretary YDP Kashmir', level: 'PROVINCIAL', sortOrder: 75, provinceId: prov['kashmir'] },
    { name: 'Ishraq Asif Mughal',            position: 'Communication & Media Secretary YDP Kashmir',  level: 'PROVINCIAL', sortOrder: 76, provinceId: prov['kashmir'] },
    { name: 'Abdul Rauf Mir',                position: 'Secretary to President YDP Kashmir',           level: 'PROVINCIAL', sortOrder: 77, provinceId: prov['kashmir'] },
    { name: 'Kubra BiBi',                    position: 'Event Manager YDP Kashmir',                    level: 'PROVINCIAL', sortOrder: 78, provinceId: prov['kashmir'] },
    { name: 'Raja Muhammad Shahid',          position: 'Public Relations Secretary YDP Kashmir',       level: 'PROVINCIAL', sortOrder: 79, provinceId: prov['kashmir'] },
    { name: 'Junaid Ali',                    position: 'General Secretary YDP Kashmir',                level: 'PROVINCIAL', sortOrder: 80, provinceId: prov['kashmir'] },
    { name: 'Raja Farhan',                   position: 'Executive Member YDP Kashmir',                 level: 'PROVINCIAL', sortOrder: 81, provinceId: prov['kashmir'] },
    { name: 'Tayyab Abbas',                  position: 'Executive Member YDP Kashmir',                 level: 'PROVINCIAL', sortOrder: 82, provinceId: prov['kashmir'] },
    { name: 'Basit Aziz',                    position: 'Executive Member YDP Kashmir',                 level: 'PROVINCIAL', sortOrder: 83, provinceId: prov['kashmir'] },
    { name: 'Atif Qayyum',                   position: 'Social Welfare Secretary YDP Kashmir',         level: 'PROVINCIAL', sortOrder: 84, provinceId: prov['kashmir'] },

    // =================== BALOCHISTAN CABINET (Existing data kept) ===================
    { name: 'Mr. Mumtaz Ahmad',          position: 'President YDP Balochistan',                    level: 'PROVINCIAL', sortOrder: 90, provinceId: prov['balochistan'] },
    { name: 'Ms. Nargis Naeem',          position: 'Vice President YDP Balochistan',               level: 'PROVINCIAL', sortOrder: 91, provinceId: prov['balochistan'] },
    { name: 'Mr. Abid Rind',             position: 'General Secretary YDP Balochistan',            level: 'PROVINCIAL', sortOrder: 92, provinceId: prov['balochistan'] },
    { name: 'Ms. Gulnaz Mengal',         position: 'Director Education YDP Balochistan',           level: 'PROVINCIAL', sortOrder: 93, provinceId: prov['balochistan'] },
    { name: 'Mr. Daud Marri',            position: 'Finance Secretary YDP Balochistan',            level: 'PROVINCIAL', sortOrder: 94, provinceId: prov['balochistan'] },
    { name: 'Ms. Saba Kakar',            position: 'Director Women Affairs YDP Balochistan',       level: 'PROVINCIAL', sortOrder: 95, provinceId: prov['balochistan'] },
    { name: 'Mr. Faraz Zehri',           position: 'Media & Communications Secretary Balochistan', level: 'PROVINCIAL', sortOrder: 96, provinceId: prov['balochistan'] },
    { name: 'Ms. Rehana Bugti',          position: 'Social Welfare Secretary YDP Balochistan',     level: 'PROVINCIAL', sortOrder: 97, provinceId: prov['balochistan'] },
    { name: 'Mr. Bashir Lehri',          position: 'Youth Engagement Secretary YDP Balochistan',   level: 'PROVINCIAL', sortOrder: 98, provinceId: prov['balochistan'] },
    { name: 'Ms. Maryam Musakhail',      position: 'Health & Environment Secretary Balochistan',   level: 'PROVINCIAL', sortOrder: 99, provinceId: prov['balochistan'] },
  ]

  let created = 0
  for (const member of officialCabinet) {
    await prisma.leadershipProfile.create({
      data: {
        ...member,
        photo: null,
        bio: null,
        isActive: true,
      } as any,
    })
    console.log(`✅ ${member.name} – ${member.position}`)
    created++
  }

  console.log(`\n🎉 Done! Inserted ${created} official cabinet members.`)
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
