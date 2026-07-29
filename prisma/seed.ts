import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding YDP database...')

  // =================== ADMIN USER ===================
  const hashedPassword = await bcrypt.hash('YDP@Admin2024!', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ydp.pk' },
    update: {},
    create: {
      email: 'admin@ydp.pk',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
      isActive: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // =================== PROVINCES ===================
  const provinces = [
    { name: 'Punjab', slug: 'punjab', capital: 'Lahore', description: 'Youth Development Program Punjab leads provincial strategy and youth engagement. The Punjab chapter coordinates with districts and the national body, overseeing welfare and development projects across the province.', sortOrder: 1 },
    { name: 'Khyber Pakhtunkhwa', slug: 'kpk', capital: 'Peshawar', description: 'YDP KP heads all YDP initiatives in Khyber Pakhtunkhwa, strengthening youth participation and leadership, and acting as a liaison with government and civil society organizations.', sortOrder: 2 },
    { name: 'Sindh', slug: 'sindh', capital: 'Karachi', description: 'YDP Sindh leads provincial strategy and youth engagement, coordinating with districts and the national body to oversee welfare and development projects across Sindh.', sortOrder: 3 },
    { name: 'Balochistan', slug: 'balochistan', capital: 'Quetta', description: 'YDP Balochistan represents the youth of Balochistan at the national level, leading capacity building and welfare initiatives while promoting inclusion and regional development.', sortOrder: 4 },
    { name: 'Kashmir', slug: 'kashmir', capital: 'Muzaffarabad', description: 'YDP Kashmir works to empower young people in Azad Kashmir through leadership development, civic engagement, and community service initiatives.', sortOrder: 5 },
  ]

  const createdProvinces: Record<string, string> = {}
  for (const province of provinces) {
    const p = await prisma.province.upsert({
      where: { slug: province.slug },
      update: {},
      create: { ...province, isActive: true },
    })
    createdProvinces[province.slug] = p.id
    console.log(`✅ Province created: ${province.name}`)
  }

  // =================== DISTRICTS ===================
  const districtData: Record<string, string[]> = {
    punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Jhang', 'Rahim Yar Khan', 'Kasur', 'Gujrat', 'Sahiwal', 'Okara'],
    kpk: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Mansehra', 'Kohat', 'Bannu', 'Dera Ismail Khan', 'Nowshera', 'Charsadda', 'Haripur', 'Swabi', 'Buner', 'Dir Lower', 'Dir Upper'],
    sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpurkhas', 'Jacobabad', 'Shikarpur', 'Khairpur', 'Dadu', 'Thatta', 'Badin', 'Tharparkar', 'Sanghar', 'Matiari'],
    balochistan: ['Quetta', 'Turbat', 'Khuzdar', 'Hub', 'Gwadar', 'Chaman', 'Zhob', 'Pishin', 'Loralai', 'Sibi', 'Kalat', 'Mastung', 'Nushki', 'Panjgur', 'Washuk'],
    kashmir: ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli', 'Bagh', 'Haveli', 'Sudhnati', 'Neelum', 'Hattian', 'Jhelum Valley'],
  }

  for (const [slug, districts] of Object.entries(districtData)) {
    for (const districtName of districts) {
      await prisma.district.create({
        data: {
          name: districtName,
          provinceId: createdProvinces[slug],
          isActive: true,
        },
      }).catch(() => {}) // ignore duplicates
    }
    console.log(`✅ Districts created for ${slug}`)
  }

  // =================== LEADERSHIP PROFILES ===================
  const leadershipData = [
    // National Level
    {
      name: 'Hamza Rehman',
      position: 'Founder & President',
      bio: 'Hamza Rehman is the Founder & President of the Youth Development Program (YDP), a youth-led initiative dedicated to empowering young people through education, leadership development, social engagement, and community service. He is a journalist, social activist, digital media professional, and youth leader committed to creating opportunities for youth and promoting positive change in society. Through YDP, he continues to inspire and support young individuals in achieving their personal and professional goals.',
      photo: '/images/leadership/hamza-rehman.jpg',
      level: 'NATIONAL',
      sortOrder: 1,
      provinceId: null,
    },
    {
      name: 'Sohail Hussain',
      position: 'President, Human Welfare Organization',
      bio: 'Mr. Sohail Hussain serves as the President of the Human Welfare Organization (HWO), the registered welfare wing under Youth Development Program (YDP). He leads humanitarian assistance and social development initiatives across Pakistan.',
      photo: null,
      level: 'HWO',
      sortOrder: 2,
      provinceId: null,
    },
    {
      name: 'Ms. Ayesha Afridi',
      position: 'Director Operations',
      bio: 'Ms. Ayesha Afridi serves as the Director of Operations at YDP, overseeing the day-to-day operations and strategic implementation of YDP programs across Pakistan.',
      photo: null,
      level: 'NATIONAL',
      sortOrder: 3,
      provinceId: null,
    },
    {
      name: 'Dr. Anila Khan',
      position: 'Country Head',
      bio: 'Dr. Anila Khan serves as the Country Head of YDP, providing strategic leadership and national coordination for all YDP programs and initiatives across Pakistan.',
      photo: null,
      level: 'NATIONAL',
      sortOrder: 4,
      provinceId: null,
    },
    {
      name: 'Ms. Qurat ul Ain',
      position: 'Executive Member',
      bio: 'Ms. Qurat ul Ain is an Executive Member of YDP, contributing to the strategic decision-making and governance of the organization at the national level.',
      photo: null,
      level: 'NATIONAL',
      sortOrder: 5,
      provinceId: null,
    },
    {
      name: 'Mr. Ammar Bashir',
      position: 'Brand Ambassador',
      bio: 'Mr. Ammar Bashir serves as a Brand Ambassador for YDP, representing the organization and promoting youth development values across Pakistan.',
      photo: null,
      level: 'NATIONAL',
      sortOrder: 6,
      provinceId: null,
    },
    {
      name: 'Mr. Basit Ali',
      position: 'Brand Ambassador',
      bio: 'Mr. Basit Ali serves as a Brand Ambassador for YDP, helping to promote the organization\'s mission and inspire youth across the country.',
      photo: null,
      level: 'NATIONAL',
      sortOrder: 7,
      provinceId: null,
    },
    {
      name: 'Dr. Mahnoor Tahir',
      position: 'Brand Ambassador',
      bio: 'Dr. Mahnoor Tahir serves as a Brand Ambassador for YDP, advocating for youth empowerment and leadership development initiatives.',
      photo: null,
      level: 'NATIONAL',
      sortOrder: 8,
      provinceId: null,
    },
    // Provincial Level
    {
      name: 'Ms. Kainat Sabir',
      position: 'Regional Director KP',
      bio: 'Ms. Kainat Sabir serves as the Regional Director for Khyber Pakhtunkhwa, overseeing YDP operations and youth development initiatives across the KP region.',
      photo: null,
      level: 'PROVINCIAL',
      sortOrder: 9,
      provinceId: createdProvinces['kpk'],
    },
    {
      name: 'Ms. Sualeha Kanwal',
      position: 'President YDP Punjab',
      bio: 'Ms. Sualeha Kanwal is the President of YDP Punjab. She is the overall head of YDP activities in Punjab, implementing national policies at the provincial level and representing Punjab youth at national forums.',
      photo: null,
      level: 'PROVINCIAL',
      sortOrder: 10,
      provinceId: createdProvinces['punjab'],
    },
    {
      name: 'Ms. Sassi Rahim',
      position: 'President YDP Sindh',
      bio: 'Ms. Sassi Rahim leads the YDP Sindh chapter, driving provincial strategy and youth engagement. She coordinates with districts and the national body to oversee welfare and development projects in Sindh.',
      photo: null,
      level: 'PROVINCIAL',
      sortOrder: 11,
      provinceId: createdProvinces['sindh'],
    },
    {
      name: 'Mr. Bilal Jawad',
      position: 'President YDP KPK',
      bio: 'Mr. Bilal Jawad heads all YDP initiatives in Khyber Pakhtunkhwa, strengthening youth participation and leadership, and serving as a liaison with government and civil society organizations.',
      photo: null,
      level: 'PROVINCIAL',
      sortOrder: 12,
      provinceId: createdProvinces['kpk'],
    },
    {
      name: 'Mr. Mumtaz Ahmad',
      position: 'President YDP Balochistan',
      bio: 'Mr. Mumtaz Ahmad represents the youth of Balochistan at the national level. He leads capacity building and welfare initiatives, promoting inclusion and regional development across Balochistan.',
      photo: null,
      level: 'PROVINCIAL',
      sortOrder: 13,
      provinceId: createdProvinces['balochistan'],
    },
    {
      name: 'Ms. Syeda Zahra Fatima',
      position: 'President YDP Kashmir',
      bio: 'Ms. Syeda Zahra Fatima leads the YDP Kashmir chapter, working to empower young people in Azad Kashmir through leadership development, civic engagement, and community service.',
      photo: null,
      level: 'PROVINCIAL',
      sortOrder: 14,
      provinceId: createdProvinces['kashmir'],
    },
  ]

  for (const leader of leadershipData) {
    await prisma.leadershipProfile.create({ data: leader as any }).catch(() => {})
  }
  console.log('✅ Leadership profiles created')

  // =================== NEWS CATEGORIES ===================
  const categories = [
    { name: 'Youth Leadership', slug: 'youth-leadership', color: '#1B2A6B' },
    { name: 'Social Welfare', slug: 'social-welfare', color: '#4CAF50' },
    { name: 'Events', slug: 'events', color: '#00BCD4' },
    { name: 'Announcements', slug: 'announcements', color: '#FFC107' },
    { name: 'Success Stories', slug: 'success-stories', color: '#E91E63' },
    { name: 'Press Release', slug: 'press-release', color: '#9C27B0' },
  ]

  for (const cat of categories) {
    await prisma.newsCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ News categories created')

  // =================== TESTIMONIALS ===================
  const testimonials = [
    {
      name: 'Ahmad Khan',
      position: 'YDP Member, Lahore',
      quote: 'Joining YDP was one of the best decisions of my life. The leadership training I received helped me secure my first job and become a more confident individual.',
      rating: 5,
      sortOrder: 1,
    },
    {
      name: 'Fatima Malik',
      position: 'Volunteer, YDP KP',
      quote: 'YDP has given me a platform to contribute positively to my community. Through the social welfare programs, I have seen real change in people\'s lives.',
      rating: 5,
      sortOrder: 2,
    },
    {
      name: 'Muhammad Usman',
      position: 'Youth Parliament Participant',
      quote: 'The Youth Parliament organized by YDP was an eye-opening experience. I learned about democracy, policy-making, and the importance of civic engagement.',
      rating: 5,
      sortOrder: 3,
    },
    {
      name: 'Zara Hussain',
      position: 'Skills Training Graduate',
      quote: 'The digital skills training program by YDP transformed my career. I went from being unemployed to running my own social media business within months.',
      rating: 5,
      sortOrder: 4,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial }).catch(() => {})
  }
  console.log('✅ Testimonials created')

  // =================== SETTINGS ===================
  const settings = [
    { key: 'site_name', value: 'Youth Development Program', type: 'text', group: 'general', label: 'Site Name' },
    { key: 'site_tagline', value: 'Empowering Youth – Shaping the Future', type: 'text', group: 'general', label: 'Site Tagline' },
    { key: 'site_description', value: 'YDP is a youth-led, youth-focused, and purpose-driven platform established to empower young individuals across Pakistan through leadership development, civic engagement, education, and social welfare initiatives.', type: 'text', group: 'general', label: 'Site Description' },
    { key: 'contact_email', value: 'infoyda2024@gmail.com', type: 'text', group: 'contact', label: 'Contact Email' },
    { key: 'contact_phone', value: '+92 311 9250771', type: 'text', group: 'contact', label: 'Contact Phone' },
    { key: 'contact_address', value: 'Pakistan', type: 'text', group: 'contact', label: 'Contact Address' },
    { key: 'facebook_url', value: '', type: 'text', group: 'social', label: 'Facebook URL' },
    { key: 'twitter_url', value: '', type: 'text', group: 'social', label: 'Twitter URL' },
    { key: 'instagram_url', value: '', type: 'text', group: 'social', label: 'Instagram URL' },
    { key: 'youtube_url', value: '', type: 'text', group: 'social', label: 'YouTube URL' },
    { key: 'whatsapp_number', value: '+923119250771', type: 'text', group: 'social', label: 'WhatsApp Number' },
    { key: 'meta_title', value: 'Youth Development Program (YDP) – Empowering Youth, Shaping the Future', type: 'text', group: 'seo', label: 'Default Meta Title' },
    { key: 'meta_description', value: 'YDP is Pakistan\'s premier youth-led organisation working to empower young people through leadership development, civic engagement, education, and social welfare across all four provinces.', type: 'text', group: 'seo', label: 'Default Meta Description' },
    { key: 'google_analytics_id', value: '', type: 'text', group: 'analytics', label: 'Google Analytics ID' },
    { key: 'founded_year', value: '2024', type: 'text', group: 'general', label: 'Founded Year' },
    { key: 'total_members', value: '5000+', type: 'text', group: 'stats', label: 'Total Members' },
    { key: 'total_provinces', value: '5', type: 'text', group: 'stats', label: 'Provinces' },
    { key: 'total_events', value: '50+', type: 'text', group: 'stats', label: 'Events Conducted' },
    { key: 'total_volunteers', value: '1000+', type: 'text', group: 'stats', label: 'Volunteers' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Settings created')

  console.log('\n🎉 YDP database seeded successfully!')
  console.log('\n📧 Admin Login:')
  console.log('   Email: admin@ydp.pk')
  console.log('   Password: YDP@Admin2024!')
  console.log('\n⚠️  Please change the admin password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
