'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};

const programs = [
  {
    id: 'intensive',
    title: '2-Week Video Editing Intensive',
    layer: 'Layer 1: Skill Program',
    price: '₦100,000',
    duration: '2 Weeks',
    cohortSize: '3 Students',
    format: 'Physical Campus (Lagos)',
    description:
      'In-person intensive training at our Lagos campus. Limited to 3 students per cohort for maximum mentor access.',
    highlights: [
      'Limited to 3 students per cohort',
      'Physical location with direct mentor access',
      'Industry-standard software and workflows',
      'Real-world project completion',
      'Skill certification upon completion',
      'Not alumni status',
    ],
    features: [
      'Daily hands-on sessions',
      'Mentor feedback and critique',
      'Portfolio piece creation',
      'Technical mastery focus',
    ],
  },
  {
    id: 'mastery',
    title: '1-on-1 Mastery Track',
    layer: 'Layer 1: Skill Program',
    price: '₦600,000',
    duration: 'Flexible',
    cohortSize: 'Private',
    format: 'High-Touch Mentorship',
    featured: true,
    description:
      'Private, flexible mentorship for busy professionals who demand excellence.',
    highlights: [
      'Complete privacy and personalized attention',
      'Flexible scheduling around your commitments',
      'Custom curriculum based on your goals',
      'Direct access to senior mentors',
      'Accelerated learning path',
      'Premium positioning',
    ],
    features: [
      'One-on-one sessions',
      'Custom project selection',
      'Industry connections',
      'Career guidance included',
    ],
  },
  {
    id: 'online',
    title: 'Online Video Editing Course',
    layer: 'Layer 1: Skill Program',
    price: '₦30,000',
    duration: 'Self-Paced',
    cohortSize: 'Remote',
    format: 'Digital Access',
    description:
      'For those who cannot attend our physical campus. Self-paced digital learning with course materials.',
    highlights: [
      'Learn at your own pace',
      'Digital course materials',
      'Video tutorials and resources',
      'No mentorship included',
      'No alumni status',
      'Skill training only',
    ],
    features: [
      'Lifetime course access',
      'Downloadable resources',
      'Community forum access',
      'Basic certificate',
    ],
  },
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <main className="pt-32 pb-24">
        {/* ── Hero ── */}
        <section className="relative px-6 mb-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <p className="text-[#d4af37] uppercase tracking-[0.35em] text-xs mb-5 font-medium">
                Layer 1: Skill Programs
              </p>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-[1.08]">
                Physical Academy Programs
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                In-person training in Lagos. Limited cohorts. Real mentorship.
              </p>
              <span className="text-white/30 text-sm mt-3 block tracking-wide">
                Online option available for remote learners.
              </span>
            </motion.div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4af37]/[0.04] blur-[120px] pointer-events-none" />
        </section>

        {/* ── Programs ── */}
        <section className="px-6 mb-28">
          <div className="max-w-6xl mx-auto space-y-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div
                  className={`rounded-3xl p-[1px] ${
                    program.featured
                      ? 'bg-gradient-to-br from-[#d4af37]/40 via-[#d4af37]/10 to-transparent'
                      : 'bg-gradient-to-b from-white/[0.08] to-transparent'
                  }`}
                >
                  <div className="rounded-3xl bg-[#0c0c0c] p-8 md:p-12">
                    {program.featured && (
                      <div className="text-[#d4af37] text-xs uppercase tracking-[0.2em] mb-5 font-medium">
                        ★ Most Popular
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-10">
                      {/* Left: Info */}
                      <div className="md:col-span-2">
                        <div className="text-xs text-white/30 uppercase tracking-wider mb-2">
                          {program.layer}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                          {program.title}
                        </h2>
                        <p className="text-white/55 mb-8 text-[15px] leading-relaxed">
                          {program.description}
                        </p>

                        {/* Meta grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
                          {[
                            { label: 'Duration', value: program.duration },
                            { label: 'Cohort Size', value: program.cohortSize },
                            { label: 'Format', value: program.format },
                          ].map((meta) => (
                            <div key={meta.label}>
                              <div className="text-white/25 text-xs uppercase tracking-wider mb-1">
                                {meta.label}
                              </div>
                              <div className="text-sm font-semibold text-white/80">
                                {meta.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Highlights */}
                        <div className="mb-6">
                          <h3 className="text-sm font-display font-semibold mb-3 text-white/70 uppercase tracking-wider">
                            Program Highlights
                          </h3>
                          <ul className="space-y-2">
                            {program.highlights.map((h) => (
                              <li
                                key={h}
                                className="flex items-start text-white/50 text-[14px]"
                              >
                                <span className="text-[#d4af37] mr-2.5 mt-0.5">→</span>
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Features chips */}
                        <div>
                          <h3 className="text-sm font-display font-semibold mb-3 text-white/70 uppercase tracking-wider">
                            What You Get
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {program.features.map((f) => (
                              <span
                                key={f}
                                className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-white/55"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & CTA */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="text-white/25 text-xs uppercase tracking-wider mb-2">
                            Investment
                          </div>
                          <div className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-6">
                            {program.price}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Link
                            href="/apply"
                            className="block px-8 py-4 bg-white text-black text-sm font-semibold rounded-xl text-center hover:bg-[#d4af37] transition-all duration-300"
                          >
                            Apply Now
                          </Link>
                          <p className="text-[11px] text-white/25 text-center tracking-wide">
                            Applications are reviewed individually
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-28" />

        {/* ── Alumni Track CTA ── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#d4af37]/30 via-white/[0.04] to-[#d4af37]/10">
                <div className="rounded-3xl bg-[#0c0c0c] p-12 md:p-16 text-center">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Ready for the Alumni Track?
                  </h2>
                  <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
                    Layer 2 is where skills become business. Where creatives become entrepreneurs.
                  </p>
                  <Link
                    href="/alumni"
                    className="inline-block px-9 py-4 rounded-xl border border-white/[0.1] text-sm font-semibold hover:bg-white/[0.06] transition-all duration-300"
                  >
                    Learn About Alumni Track
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
