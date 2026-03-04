import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import VisualGrid from '@/components/ui/visual-grid';
import { sqlite } from '@/lib/prisma';

export default function Home() {
  // Load top 3 published courses to feature as programs so admin-managed data drives the homepage.
  // Ensure core service programs exist in the DB (the admin will populate modules later), then load published courses.
  const corePrograms = [
    {
      title: '2-Week Video Editing Intensive',
      slug: '2-week-video-editing-intensive',
      description: '3 students per cohort\nPhysical, mentor-led\nPremium positioning\nSkill certification',
      price: 100000,
      duration: '2 weeks',
      level: 'Beginner',
      category: 'Video Editing',
      thumbnail: null,
      isPublished: 1,
    },
    {
      title: '1-on-1 Mastery Track',
      slug: '1-on-1-mastery-track',
      description: 'High-touch mentorship\nFlexible schedule\nFor professionals\nPrivate access',
      price: 600000,
      duration: 'Flexible',
      level: 'Advanced',
      category: 'Video Editing',
      thumbnail: null,
      isPublished: 1,
    },
    {
      title: 'Online Video Editing',
      slug: 'online-video-editing',
      description: 'Self-paced learning\nDigital access\nNo mentorship\nSkill training only',
      price: 30000,
      duration: 'Self-paced',
      level: 'Beginner',
      category: 'Video Editing',
      thumbnail: null,
      isPublished: 1,
    },
  ];

  const nowIso = new Date().toISOString();
  for (const p of corePrograms) {
    try {
      const exists = sqlite.prepare('SELECT id FROM "Course" WHERE slug = ?').get(p.slug);
      if (!exists) {
        sqlite.prepare(
          `INSERT INTO "Course" (id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run((globalThis as any).crypto?.randomUUID?.() ?? String(Date.now()), p.title, p.slug, p.description, p.thumbnail, p.price, p.duration, p.level, p.isPublished, p.category, nowIso, nowIso);
      }
    } catch (e) {
      try {
        const existsLower = sqlite.prepare('SELECT id FROM courses WHERE slug = ?').get(p.slug);
        if (!existsLower) {
          sqlite.prepare(
            `INSERT INTO courses (id, title, slug, description, thumbnail, price, duration, level, isPublished, category, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).run((globalThis as any).crypto?.randomUUID?.() ?? String(Date.now()), p.title, p.slug, p.description, p.thumbnail, p.price, p.duration, p.level, p.isPublished, p.category, nowIso, nowIso);
        }
      } catch (e2) {
        // ignore insertion errors (table may not exist in some dev setups)
      }
    }
  }

  // Be resilient to DB table name differences and fall back to the three canonical sample programs.
  let programs: any[] = [];
  try {
    const fromCourse = sqlite.prepare(`SELECT id, title, slug, description, thumbnail, price, duration, level, category, isPublished FROM "Course" WHERE isPublished = 1 ORDER BY createdAt DESC LIMIT 3`).all();
    if (Array.isArray(fromCourse) && fromCourse.length) {
      programs = fromCourse as any[];
    } else {
      const fromLower = sqlite.prepare(`SELECT id, title, slug, description, thumbnail, price, duration, level, category, isPublished FROM courses WHERE isPublished = 1 ORDER BY createdAt DESC LIMIT 3`).all();
      if (Array.isArray(fromLower) && fromLower.length) programs = fromLower as any[];
    }
  } catch (e) {
    // ignore DB errors and fall back to defaults below
  }

  if (!programs.length) {
    const fallbackPrograms = [
      {
        id: 'sample-1',
        title: '2-Week Video Editing Intensive',
        slug: '2-week-video-editing-intensive',
        description: '3 students per cohort\nPhysical, mentor-led\nPremium positioning\nSkill certification',
        price: 100000,
        duration: '2 weeks',
        level: 'Beginner',
        category: 'Video Editing',
        thumbnail: null,
      },
      {
        id: 'sample-2',
        title: '1-on-1 Mastery Track',
        slug: '1-on-1-mastery-track',
        description: 'High-touch mentorship\nFlexible schedule\nFor professionals\nPrivate access',
        price: 600000,
        duration: 'Flexible',
        level: 'Advanced',
        category: 'Video Editing',
        thumbnail: null,
      },
      {
        id: 'sample-3',
        title: 'Online Video Editing',
        slug: 'online-video-editing',
        description: 'Self-paced learning\nDigital access\nNo mentorship\nSkill training only',
        price: 30000,
        duration: 'Self-paced',
        level: 'Beginner',
        category: 'Video Editing',
        thumbnail: null,
      },
    ];
    programs = fallbackPrograms;
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <ScrollMorphHero />

      {/* Stats bar — sits exactly at the seam between hero and next section */}
      <div className="relative z-30 -mt-10 -mb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-y-5 gap-x-6 md:gap-0 py-5 px-6 md:px-10 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/50">
            {[
              { value: '3', label: 'Students per cohort' },
              { value: '₦100K+', label: 'Investment starts at' },
              { value: '5 Mo.', label: 'Alumni track duration' },
              { value: 'Lagos', label: 'Physical campus' },
            ].map((stat, i) => (
              <span key={stat.label} className="contents">
                {i > 0 && (
                  <span className="hidden md:block h-8 w-px bg-white/[0.08]" />
                )}
                <span className="text-center px-4 min-w-[120px]">
                  <p className="text-lg md:text-xl font-display font-bold text-white/90 mb-0.5">
                    {stat.value}
                  </p>
                  <p className="text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-white/35">
                    {stat.label}
                  </p>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <section className="py-28 px-6 relative overflow-hidden bg-black">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/15 via-transparent to-purple-950/10" />
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section header */}
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div>
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/50" />
                  <span className="text-purple-400/70 text-sm font-semibold uppercase tracking-[0.2em]">Our Philosophy</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold leading-[1.1]">
                  Not Just Skills.
                  <br />
                  <span className="gradient-text">Economic Assets.</span>
                </h2>
              </div>
              <div className="md:pb-2">
                <p className="text-white/45 text-lg leading-relaxed max-w-md">
                  We focus on high-value creative skills, monetization intelligence, and modern tools — because creative talent without business thinking is wasted potential.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {[
              {
                number: '01',
                title: 'Serious Learners Only',
                accent: 'from-emerald-400 to-emerald-600',
                accentBg: 'bg-emerald-500/10 border-emerald-500/15',
                dotColor: 'bg-emerald-400/70',
                points: [
                  'Beginners accepted with readiness',
                  'Intermediate creators stuck on monetization',
                  'Career-switchers seeking future-proof skills',
                  'No guarantees without effort'
                ]
              },
              {
                number: '02',
                title: 'Systems & Execution',
                accent: 'from-purple-400 to-pink-400',
                accentBg: 'bg-purple-500/10 border-purple-500/15',
                dotColor: 'bg-purple-400/70',
                points: [
                  'Pricing strategies that work',
                  'Client acquisition systems',
                  'Repeatable execution frameworks',
                  'AI + creativity integration'
                ]
              },
              {
                number: '03',
                title: 'Fit Over Volume',
                accent: 'from-accent-gold to-amber-600',
                accentBg: 'bg-accent-gold/10 border-accent-gold/15',
                dotColor: 'bg-accent-gold/70',
                points: [
                  'Not for casual learners',
                  'No cheap classes mentality',
                  'Discipline and practice required',
                  'Selective admission standards'
                ]
              }
            ].map((item, index) => (
              <AnimatedSection
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                {/* Card border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-transparent p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
                </div>

                <div className="relative z-10 p-8 lg:p-10 flex flex-col h-full">
                  {/* Top row: number + accent bar */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className={`text-5xl font-display font-black bg-gradient-to-b ${item.accent} bg-clip-text text-transparent opacity-30`}>
                      {item.number}
                    </span>
                    <div className={`h-px flex-1 bg-gradient-to-r ${item.accent} opacity-15`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl lg:text-[1.65rem] font-display font-bold mb-6 group-hover:text-white transition-colors leading-tight">
                    {item.title}
                  </h3>

                  {/* Points */}
                  <ul className="space-y-4 flex-1">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className={`mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.dotColor}`} />
                        <span className="text-sm text-white/50 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bottom accent line */}
                  <div className={`mt-8 h-0.5 w-12 rounded-full bg-gradient-to-r ${item.accent} opacity-30 group-hover:w-full group-hover:opacity-50 transition-all duration-700`} />
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl shadow-[inset_0_0_80px_-20px_rgba(168,85,247,0.06)]" />
              </AnimatedSection>
            ))}
          </div>

          {/* Visual Grid */}
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <VisualGrid
              images={[
                { src: '/IMG_8398.jpg', caption: 'Focused mentorship' },
                { src: '/IMG_3710.jpg', caption: 'Hands-on practice' },
                { src: '/IMG_5014.jpg', caption: 'Creative collaboration' },
                { src: '/3U4A1815.jpg', caption: 'Business strategy' },
                { src: '/3U4A1894.jpg', caption: 'AI & tooling' },
                { src: '/3U4A1905.jpg', caption: 'Selective cohorts' },
              ]}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Section blend */}
      <div className="relative h-32 -mt-16 -mb-16 z-10 pointer-events-none bg-gradient-to-b from-black via-[#060606] to-transparent" />

      {/* Two-Layer Model */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-accent-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
              <span className="text-white/40 text-sm font-semibold uppercase tracking-[0.2em]">Two-Layer Model</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-5">
              Two Paths. One Standard.
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Choose your journey, but know that excellence is non-negotiable.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
            {/* Layer 1 — Skill Programs */}
            <AnimatedSection
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              {/* Border gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent p-[1px]">
                <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
              </div>

              <div className="relative z-10 p-10 lg:p-12 flex flex-col h-full">
                {/* Layer badge */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-lg font-bold text-white/70">1</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">Layer One</span>
                    <span className="block text-[11px] text-white/25">Entry Point</span>
                  </div>
                </div>

                <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 group-hover:text-white transition-colors">
                  Skill Programs
                </h3>
                <p className="text-white/55 text-base leading-relaxed mb-8">
                  Intensive, practical training. Learn fast. Execute well. Build a foundation that matters.
                </p>

                {/* Feature list */}
                <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                  {[
                    { icon: '⚡', label: 'Short, focused programs' },
                    { icon: '📜', label: 'Skill certification only' },
                    { icon: '🚪', label: 'Entry-level access' },
                    { icon: '👤', label: 'Students, not alumni' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <span className="text-sm text-white/50 leading-snug">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <p className="text-white/30 text-sm">Build your skills first</p>
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all duration-300 group/btn"
                  >
                    Explore
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl shadow-[inset_0_0_80px_-20px_rgba(168,85,247,0.08)]" />
            </AnimatedSection>

            {/* Layer 2 — Alumni Track */}
            <AnimatedSection
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              {/* Gold border gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-accent-gold/40 via-accent-gold/10 to-transparent p-[1px]">
                <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
              </div>

              <div className="relative z-10 p-10 lg:p-12 flex flex-col h-full">
                {/* Layer badge */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20">
                    <span className="text-lg font-bold text-accent-gold">2</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent-gold/70">Layer Two</span>
                    <span className="block text-[11px] text-accent-gold/40">Earned Access</span>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent-gold text-black">
                      Elite
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 group-hover:text-white transition-colors">
                  Alumni Track
                </h3>
                <p className="text-white/55 text-base leading-relaxed mb-8">
                  5-month advanced journey. Monetization. Business thinking. AI integration. This is where transformation happens.
                </p>

                {/* Feature list */}
                <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                  {[
                    { icon: '🏆', label: 'Alumni status is earned' },
                    { icon: '🔑', label: 'Deep mentor access' },
                    { icon: '🤝', label: 'Referrals & opportunities' },
                    { icon: '📈', label: 'Long-term value creation' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5 p-3 rounded-xl bg-accent-gold/[0.03] border border-accent-gold/10">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <span className="text-sm text-white/50 leading-snug">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent mb-6" />

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <p className="text-accent-gold/40 text-sm">Not sold. Earned.</p>
                  <Link
                    href="/alumni"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent-gold text-black hover:bg-accent-gold/90 shadow-lg shadow-accent-gold/20 transition-all duration-300 group/btn"
                  >
                    Learn More
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">→</span>
                  </Link>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl shadow-[inset_0_0_80px_-20px_rgba(212,175,55,0.1)]" />
            </AnimatedSection>
          </div>

          {/* Connector note */}
          <AnimatedSection
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-14 flex flex-col items-center"
          >
            <div className="h-10 w-px bg-gradient-to-b from-white/15 to-transparent mb-4" />
            <p className="text-white/25 text-sm text-center max-w-md">
              Layer 1 is for everyone willing to work. Layer 2 is for those who prove they belong.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section blend */}
      <div className="relative h-24 -mt-12 -mb-12 z-10 pointer-events-none bg-gradient-to-b from-transparent via-[#060606] to-transparent" />

      {/* Physical Academy */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-emerald-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Header — left-aligned with location tag */}
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div>
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400/70 text-sm font-semibold uppercase tracking-[0.2em]">Lagos, Nigeria</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold leading-[1.1]">
                  Physical Academy.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">Real Education.</span>
                </h2>
              </div>
              <div className="md:pb-2">
                <p className="text-white/45 text-lg leading-relaxed max-w-md">
                  We are a physical school first. In-person mentorship, real equipment, real accountability. Not a Zoom call with slides.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Bento-style grid */}
          <div className="grid md:grid-cols-12 gap-4 lg:gap-5">
            {/* Large feature — Physical Campus */}
            <AnimatedSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 group relative rounded-3xl overflow-hidden min-h-[380px]"
            >
              <img
                src="/3U4A1815.jpg"
                alt="CreatINN Academy campus"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="relative z-10 flex flex-col justify-end h-full p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300/80">Primary Format</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-display font-bold mb-3">Physical Campus</h3>
                <p className="text-white/55 text-sm leading-relaxed max-w-md">
                  Our primary focus is in-person education with direct mentor access, professional equipment, and hands-on training in a real studio environment.
                </p>
              </div>
            </AnimatedSection>

            {/* Right column — stacked cards */}
            <div className="md:col-span-5 flex flex-col gap-4 lg:gap-5">
              {/* Small Cohorts */}
              <AnimatedSection
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative rounded-3xl overflow-hidden flex-1"
              >
                {/* Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-transparent p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
                </div>

                <div className="relative z-10 p-7 lg:p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-gold/10 border border-accent-gold/15">
                      <span className="text-2xl">👥</span>
                    </div>
                    <span className="text-accent-gold font-display font-black text-4xl opacity-20">3</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-white transition-colors">Small Cohorts</h3>
                  <p className="text-white/45 text-sm leading-relaxed flex-1">
                    Limited to 3 students per cohort. Personalized attention. Real mentorship. No overcrowded classrooms.
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-[11px] font-medium text-accent-gold/60 bg-accent-gold/5 border border-accent-gold/10 rounded-full px-3 py-1">Max 3 per cohort</span>
                    <span className="text-[11px] font-medium text-white/30 bg-white/5 border border-white/10 rounded-full px-3 py-1">Selective</span>
                  </div>
                </div>
              </AnimatedSection>

              {/* Online Alternative */}
              <AnimatedSection
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative rounded-3xl overflow-hidden flex-1"
              >
                {/* Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-400/15 via-blue-400/5 to-transparent p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
                </div>

                <div className="relative z-10 p-7 lg:p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/15">
                      <span className="text-2xl">🌐</span>
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300/50 bg-blue-500/10 border border-blue-500/15 rounded-full px-3 py-1">Digital</span>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-white transition-colors">Online Alternative</h3>
                  <p className="text-white/45 text-sm leading-relaxed flex-1">
                    For those who cannot attend physically, we offer select self-paced programs with digital access. No mentorship, no alumni status.
                  </p>
                  <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-blue-400/15 to-transparent" />
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Stats row */}
          <AnimatedSection
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'Lagos', label: 'Location', sub: 'Nigeria' },
                { value: '3', label: 'Students', sub: 'Per cohort' },
                { value: '100%', label: 'Hands-on', sub: 'Practical focus' },
                { value: '1:1', label: 'Mentor', sub: 'Direct access' },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-5 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-xl lg:text-2xl font-display font-bold text-white/80 mb-0.5">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-white/30">{stat.label}</p>
                  <p className="text-[11px] text-white/20">{stat.sub}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section blend */}
      <div className="relative h-24 -mt-12 -mb-12 z-10 pointer-events-none bg-gradient-to-b from-transparent via-[#060606] to-transparent" />

      {/* Programs Preview (driven from DB) */}
      <section id="programs" className="py-28 px-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-purple-950/10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-accent-gold" />
              <span className="text-accent-gold text-sm font-semibold uppercase tracking-[0.2em]">Limited Enrollment</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-accent-gold" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-5">
              Current Programs
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Three pathways. Each designed for a different stage of readiness. None designed for everyone.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {programs.map((program: any, index: number) => {
              // Parse details from description
              let details: string[] = [];
              try {
                const parsed = JSON.parse(String(program.description || ''));
                if (parsed && parsed.long) {
                  details = parsed.long.split('\n').map((s: string) => s.trim()).filter(Boolean).slice(0, 4);
                } else if (typeof program.description === 'string') {
                  details = program.description.split('\n').map((s: string) => s.trim()).filter(Boolean);
                }
              } catch {
                if (typeof program.description === 'string') {
                  details = program.description.split('\n').map((s: string) => s.trim()).filter(Boolean);
                }
              }
              details = details.slice(0, 4).map((d) => d.length > 60 ? d.slice(0, 57) + '…' : d);

              const isFlagship = index === 1;
              const isOnline = !!(program.title && program.title.includes('Online'));
              const programType = isOnline ? 'Online' : isFlagship ? 'Private' : 'Physical';
              const programTypeColor = isOnline
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : isFlagship
                  ? 'bg-accent-gold/20 text-accent-gold border-accent-gold/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

              return (
                <AnimatedSection
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                    isFlagship ? 'md:-mt-4 md:mb-4' : ''
                  }`}
                >
                  {/* Card border glow */}
                  <div className={`absolute inset-0 rounded-3xl ${
                    isFlagship
                      ? 'bg-gradient-to-b from-accent-gold/30 via-accent-gold/10 to-transparent p-[1px]'
                      : 'bg-gradient-to-b from-white/20 via-white/5 to-transparent p-[1px]'
                  }`}>
                    <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
                  </div>

                  {/* Card content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Image section */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={program.thumbnail || '/3U4A1815.jpg'}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-transparent" />

                      {/* Flagship ribbon */}
                      {isFlagship && (
                        <div className="absolute top-4 right-4 bg-accent-gold text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                          Flagship
                        </div>
                      )}

                      {/* Program type badge */}
                      <div className={`absolute top-4 left-4 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-sm ${programTypeColor}`}>
                        {programType}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-7 pt-5 flex flex-col flex-1">
                      {/* Meta pills */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {program.duration && (
                          <span className="text-[11px] font-medium text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                            {program.duration}
                          </span>
                        )}
                        {program.level && (
                          <span className="text-[11px] font-medium text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                            {program.level}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl lg:text-2xl font-display font-bold mb-3 leading-tight group-hover:text-white transition-colors">
                        {program.title}
                      </h3>

                      {/* Details */}
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {details.map((detail: string) => (
                          <li key={detail} className="flex items-start gap-2.5 text-sm text-white/55">
                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                              isFlagship ? 'bg-accent-gold/70' : 'bg-purple-400/70'
                            }`} />
                            {detail}
                          </li>
                        ))}
                      </ul>

                      {/* Divider */}
                      <div className={`h-px w-full mb-6 ${
                        isFlagship
                          ? 'bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent'
                          : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
                      }`} />

                      {/* Price + CTA */}
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-white/35 mb-1">Investment</p>
                          <p className={`text-2xl lg:text-3xl font-bold ${
                            isFlagship ? 'text-accent-gold' : 'gradient-text'
                          }`}>
                            ₦{Number(program.price).toLocaleString()}
                          </p>
                        </div>
                        <Link
                          href={`/apply?program=${encodeURIComponent(program.title)}`}
                          className={`flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            isFlagship
                              ? 'bg-accent-gold text-black hover:bg-accent-gold/90 shadow-lg shadow-accent-gold/20'
                              : 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10'
                          }`}
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl ${
                    isFlagship
                      ? 'shadow-[inset_0_0_80px_-20px_rgba(212,175,55,0.1)]'
                      : 'shadow-[inset_0_0_80px_-20px_rgba(168,85,247,0.08)]'
                  }`} />
                </AnimatedSection>
              );
            })}
          </div>

          {/* Bottom note */}
          <AnimatedSection
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-white/30 text-sm">
              All programs require commitment. No refunds. No shortcuts.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 mt-4 text-white/50 hover:text-white text-sm font-medium transition-colors duration-300 group/link"
            >
              View all programs
              <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Section blend */}
      <div className="relative h-24 -mt-12 -mb-12 z-10 pointer-events-none bg-gradient-to-b from-transparent via-[#060606] to-transparent" />

      {/* The Thinkinn */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Content */}
            <AnimatedSection
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/50" />
                <span className="text-purple-400/70 text-sm font-semibold uppercase tracking-[0.2em]">Thought Leadership</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-[1.1]">
                The{' '}
                <span className="gradient-text">Thinkinn</span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-8 max-w-lg">
                Weekly intellectual content on monetization, AI, creative thinking, and decision-making.
                Not tutorials. Not motivation. Real frameworks for how money and creativity intersect.
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-10">
                {['Monetization', 'AI & Future', 'Creative Strategy', 'Decision Making', 'Business Systems'].map((topic) => (
                  <span key={topic} className="text-[11px] font-medium text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-1.5">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href="/thinkinn"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-accent-gold transition-all duration-300 shadow-lg shadow-white/10"
                >
                  Explore Thinkinn
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <span className="text-white/25 text-sm">Free to watch</span>
              </div>
            </AnimatedSection>

            {/* Right — Visual card stack */}
            <AnimatedSection
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="relative">
                {/* Main card */}
                <div className="relative rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-purple-400/20 via-purple-400/5 to-transparent p-[1px]">
                    <div className="w-full h-full rounded-3xl bg-[#0c0c0c]" />
                  </div>
                  <div className="relative z-10 p-8 lg:p-10">
                    {/* Mockup video thumbnail */}
                    <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-gradient-to-br from-purple-950/50 to-black">
                      <img src="/3U4A1894.jpg" alt="The Thinkinn" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="px-4 py-2 rounded-full bg-white/6 backdrop-blur-sm border border-white/10 text-white font-semibold text-sm">
                          Coming soon
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">Latest Episode</span>
                        <span className="text-[10px] text-white/40 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">24:16</span>
                      </div>
                    </div>

                    {/* Episode info */}
                    <h4 className="text-lg font-display font-bold mb-2 text-white/90">Why Most Creatives Stay Broke</h4>
                    <p className="text-sm text-white/40 leading-relaxed">The gap between talent and income isn&apos;t skill — it&apos;s systems, positioning, and the courage to charge what you&apos;re worth.</p>
                  </div>
                </div>

                {/* Stacked cards behind (decorative) */}
                <div className="absolute -bottom-3 left-3 right-3 h-full rounded-3xl bg-white/[0.02] border border-white/[0.04] -z-10" />
                <div className="absolute -bottom-6 left-6 right-6 h-full rounded-3xl bg-white/[0.01] border border-white/[0.03] -z-20" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section blend */}
      <div className="relative h-24 -mt-12 -mb-12 z-10 pointer-events-none bg-gradient-to-b from-transparent via-[#060606] to-transparent" />

      {/* Final CTA */}
      <section className="relative py-40 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/15 to-black" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-600/8 rounded-full blur-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-gold/5 rounded-full blur-3xl" />
        </div>

        {/* Decorative lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-white/[0.06] via-transparent to-transparent h-20" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <AnimatedSection
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-accent-gold/50" />
              <span className="text-accent-gold/60 text-sm font-semibold uppercase tracking-[0.2em]">Limited Access</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-accent-gold/50" />
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-[1.05]">
              Access Is Not
              <br />
              Automatic.{' '}
              <span className="bg-gradient-to-r from-accent-gold via-amber-300 to-accent-gold bg-clip-text text-transparent">It&apos;s Earned.</span>
            </h2>

            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed">
              Submit your application. Limited cohorts. Selective admission.
              <br className="hidden md:block" />
              This is not a sign-up page — it&apos;s a filter.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/apply"
                className="group relative px-10 py-5 bg-white text-black font-bold text-base rounded-xl hover:bg-accent-gold transition-all duration-300 shadow-2xl shadow-white/10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Apply to CreatINN Academy
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/contact"
                className="px-8 py-5 text-sm font-semibold text-white/50 hover:text-white rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] transition-all duration-300"
              >
                Have Questions?
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {[
                { icon: '🔒', text: 'Selective Admission' },
                { icon: '🎯', text: 'Outcome-Driven' },
                { icon: '⚡', text: 'No Refunds' },
                { icon: '🏛️', text: 'Institution, Not Platform' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[11px] uppercase tracking-wider text-white/25 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
