import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

// Collections cleared before (re)seeding. Demo template collections are
// cleared too so the ACRO content fully replaces the starter content.
const collectionsToClear: CollectionSlug[] = [
  'news',
  'alumni',
  'events',
  'donors',
  'team-members',
  'alumni-registrations',
  'contact-submissions',
]

type SeedFile = { name: string; data: Buffer; mimetype: string; size: number }

// Minimal Lexical editor state from one or more paragraphs of plain text.
const rt = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'text',
          text,
          format: 0,
          style: '',
          mode: 'normal' as const,
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
})

async function fetchImage(seed: string, w: number, h: number): Promise<SeedFile> {
  const url = `https://picsum.photos/seed/${seed}/${w}/${h}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image ${url}: ${res.status}`)
  const data = await res.arrayBuffer()
  return {
    name: `${seed}.jpg`,
    data: Buffer.from(data),
    mimetype: 'image/jpeg',
    size: data.byteLength,
  }
}

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding ACRO database...')
  const ctx = { disableRevalidate: true }

  payload.logger.info('— Clearing collections...')
  // Clear content collections first (fast, DB-level) so nothing references media.
  await Promise.all(
    collectionsToClear.map((collection) =>
      payload.db.deleteMany({ collection, req, where: {} }),
    ),
  )
  await Promise.all(
    collectionsToClear
      .filter((collection) => Boolean(payload.collections[collection]?.config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )
  // Clear media through the API so the underlying files are removed too (avoids
  // filename-dedupe collisions when the seed is run more than once).
  await payload.delete({ collection: 'media', where: {}, req, context: ctx })

  payload.logger.info('— Seeding media...')
  const image = async (seed: string, w: number, h: number, alt: string) => {
    const file = await fetchImage(seed, w, h)
    return payload.create({ collection: 'media', data: { alt }, file, context: ctx })
  }

  // Image pools (fetched in parallel).
  const [hero1, hero2, hero3, mission, vision, assoc, mapImg] = await Promise.all([
    image('acro-hero-1', 1600, 720, 'Alumni gathering'),
    image('acro-hero-2', 1600, 720, 'Graduates celebrating'),
    image('acro-hero-3', 1600, 720, 'University campus'),
    image('acro-mission', 900, 640, 'Students on campus'),
    image('acro-vision', 900, 640, 'Graduation ceremony'),
    image('acro-assoc', 900, 600, 'Alumni association meeting'),
    image('acro-map', 1200, 500, 'Campus map'),
  ])

  const scenePool = await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      image(`acro-scene-${i}`, 900, 560, 'Event photo'),
    ),
  )
  const portraitPool = await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      image(`acro-portrait-${i}`, 600, 600, 'Portrait'),
    ),
  )
  const scene = (i: number) => scenePool[i % scenePool.length].id
  const portrait = (i: number) => portraitPool[i % portraitPool.length].id

  payload.logger.info('— Seeding team members...')
  const acroTeam: { name: string; position: string; level: string; order: number }[] = [
    { name: 'Dr. Maria Elena S. Aldover', position: 'Director', level: 'head', order: 0 },
    { name: 'Ana Beatriz G. Reyes', position: 'Alumni Relations Officer', level: 'officer', order: 0 },
    { name: 'Juan Carlo M. Dela Cruz', position: 'Community Relations Officer', level: 'officer', order: 1 },
    { name: 'Rosa Maria P. Villanueva', position: 'Communications Officer', level: 'officer', order: 2 },
    { name: 'Engr. Paolo R. Santos', position: 'Data & Systems Staff', level: 'support', order: 0 },
    { name: 'Maricel A. Flores', position: 'Records Staff', level: 'support', order: 1 },
    { name: 'Danilo V. Ramos', position: 'Events Staff', level: 'support', order: 2 },
    { name: 'Christine Joy B. Lee', position: 'Membership Staff', level: 'support', order: 3 },
    { name: 'Mark Angelo C. Tan', position: 'Administrative Aide', level: 'support', order: 4 },
  ]
  const assocTeam: { name: string; position: string; level: string; order: number }[] = [
    { name: 'Dr. Reynaldo B. Villamor', position: 'President', level: 'head', order: 0 },
    { name: 'Engr. Carmela T. Ong', position: 'Vice President', level: 'officer', order: 0 },
    { name: 'Atty. Ferdinand L. Reyes', position: 'Secretary General', level: 'officer', order: 1 },
    { name: 'Ms. Lourdes M. Bautista', position: 'Treasurer', level: 'officer', order: 2 },
    { name: 'Dr. Elena V. Cruz', position: 'Board Member', level: 'staff', order: 0 },
    { name: 'Engr. Mario S. Tan', position: 'Board Member', level: 'staff', order: 1 },
    { name: 'Prof. Isabel G. Luna', position: 'Board Member', level: 'staff', order: 2 },
    { name: 'Dr. Paolo A. Reyes', position: 'Board Member', level: 'staff', order: 3 },
    { name: 'Atty. Grace M. Santos', position: 'Board Member', level: 'staff', order: 4 },
  ]
  let p = 0
  for (const m of acroTeam) {
    await payload.create({
      collection: 'team-members',
      data: { ...m, org: 'acro', photo: portrait(p++) } as never,
      context: ctx,
    })
  }
  for (const m of assocTeam) {
    await payload.create({
      collection: 'team-members',
      data: { ...m, org: 'association', photo: portrait(p++) } as never,
      context: ctx,
    })
  }

  payload.logger.info('— Seeding alumni...')
  const alumniData = [
    {
      name: 'Hon. Jonas C. Cortes',
      batch: 'Batch 1995',
      degree: 'BS Agriculture',
      currentRole: 'Public Servant & Community Leader',
      location: 'Cebu, Philippines',
      featured: true,
      bio: 'A proud Viscan whose leadership and public service continue to inspire generations of alumni across the region.',
    },
    {
      name: 'Engr. Jesriel C. Casinillo',
      batch: 'Batch 2008',
      degree: 'BS Civil Engineering',
      currentRole: 'Project Engineer',
      location: 'Manila, Philippines',
    },
    {
      name: 'Engr. Mark Anthony S. Arcayan',
      batch: 'Batch 2010',
      degree: 'BS Agricultural Engineering',
      currentRole: 'Design Engineer',
      location: 'Leyte, Philippines',
    },
    {
      name: 'Mark Ramirez Brazil',
      batch: 'Batch 2012',
      degree: 'BS Forestry',
      currentRole: 'Environmental Scientist',
      location: 'Davao, Philippines',
    },
    {
      name: 'Dr. Sofia L. Mendoza',
      batch: 'Batch 2005',
      degree: 'Doctor of Veterinary Medicine',
      currentRole: 'Veterinary Researcher',
      location: 'Worldwide',
    },
  ]
  let ai = 0
  for (const a of alumniData) {
    await payload.create({
      collection: 'alumni',
      data: {
        ...a,
        photo: portrait(ai),
        order: ai,
        _status: 'published',
        bio: a.bio ? rt([a.bio]) : undefined,
      } as never,
      context: ctx,
    })
    ai++
  }

  payload.logger.info('— Seeding news...')
  const newsData = [
    {
      title: 'VSU Celebrates 100 Years of Excellence',
      category: 'achievement',
      featured: true,
      excerpt:
        'Visayas State University marks a century of academic excellence, research, and community service with year-long centennial celebrations.',
      date: '2026-07-01',
    },
    {
      title: 'Grand Alumni Homecoming 2026 Draws Record Attendance',
      category: 'event',
      excerpt: 'Thousands of Viscans reunited at the Baybay campus for the biggest homecoming in VSU history.',
      date: '2026-06-20',
    },
    {
      title: 'Viscan Researchers Win National Innovation Award',
      category: 'achievement',
      excerpt: 'A VSU research team was recognized nationally for breakthroughs in sustainable agriculture.',
      date: '2026-06-05',
    },
    {
      title: 'New Scholarship Fund Launched for Rural Students',
      category: 'announcement',
      excerpt: 'ACRO and generous donors establish a new scholarship fund to support deserving students from rural communities.',
      date: '2026-05-18',
    },
    {
      title: 'ACRO Opens Regional Alumni Chapter in Cebu',
      category: 'announcement',
      excerpt: 'A new regional chapter strengthens the alumni network across the Visayas.',
      date: '2026-05-02',
    },
    {
      title: 'VSU Ranks Among Top Agricultural Universities',
      category: 'achievement',
      excerpt: 'International rankings once again place VSU among the leading agricultural institutions in the country.',
      date: '2026-04-15',
    },
    {
      title: 'Alumni Give Back: Community Outreach in Baybay',
      category: 'general',
      excerpt: 'Alumni volunteers led a community outreach program benefiting families in Baybay City.',
      date: '2026-03-28',
    },
  ]
  let ni = 0
  for (const n of newsData) {
    await payload.create({
      collection: 'news',
      data: {
        title: n.title,
        excerpt: n.excerpt,
        category: n.category,
        featured: n.featured || false,
        coverImage: scene(ni),
        content: rt([n.excerpt]),
        publishedAt: `${n.date}T09:00:00.000Z`,
        _status: 'published',
      } as never,
      context: ctx,
    })
    ni++
  }

  payload.logger.info('— Seeding events...')
  const eventsData = [
    {
      title: 'Grand Alumni Homecoming 2026',
      date: '2026-10-24T14:00:00.000Z',
      location: 'VSU Baybay Campus, Leyte',
      featured: true,
      description: 'The centennial grand homecoming brings together Viscans from every batch for a day of reunion, program, and celebration.',
    },
    { title: 'Art Exhibit: Viscan Creatives', date: '2026-09-12T10:00:00.000Z', location: 'VSU Cultural Center' },
    { title: 'Alumni Fun Run 2026', date: '2026-11-15T05:30:00.000Z', location: 'VSU Oval, Baybay' },
    { title: 'Career Networking Night', date: '2026-12-05T18:00:00.000Z', location: 'VSU Convention Hall' },
    { title: 'Centennial Alumni Homecoming', date: '2026-03-01T14:00:00.000Z', location: 'VSU Baybay Campus' },
    { title: 'HS Alumni General Assembly & Christmas Party', date: '2025-12-18T17:00:00.000Z', location: 'VSU Gymnasium' },
    { title: 'Alumni Homecoming 2025', date: '2025-10-25T14:00:00.000Z', location: 'VSU Baybay Campus' },
    { title: 'VSU Art Exhibit: Colors of the Visayas', date: '2025-08-14T10:00:00.000Z', location: 'VSU Cultural Center' },
  ]
  let ei = 0
  for (const e of eventsData) {
    await payload.create({
      collection: 'events',
      data: {
        title: e.title,
        image: scene(ei),
        startDate: e.date,
        location: e.location,
        featured: e.featured || false,
        description: e.description ? rt([e.description]) : undefined,
        _status: 'published',
      } as never,
      context: ctx,
    })
    ei++
  }

  payload.logger.info('— Seeding donors...')
  const donorsData: { name: string; tier: string }[] = [
    { name: 'SM Foundation', tier: 'gold' },
    { name: 'Ayala Foundation', tier: 'gold' },
    { name: 'Jollibee Group Foundation', tier: 'gold' },
    { name: 'Cebu Alumni Chapter', tier: 'silver' },
    { name: 'Metrobank Foundation', tier: 'silver' },
    { name: 'PLDT-Smart Foundation', tier: 'silver' },
    { name: 'BDO Foundation', tier: 'silver' },
    { name: 'Batch 1995 Alumni', tier: 'bronze' },
    { name: 'Batch 2005 Alumni', tier: 'bronze' },
    { name: 'Engr. Jesriel Casinillo', tier: 'bronze' },
    { name: 'Dr. Sofia Mendoza', tier: 'bronze' },
    { name: 'Anonymous Donor', tier: 'bronze' },
  ]
  let di = 0
  for (const d of donorsData) {
    await payload.create({
      collection: 'donors',
      data: { name: d.name, tier: d.tier, order: di++ } as never,
      context: ctx,
    })
  }

  payload.logger.info('— Seeding globals...')
  const cLink = (label: string, url: string) => ({ link: { label, url } })

  await payload.updateGlobal({
    slug: 'header',
    context: ctx,
    data: {
      logoPrimary: 'ACRO',
      logoSubtitle1: 'ALUMNI & COMMUNITY',
      logoSubtitle2: 'RELATIONS OFFICE',
      navItems: [
        cLink('Home', '/'),
        cLink('About', '/about'),
        cLink('Services', '/services'),
        cLink('Events', '/events'),
        cLink('Donors', '/donors'),
        cLink('Alumni', '/association'),
        cLink('Contact', '/contact'),
      ],
      registerButton: { label: 'Register', link: { url: '/services' } },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'footer',
    context: ctx,
    data: {
      brand: 'ACRO',
      tagline: 'Alumni & Community Relations Office — Visayas State University',
      navItems: [cLink('Privacy', '#'), cLink('Terms', '#'), cLink('Feedback', '#')],
      copyright:
        '© 2026 Alumni & Community Relations Office — Visayas State University. All rights reserved.',
    } as never,
  })

  await payload.updateGlobal({
    slug: 'homePage',
    context: ctx,
    data: {
      heroSlides: [
        {
          image: hero1.id,
          heading: 'Become an Official Alumnus',
          subheading:
            'Register with ACRO and unlock exclusive alumni benefits and lifelong connections.',
          ctaLabel: 'Register Now',
          link: { url: '/services' },
        },
        {
          image: hero2.id,
          heading: 'Share Your Story',
          subheading: 'Contribute news, achievements, and updates to inspire fellow Viscans.',
          ctaLabel: 'Get Involved',
          link: { url: '/contact' },
        },
        {
          image: hero3.id,
          heading: 'Join Your Chapter',
          subheading: 'Connect with alumni chapters across the Philippines and beyond.',
          ctaLabel: 'Find a Chapter',
          link: { url: '/association' },
        },
      ],
      pageHeader: {
        caption: 'WELCOME',
        title: 'Announcements',
        description:
          'Stay updated with the latest news, achievements, and events from the Viscan community.',
      },
      newsCaption: 'LATEST NEWS',
      newsTitle: 'News & Announcements',
      alumniCaption: 'PROUD VISCANS',
      alumniTitle: 'Featured Alumni',
      alumniSubtitle:
        'Celebrating the achievements and contributions of Visayas State University graduates.',
    } as never,
  })

  await payload.updateGlobal({
    slug: 'aboutPage',
    context: ctx,
    data: {
      pageHeader: {
        caption: 'WHO WE ARE',
        title: 'About ACRO',
        description: 'Learn about the Alumni & Community Relations Office and our dedicated team.',
      },
      mission: {
        heading: 'Our Mission',
        image: mission.id,
        body: rt([
          'The Alumni & Community Relations Office fosters lifelong connections between Visayas State University and its graduates, strengthening a global network of engaged and supportive alumni.',
        ]),
      },
      vision: {
        heading: 'Our Vision',
        image: vision.id,
        body: rt([
          'To build an empowered and globally-connected community of Viscan alumni who give back, mentor, and advance the mission of their alma mater.',
        ]),
      },
      stats: [
        { value: '10,000+', label: 'Alumni Worldwide' },
        { value: '100', label: 'Years of Excellence' },
        { value: '50+', label: 'Alumni Chapters' },
        { value: '200+', label: 'Batch Representatives' },
        { value: '15', label: 'Dedicated Staff' },
      ],
    } as never,
  })

  await payload.updateGlobal({
    slug: 'servicesPage',
    context: ctx,
    data: {
      pageHeader: {
        caption: 'ALUMNI SERVICES',
        title: 'Alumni Membership',
        description:
          'Register as an official alumnus of Visayas State University and access exclusive benefits.',
      },
      benefitsHeading: 'Alumni Membership Benefits',
      benefitsIntro: rt([
        'Becoming an official member of the VSU Alumni Association connects you to a lifelong community and a range of exclusive services.',
      ]),
      benefits: [
        { text: 'Official VSUAAI Alumni ID' },
        { text: 'Invitations to homecomings and reunions' },
        { text: 'Access to the alumni directory and network' },
        { text: 'Career and mentorship opportunities' },
        { text: 'Exclusive updates and publications' },
      ],
      privacyNotice:
        'Your personal data is collected and processed in accordance with the Data Privacy Act of 2012. ACRO will only use your information for alumni relations purposes.',
      formIntro: 'Membership Registration Form',
    } as never,
  })

  await payload.updateGlobal({
    slug: 'eventsPage',
    context: ctx,
    data: {
      pageHeader: {
        caption: 'UPCOMING',
        title: 'Events',
        description:
          'Join us for university anniversaries, alumni homecomings, and community gatherings.',
      },
      ctaBand: {
        heading: "Don't Miss Out",
        description:
          'Stay connected and never miss an alumni event. Register with ACRO to receive invitations and updates.',
        primaryCta: { label: 'Register', url: '/services' },
        secondaryCta: { label: 'Contact Us', url: '/contact' },
      },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'donorsPage',
    context: ctx,
    data: {
      pageHeader: {
        caption: 'GIVE TO VSU',
        title: 'Donors Board',
        description:
          'Support Visayas State University through donations to scholarships, infrastructure, and research.',
      },
      introTitle: 'Your Generosity Makes a Difference',
      introBody:
        'Every contribution to Visayas State University empowers students, strengthens infrastructure, advances research, and builds a brighter future for the Viscan community.',
      categories: [
        {
          heading: 'General Fund',
          body: "Support the university's most pressing needs and priority programs.",
          amounts: '₱500 · ₱1,000 · ₱5,000',
        },
        {
          heading: 'Infrastructure',
          body: 'Help build and modernize classrooms, laboratories, and facilities.',
          amounts: '₱1,000 · ₱5,000 · ₱10,000',
        },
        {
          heading: 'Research',
          body: 'Fund cutting-edge research in agriculture, forestry, and the sciences.',
          amounts: '₱2,000 · ₱10,000 · ₱25,000',
        },
        {
          heading: 'Scholarship',
          body: 'Empower deserving students with financial assistance and grants.',
          amounts: '₱1,000 · ₱5,000 · ₱20,000',
        },
      ],
      honorRollCaption: 'THANK YOU',
      honorRollTitle: 'Donors Honor Roll',
      honorRollDescription:
        "Recognizing the generous individuals and organizations who have contributed to VSU's growth.",
      ctaBand: {
        heading: 'Ready to make an impact?',
        description:
          'Contact ACRO to learn more about giving opportunities and how your donation can change lives.',
        primaryCta: { label: 'Get in Touch', url: '/contact' },
      },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'associationPage',
    context: ctx,
    data: {
      pageHeader: {
        caption: 'ALUMNI NETWORK',
        title: 'Alumni Association',
        description:
          'Explore the organizational structure and leadership of the VSU Alumni Association.',
      },
      intro: {
        heading: 'The VSU Alumni Association',
        image: assoc.id,
        body: rt([
          'The Visayas State University Alumni Association serves as the unified body representing all VSU graduates, working to strengthen the bond between alumni and their alma mater.',
          'With chapters across the Philippines and abroad, the association provides a platform for alumni to reconnect, collaborate, and contribute to the development of VSU and its communities.',
        ]),
      },
      orgChartTitle: 'Organizational Structure',
    } as never,
  })

  await payload.updateGlobal({
    slug: 'contactPage',
    context: ctx,
    data: {
      pageHeader: {
        caption: 'GET IN TOUCH',
        title: 'Contact Us',
        description:
          'Reach out to the Alumni & Community Relations Office for inquiries and support.',
      },
      infoTitle: 'Get in Touch',
      infoDescription:
        "We'd love to hear from you. Whether you have questions about alumni registration, events, or donations, our team is ready to assist.",
      contactInfo: {
        address: 'ACRO Building, Visayas State University\nVisca, Baybay City, Leyte 6521-A, Philippines',
        phone: '+63 53 565 0600',
        email: 'acro@vsu.edu.ph',
        hours: 'Monday – Friday, 8:00 AM – 5:00 PM',
        socials: [
          { platform: 'Facebook', url: '#' },
          { platform: 'Twitter / X', url: '#' },
          { platform: 'Instagram', url: '#' },
        ],
      },
      mapImage: mapImg.id,
      formTitle: 'Send us a Message',
    } as never,
  })

  payload.logger.info('Seeded ACRO database successfully!')
}
