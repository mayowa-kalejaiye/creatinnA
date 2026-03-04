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

export default function AlumniPage() {
  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <main className="pt-32 pb-24">
        {/* ── Hero ── */}
        <section className="relative px-6 mb-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <p className="text-[#d4af37] uppercase tracking-[0.35em] text-xs mb-5 font-medium">
                Layer 2: The Value Layer
              </p>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[1.08]">
                Alumni Status
                <br />
                <span className="text-[#d4af37]">Is Earned, Not Sold</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                A 5-month advanced journey focused on monetization, entrepreneurship, AI integration, and long-term value creation.
              </p>
            </motion.div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4af37]/[0.04] blur-[120px] pointer-events-none" />
        </section>

        {/* ── What It Is / What It's Not ── */}
        <section className="px-6 mb-28">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#d4af37]/30 via-white/[0.06] to-[#d4af37]/10">
                <div className="rounded-3xl bg-[#0c0c0c] p-10 md:p-14">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-10">
                    This Is Not Another Course
                  </h2>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-lg font-display font-semibold mb-5 text-[#d4af37]">
                        What It Is
                      </h3>
                      <ul className="space-y-3.5">
                        {[
                          'Deep access to mentors and industry leaders',
                          'Business thinking and monetization strategies',
                          'AI integration and future-of-work skills',
                          'Referrals, opportunities, and network access',
                          'Long-term value creation and brand endorsement',
                        ].map((item) => (
                          <li key={item} className="flex items-start text-white/55 text-[15px]">
                            <span className="text-[#d4af37] mr-3 mt-0.5">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold mb-5 text-white/40">
                        What It&apos;s Not
                      </h3>
                      <ul className="space-y-3.5">
                        {[
                          'A guaranteed income program',
                          'A certificate factory',
                          'Open admission',
                          'A shortcut to success',
                          'For everyone',
                        ].map((item) => (
                          <li key={item} className="flex items-start text-white/35 text-[15px]">
                            <span className="mr-3 mt-0.5">✗</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── The 5-Month Journey ── */}
        <section className="px-6 mb-28">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                The 5-Month Journey
              </h2>
              <p className="text-white/40 text-sm">
                From creative skill to business thinking
              </p>
            </motion.div>

            <div className="space-y-5">
              {[
                {
                  phase: 'Months 1-2',
                  title: 'Foundation & Monetization',
                  focus: 'Building your business foundation and first revenue streams',
                },
                {
                  phase: 'Months 3-4',
                  title: 'AI Integration & Scaling',
                  focus: 'Leveraging AI tools and scaling your creative business',
                },
                {
                  phase: 'Month 5',
                  title: 'Long-Term Value & Alumni Status',
                  focus: 'Strategic thinking, positioning, and earning alumni endorsement',
                },
              ].map((stage, index) => (
                <motion.div
                  key={stage.phase}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="rounded-2xl p-[1px] bg-gradient-to-r from-[#d4af37]/30 to-transparent">
                    <div className="rounded-2xl bg-white/[0.03] p-8 md:p-10">
                      <div className="text-xs text-[#d4af37] tracking-wider uppercase mb-2">
                        {stage.phase}
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
                        {stage.title}
                      </h3>
                      <p className="text-white/50 text-[15px]">{stage.focus}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who Should Apply ── */}
        <section className="px-6 mb-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-b from-white/[0.1] to-transparent">
                <div className="rounded-3xl bg-white/[0.03] p-10 md:p-14">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
                    Who Should Apply
                  </h2>
                  <div className="space-y-5 text-[15px] leading-relaxed">
                    <p className="text-white/55">
                      <strong className="text-white/90">You have creative skills.</strong> You can edit, design, or produce.
                    </p>
                    <p className="text-white/55">
                      <strong className="text-white/90">You&apos;re disciplined.</strong> You complete what you start.
                    </p>
                    <p className="text-white/55">
                      <strong className="text-white/90">You think long-term.</strong> You want to build value, not just make quick money.
                    </p>
                    <p className="text-white/55">
                      <strong className="text-white/90">You understand selectivity.</strong> You know that access is earned, not bought.
                    </p>
                    <p className="pt-3 text-white/30 italic">
                      Alumni status is not automatic. It is earned through completion, growth, and readiness.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Investment: Invite Only ── */}
        <section className="px-6 mb-28">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#d4af37]/40 via-[#d4af37]/10 to-transparent">
                <div className="rounded-3xl bg-[#0c0c0c] p-12 md:p-16 text-center">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Investment &amp; Application
                  </h2>
                  <p className="text-white/50 mb-8 text-[15px]">
                    Applications are currently invite-only. Layer 2 is selective by design.
                  </p>
                  <div className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-8">
                    By Invitation Only
                  </div>
                  <p className="text-white/40 mb-10 text-[15px] max-w-lg mx-auto leading-relaxed">
                    Complete Layer 1 programs with excellence. Demonstrate discipline and growth.
                    Invitations are earned through merit and readiness.
                  </p>
                  <Link
                    href="/programs"
                    className="inline-block px-9 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-[#d4af37] transition-all duration-300"
                  >
                    Start with Layer 1 Programs
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-28" />

        {/* ── What Alumni Receive ── */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                What Alumni Receive
              </h2>
              <p className="text-white/40 text-sm">
                Access, opportunities, and brand endorsement
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-5"
            >
              {[
                {
                  title: 'Deep Access',
                  items: ['Mentor proximity', 'Industry connections', 'Ongoing guidance', 'Network opportunities'],
                },
                {
                  title: 'Opportunities',
                  items: ['Client referrals', 'Partnership invites', 'Project collaborations', 'Speaking engagements'],
                },
                {
                  title: 'Brand Endorsement',
                  items: ['Alumni certification', 'Portfolio credibility', 'CreatINN backing', 'Long-term support'],
                },
              ].map((benefit) => (
                <motion.div key={benefit.title} variants={fadeUp}>
                  <div className="rounded-2xl p-[1px] bg-gradient-to-b from-[#d4af37]/25 to-transparent h-full">
                    <div className="rounded-2xl bg-white/[0.03] p-8 h-full">
                      <h3 className="text-lg font-display font-bold mb-5 text-[#d4af37]">
                        {benefit.title}
                      </h3>
                      <ul className="space-y-2.5">
                        {benefit.items.map((item) => (
                          <li key={item} className="text-white/50 text-[15px]">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
