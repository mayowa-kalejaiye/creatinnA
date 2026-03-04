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

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <main className="pt-32 pb-24">
        {/* ── Hero ── */}
        <section className="relative px-6 mb-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <p className="text-[#d4af37] uppercase tracking-[0.35em] text-xs mb-5 font-medium">
                About the Academy
              </p>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[1.08]">
                About CreatINN Academy
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                A physical creative academy that moves people from learning → earning → positioning.
              </p>
              <span className="text-white/30 text-sm mt-4 block tracking-wide">
                Lagos, Nigeria
              </span>
            </motion.div>
          </div>
          {/* subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4af37]/[0.04] blur-[120px] pointer-events-none" />
        </section>

        {/* ── Core Belief ── */}
        <section className="px-6 mb-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* gradient-border wrapper */}
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#d4af37]/40 via-white/[0.06] to-[#d4af37]/20">
                <div className="rounded-3xl bg-[#0c0c0c] p-10 md:p-14 text-center">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
                    What We Do
                  </h2>
                  <p className="text-xl md:text-2xl font-display text-white/90 leading-relaxed mb-6">
                    We help people turn creative skills into real income and long-term leverage.
                  </p>
                  <p className="text-lg text-white/60 leading-relaxed max-w-3xl mx-auto">
                    We don&apos;t just teach how to create. We teach how creativity becomes an economic asset—through systems, pricing, clients, and repeatable execution.
                  </p>
                  <p className="text-base text-[#d4af37]/70 italic mt-8">
                    Because creative skill without business intelligence leads to poverty.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── What CreatINN Is ── */}
        <section className="px-6 mb-28">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                What CreatINN Is
              </h2>
              <p className="text-white/40 text-sm tracking-wide">
                At the intersection of creativity, business, and technology
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {[
                {
                  icon: '🎬',
                  title: 'Creative Skills',
                  description: 'Video editing, production, and technical mastery',
                },
                {
                  icon: '💼',
                  title: 'Business Thinking',
                  description: 'Monetization strategies and entrepreneurship',
                },
                {
                  icon: '⚡',
                  title: 'AI Integration',
                  description: 'Future-of-work skills and technology leverage',
                },
                {
                  icon: '🔒',
                  title: 'Selective Education',
                  description: 'Brand-protected, merit-based access',
                },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <div className="rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent h-full">
                    <div className="rounded-2xl bg-white/[0.03] p-8 h-full hover:bg-white/[0.06] transition-colors duration-300">
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <h3 className="text-lg font-display font-bold mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Physical Academy First ── */}
        <section className="px-6 mb-28">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#d4af37]/30 via-white/[0.04] to-[#d4af37]/10">
                <div className="rounded-3xl bg-[#0c0c0c] p-10 md:p-14">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center text-white">
                    We Are a Physical School First
                  </h2>
                  <div className="max-w-3xl mx-auto space-y-5 text-white/60 leading-relaxed text-[15px]">
                    <p>
                      <strong className="text-white/90">CreatINN Academy is a physical institution</strong> located in Lagos, Nigeria. Our primary focus is in-person education with direct mentor access, hands-on training, and real-time feedback.
                    </p>
                    <p>
                      We are not Udemy or Coursera. We are not a course library platform. We are an academy that sells education, capacity-building, and transformation.
                    </p>
                    <p>
                      <strong className="text-white/90">Online programs exist as an alternative</strong> for those who cannot attend our physical campus. They provide access to training, but the core CreatINN experience is in-person, selective, and cohort-based.
                    </p>
                    <p className="text-white/35 italic pt-2">
                      Future plans include expanding course offerings and digital learning resources, but our foundation remains: a physical academy with selective admission and real mentorship.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Principles ── */}
        <section className="px-6 mb-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Our Principles
              </h2>
            </motion.div>

            <div className="space-y-5">
              {[
                {
                  title: 'Selectivity Over Scale',
                  body: 'We limit cohorts, require paid applications, and maintain high standards. Not everyone is admitted. Not everyone graduates. We protect the brand and the value of access.',
                },
                {
                  title: 'Outcomes Over Testimonials',
                  body: 'We measure skill growth, discipline, completion rates, and readiness. Real outcomes matter more than marketing copy or emotional testimonials.',
                },
                {
                  title: 'Long-Term Value Over Quick Wins',
                  body: "We don't promise fast money or shortcuts. We build capacity for sustained success, strategic thinking, and compounding value over time.",
                },
                {
                  title: 'Access Is Earned, Not Bought',
                  body: 'Tuition buys training. Alumni status, mentor proximity, referrals, and brand endorsement are earned through excellence and discipline.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  <div className="rounded-2xl p-[1px] bg-gradient-to-r from-[#d4af37]/25 to-transparent">
                    <div className="rounded-2xl bg-white/[0.03] p-8 md:p-10">
                      <h3 className="text-lg font-display font-semibold mb-3 text-[#d4af37]">
                        {item.title}
                      </h3>
                      <p className="text-white/55 leading-relaxed text-[15px]">{item.body}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Two-Layer Model ── */}
        <section className="px-6 mb-28">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Two Layers. One Standard.
              </h2>
              <p className="text-white/40 text-sm">
                Clear separation between skill training and alumni value
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Layer 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent h-full">
                  <div className="rounded-2xl bg-white/[0.03] p-10 h-full flex flex-col">
                    <div className="text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
                      Layer 1
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4">Skill Programs</h3>
                    <p className="text-white/55 mb-8 flex-1 text-[15px] leading-relaxed">
                      Short, intensive training focused on practical skills. Students receive certification upon completion, but not alumni status.
                    </p>
                    <Link
                      href="/programs"
                      className="inline-block px-7 py-3.5 rounded-xl border border-white/[0.1] text-sm font-semibold hover:bg-white/[0.06] transition-all duration-300 text-center"
                    >
                      View Programs
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Layer 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[#d4af37]/40 via-[#d4af37]/10 to-transparent h-full">
                  <div className="rounded-2xl bg-[#0c0c0c] p-10 h-full flex flex-col">
                    <div className="text-xs uppercase tracking-[0.25em] text-[#d4af37] mb-3">
                      Layer 2
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4">Alumni Track</h3>
                    <p className="text-white/55 mb-8 flex-1 text-[15px] leading-relaxed">
                      5-month advanced journey focused on monetization, business thinking, and AI. Alumni status is earned through demonstrated growth and readiness.
                    </p>
                    <Link
                      href="/alumni"
                      className="inline-block px-7 py-3.5 rounded-xl bg-[#d4af37] text-black text-sm font-semibold hover:bg-[#e5c349] transition-all duration-300 text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-28" />

        {/* ── CTA ── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-transparent">
                <div className="rounded-3xl bg-[#0c0c0c] p-12 md:p-16 text-center">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                    Ready to Apply?
                  </h2>
                  <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
                    Submit your application. Demonstrate your commitment. Earn your access.
                  </p>
                  <Link
                    href="/apply"
                    className="inline-block px-10 py-4 bg-white text-black font-bold text-sm tracking-wide rounded-xl hover:bg-[#d4af37] transition-all duration-300"
                  >
                    Apply to CreatINN Academy
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
