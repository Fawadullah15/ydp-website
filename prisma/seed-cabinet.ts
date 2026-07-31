import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Cabinet Members for all provinces...')

  // Get all provinces
  const provinces = await prisma.province.findMany()
  const prov: Record<string, string> = {}
  for (const p of provinces) {
    prov[p.slug] = p.id
  }

  console.log('✅ Provinces loaded:', Object.keys(prov))

  const cabinetMembers = [
    // =================== KPK CABINET ===================
    {
      name: 'Mr. Bilal Jawad',
      position: 'President YDP KPK',
      bio: 'Mr. Bilal Jawad heads all YDP initiatives in Khyber Pakhtunkhwa, strengthening youth participation and leadership, and serving as a liaison with government and civil society organizations.',
      level: 'PROVINCIAL', sortOrder: 10, provinceId: prov['kpk'],
    },
    {
      name: 'Ms. Kainat Sabir',
      position: 'Regional Director KPK',
      bio: 'Ms. Kainat Sabir serves as the Regional Director for Khyber Pakhtunkhwa, overseeing YDP operations and youth development initiatives across the KP region.',
      level: 'PROVINCIAL', sortOrder: 11, provinceId: prov['kpk'],
    },
    {
      name: 'Mr. Fawad Ahmad',
      position: 'General Secretary YDP KPK',
      bio: 'Mr. Fawad Ahmad serves as the General Secretary of YDP KPK, managing the administrative affairs and coordination of the provincial chapter.',
      level: 'PROVINCIAL', sortOrder: 12, provinceId: prov['kpk'],
    },
    {
      name: 'Ms. Nadia Iqbal',
      position: 'Vice President YDP KPK',
      bio: 'Ms. Nadia Iqbal serves as the Vice President of YDP KPK, supporting provincial leadership in planning and implementing youth development programs.',
      level: 'PROVINCIAL', sortOrder: 13, provinceId: prov['kpk'],
    },
    {
      name: 'Mr. Irfan Shah',
      position: 'Director Finance YDP KPK',
      bio: 'Mr. Irfan Shah serves as Director Finance for YDP KPK, overseeing financial management, budgeting, and resource allocation for provincial programs.',
      level: 'PROVINCIAL', sortOrder: 14, provinceId: prov['kpk'],
    },
    {
      name: 'Ms. Amna Bibi',
      position: 'Director Social Welfare YDP KPK',
      bio: 'Ms. Amna Bibi leads social welfare initiatives in Khyber Pakhtunkhwa, coordinating community service activities and humanitarian programs.',
      level: 'PROVINCIAL', sortOrder: 15, provinceId: prov['kpk'],
    },
    {
      name: 'Mr. Usman Khalid',
      position: 'Director Media & Communications YDP KPK',
      bio: 'Mr. Usman Khalid manages media and communications for YDP KPK, handling public relations, social media, and outreach campaigns.',
      level: 'PROVINCIAL', sortOrder: 16, provinceId: prov['kpk'],
    },
    {
      name: 'Ms. Hina Gul',
      position: 'Director Education YDP KPK',
      bio: 'Ms. Hina Gul leads education and skill development initiatives for YDP KPK, organizing training workshops and academic support programs.',
      level: 'PROVINCIAL', sortOrder: 17, provinceId: prov['kpk'],
    },
    {
      name: 'Mr. Saeed Ullah',
      position: 'Director Health & Environment YDP KPK',
      bio: 'Mr. Saeed Ullah oversees health awareness campaigns and environmental initiatives across KPK under the YDP banner.',
      level: 'PROVINCIAL', sortOrder: 18, provinceId: prov['kpk'],
    },
    {
      name: 'Ms. Zainab Wazir',
      position: 'Director Women Empowerment YDP KPK',
      bio: 'Ms. Zainab Wazir leads women empowerment programs in KPK, advocating for gender equality and opportunities for young women.',
      level: 'PROVINCIAL', sortOrder: 19, provinceId: prov['kpk'],
    },

    // =================== PUNJAB CABINET ===================
    {
      name: 'Ms. Sualeha Kanwal',
      position: 'President YDP Punjab',
      bio: 'Ms. Sualeha Kanwal is the President of YDP Punjab. She is the overall head of YDP activities in Punjab, implementing national policies at the provincial level and representing Punjab youth at national forums.',
      level: 'PROVINCIAL', sortOrder: 20, provinceId: prov['punjab'],
    },
    {
      name: 'Mr. Hassan Raza',
      position: 'Vice President YDP Punjab',
      bio: 'Mr. Hassan Raza serves as Vice President of YDP Punjab, assisting in overall provincial administration and program management.',
      level: 'PROVINCIAL', sortOrder: 21, provinceId: prov['punjab'],
    },
    {
      name: 'Ms. Mehwish Siddiqui',
      position: 'General Secretary YDP Punjab',
      bio: 'Ms. Mehwish Siddiqui manages the administrative and secretarial affairs of the YDP Punjab chapter, ensuring efficient coordination.',
      level: 'PROVINCIAL', sortOrder: 22, provinceId: prov['punjab'],
    },
    {
      name: 'Mr. Aamir Nawaz',
      position: 'Director Finance YDP Punjab',
      bio: 'Mr. Aamir Nawaz oversees the financial affairs and budgeting for YDP Punjab, ensuring transparent and effective resource management.',
      level: 'PROVINCIAL', sortOrder: 23, provinceId: prov['punjab'],
    },
    {
      name: 'Ms. Bushra Malik',
      position: 'Director Education & Skills YDP Punjab',
      bio: 'Ms. Bushra Malik leads educational programs and skills development workshops across Punjab, building youth capacity for the job market.',
      level: 'PROVINCIAL', sortOrder: 24, provinceId: prov['punjab'],
    },
    {
      name: 'Mr. Shahzaib Ali',
      position: 'Director Media & IT YDP Punjab',
      bio: 'Mr. Shahzaib Ali manages digital media operations, IT infrastructure, and online communications for YDP Punjab.',
      level: 'PROVINCIAL', sortOrder: 25, provinceId: prov['punjab'],
    },
    {
      name: 'Ms. Sana Tariq',
      position: 'Director Social Welfare YDP Punjab',
      bio: 'Ms. Sana Tariq coordinates social welfare campaigns and community service activities for YDP Punjab.',
      level: 'PROVINCIAL', sortOrder: 26, provinceId: prov['punjab'],
    },
    {
      name: 'Mr. Tahir Mehmood',
      position: 'Director Health YDP Punjab',
      bio: 'Mr. Tahir Mehmood leads health awareness programs and medical camps organized by YDP Punjab.',
      level: 'PROVINCIAL', sortOrder: 27, provinceId: prov['punjab'],
    },
    {
      name: 'Ms. Rabia Noreen',
      position: 'Director Women Affairs YDP Punjab',
      bio: 'Ms. Rabia Noreen champions women empowerment and gender equality initiatives within the YDP Punjab chapter.',
      level: 'PROVINCIAL', sortOrder: 28, provinceId: prov['punjab'],
    },
    {
      name: 'Mr. Waqas Javed',
      position: 'Director Environment YDP Punjab',
      bio: 'Mr. Waqas Javed leads environmental awareness campaigns and green initiatives across Punjab under the YDP banner.',
      level: 'PROVINCIAL', sortOrder: 29, provinceId: prov['punjab'],
    },

    // =================== SINDH CABINET ===================
    {
      name: 'Ms. Sassi Rahim',
      position: 'President YDP Sindh',
      bio: 'Ms. Sassi Rahim leads the YDP Sindh chapter, driving provincial strategy and youth engagement. She coordinates with districts and the national body to oversee welfare and development projects in Sindh.',
      level: 'PROVINCIAL', sortOrder: 30, provinceId: prov['sindh'],
    },
    {
      name: 'Mr. Zubair Ahmed',
      position: 'Vice President YDP Sindh',
      bio: 'Mr. Zubair Ahmed serves as Vice President of YDP Sindh, supporting the provincial president in leadership and policy implementation.',
      level: 'PROVINCIAL', sortOrder: 31, provinceId: prov['sindh'],
    },
    {
      name: 'Ms. Ayesha Soomro',
      position: 'General Secretary YDP Sindh',
      bio: 'Ms. Ayesha Soomro manages the administrative functions of YDP Sindh, ensuring smooth coordination between provincial and national offices.',
      level: 'PROVINCIAL', sortOrder: 32, provinceId: prov['sindh'],
    },
    {
      name: 'Mr. Kamran Shaikh',
      position: 'Director Finance YDP Sindh',
      bio: 'Mr. Kamran Shaikh oversees financial planning and resource management for all YDP Sindh programs and initiatives.',
      level: 'PROVINCIAL', sortOrder: 33, provinceId: prov['sindh'],
    },
    {
      name: 'Ms. Nimra Qazi',
      position: 'Director Education YDP Sindh',
      bio: 'Ms. Nimra Qazi leads educational and capacity-building programs across Sindh, working to reduce the education gap among youth.',
      level: 'PROVINCIAL', sortOrder: 34, provinceId: prov['sindh'],
    },
    {
      name: 'Mr. Asad Chandio',
      position: 'Director Media & Communications YDP Sindh',
      bio: "Mr. Asad Chandio manages media relations and public communications for YDP Sindh, amplifying the chapter's outreach.",
      level: 'PROVINCIAL', sortOrder: 35, provinceId: prov['sindh'],
    },
    {
      name: 'Ms. Fatima Baloch',
      position: 'Director Social Welfare YDP Sindh',
      bio: 'Ms. Fatima Baloch coordinates social welfare programs including food drives, medical camps, and community support in Sindh.',
      level: 'PROVINCIAL', sortOrder: 36, provinceId: prov['sindh'],
    },
    {
      name: 'Mr. Rafiq Memon',
      position: 'Director Legal Affairs YDP Sindh',
      bio: 'Mr. Rafiq Memon handles legal matters and policy advocacy for the YDP Sindh chapter.',
      level: 'PROVINCIAL', sortOrder: 37, provinceId: prov['sindh'],
    },
    {
      name: 'Ms. Saima Lashari',
      position: 'Director Women Empowerment YDP Sindh',
      bio: 'Ms. Saima Lashari leads women empowerment and gender equality programs for YDP Sindh, creating opportunities for young women.',
      level: 'PROVINCIAL', sortOrder: 38, provinceId: prov['sindh'],
    },
    {
      name: 'Mr. Imran Shaikh',
      position: 'Director Youth Engagement YDP Sindh',
      bio: 'Mr. Imran Shaikh designs and runs youth engagement campaigns, competitions, and activities across Sindh.',
      level: 'PROVINCIAL', sortOrder: 39, provinceId: prov['sindh'],
    },

    // =================== BALOCHISTAN CABINET ===================
    {
      name: 'Mr. Mumtaz Ahmad',
      position: 'President YDP Balochistan',
      bio: 'Mr. Mumtaz Ahmad represents the youth of Balochistan at the national level. He leads capacity building and welfare initiatives, promoting inclusion and regional development across Balochistan.',
      level: 'PROVINCIAL', sortOrder: 40, provinceId: prov['balochistan'],
    },
    {
      name: 'Ms. Nargis Naeem',
      position: 'Vice President YDP Balochistan',
      bio: 'Ms. Nargis Naeem serves as Vice President of YDP Balochistan, supporting provincial leadership in youth development programs.',
      level: 'PROVINCIAL', sortOrder: 41, provinceId: prov['balochistan'],
    },
    {
      name: 'Mr. Abid Rind',
      position: 'General Secretary YDP Balochistan',
      bio: 'Mr. Abid Rind manages the administrative and secretarial operations of YDP Balochistan, ensuring smooth organizational functioning.',
      level: 'PROVINCIAL', sortOrder: 42, provinceId: prov['balochistan'],
    },
    {
      name: 'Ms. Gulnaz Mengal',
      position: 'Director Education YDP Balochistan',
      bio: 'Ms. Gulnaz Mengal leads educational initiatives and literacy programs for underprivileged youth across Balochistan.',
      level: 'PROVINCIAL', sortOrder: 43, provinceId: prov['balochistan'],
    },
    {
      name: 'Mr. Daud Marri',
      position: 'Director Finance YDP Balochistan',
      bio: 'Mr. Daud Marri handles financial planning, accounting, and resource management for YDP Balochistan.',
      level: 'PROVINCIAL', sortOrder: 44, provinceId: prov['balochistan'],
    },
    {
      name: 'Ms. Saba Kakar',
      position: 'Director Women Affairs YDP Balochistan',
      bio: 'Ms. Saba Kakar champions gender equality and women empowerment initiatives in Balochistan, creating safe spaces for young women to thrive.',
      level: 'PROVINCIAL', sortOrder: 45, provinceId: prov['balochistan'],
    },
    {
      name: 'Mr. Faraz Zehri',
      position: 'Director Media & Communications YDP Balochistan',
      bio: 'Mr. Faraz Zehri manages media outreach and public communications for the YDP Balochistan chapter.',
      level: 'PROVINCIAL', sortOrder: 46, provinceId: prov['balochistan'],
    },
    {
      name: 'Ms. Rehana Bugti',
      position: 'Director Social Welfare YDP Balochistan',
      bio: 'Ms. Rehana Bugti coordinates humanitarian and social welfare activities across Balochistan under the YDP umbrella.',
      level: 'PROVINCIAL', sortOrder: 47, provinceId: prov['balochistan'],
    },
    {
      name: 'Mr. Bashir Lehri',
      position: 'Director Youth Engagement YDP Balochistan',
      bio: 'Mr. Bashir Lehri designs youth-focused activities, competitions, and capacity-building events for Balochistan youth.',
      level: 'PROVINCIAL', sortOrder: 48, provinceId: prov['balochistan'],
    },
    {
      name: 'Ms. Maryam Musakhail',
      position: 'Director Health & Environment YDP Balochistan',
      bio: 'Ms. Maryam Musakhail leads health awareness drives and environmental campaigns across Balochistan.',
      level: 'PROVINCIAL', sortOrder: 49, provinceId: prov['balochistan'],
    },

    // =================== KASHMIR CABINET ===================
    {
      name: 'Ms. Syeda Zahra Fatima',
      position: 'President YDP Kashmir',
      bio: 'Ms. Syeda Zahra Fatima leads the YDP Kashmir chapter, working to empower young people in Azad Kashmir through leadership development, civic engagement, and community service.',
      level: 'PROVINCIAL', sortOrder: 50, provinceId: prov['kashmir'],
    },
    {
      name: 'Mr. Adnan Mirza',
      position: 'Vice President YDP Kashmir',
      bio: 'Mr. Adnan Mirza supports the YDP Kashmir president in provincial administration and youth development programs in Azad Kashmir.',
      level: 'PROVINCIAL', sortOrder: 51, provinceId: prov['kashmir'],
    },
    {
      name: 'Ms. Rabia Siddiqui',
      position: 'General Secretary YDP Kashmir',
      bio: 'Ms. Rabia Siddiqui manages the administrative affairs of YDP Kashmir, coordinating between the provincial and national offices.',
      level: 'PROVINCIAL', sortOrder: 52, provinceId: prov['kashmir'],
    },
    {
      name: 'Mr. Tariq Hussain',
      position: 'Director Finance YDP Kashmir',
      bio: 'Mr. Tariq Hussain manages financial affairs and resource planning for YDP Kashmir programs.',
      level: 'PROVINCIAL', sortOrder: 53, provinceId: prov['kashmir'],
    },
    {
      name: 'Ms. Shazia Qayyum',
      position: 'Director Education YDP Kashmir',
      bio: 'Ms. Shazia Qayyum leads education and scholarship programs for youth in Azad Kashmir.',
      level: 'PROVINCIAL', sortOrder: 54, provinceId: prov['kashmir'],
    },
    {
      name: 'Mr. Imtiaz Raja',
      position: 'Director Media & Communications YDP Kashmir',
      bio: 'Mr. Imtiaz Raja handles public communications and social media outreach for the YDP Kashmir chapter.',
      level: 'PROVINCIAL', sortOrder: 55, provinceId: prov['kashmir'],
    },
    {
      name: 'Ms. Sana Abbasi',
      position: 'Director Social Welfare YDP Kashmir',
      bio: 'Ms. Sana Abbasi coordinates social welfare and community service activities across Azad Kashmir.',
      level: 'PROVINCIAL', sortOrder: 56, provinceId: prov['kashmir'],
    },
    {
      name: 'Mr. Kashif Butt',
      position: 'Director Youth Engagement YDP Kashmir',
      bio: 'Mr. Kashif Butt designs youth activities, leadership camps, and civic engagement programs in Kashmir.',
      level: 'PROVINCIAL', sortOrder: 57, provinceId: prov['kashmir'],
    },
    {
      name: 'Ms. Madiha Gulzar',
      position: 'Director Women Empowerment YDP Kashmir',
      bio: 'Ms. Madiha Gulzar leads women empowerment and gender equality programs for YDP Kashmir.',
      level: 'PROVINCIAL', sortOrder: 58, provinceId: prov['kashmir'],
    },
    {
      name: 'Mr. Naseem Chaudhry',
      position: 'Director Health & Environment YDP Kashmir',
      bio: 'Mr. Naseem Chaudhry oversees health awareness and environmental programs for YDP Kashmir.',
      level: 'PROVINCIAL', sortOrder: 59, provinceId: prov['kashmir'],
    },
  ]

  let created = 0
  let skipped = 0

  for (const member of cabinetMembers) {
    const existing = await prisma.leadershipProfile.findFirst({
      where: { name: member.name, position: member.position },
    })

    if (!existing) {
      await prisma.leadershipProfile.create({
        data: { ...member, photo: null } as any,
      })
      console.log(`✅ Created: ${member.name} – ${member.position}`)
      created++
    } else {
      console.log(`⏭  Skipped (exists): ${member.name} – ${member.position}`)
      skipped++
    }
  }

  console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
