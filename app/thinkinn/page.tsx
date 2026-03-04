'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscribeForm from '@/components/SubscribeForm';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function ThinkinnPage() {
  return (
    <div className="min-h-screen bg-[#060606]">
      <Header />

      <main className="pt-32 pb-24">
        {/* ── Hero ── */}
        <section className="relative px-6 mb-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <p className="text-[#d4af37] uppercase tracking-[0.35em] text-xs mb-5 font-medium">
                Thought Leadership
              </p>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-[1.08]">
                The Thinkinn
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                Weekly intellectual content on monetization, AI, creative thinking, and decision-making.
              </p>
              <span className="text-white/30 text-sm mt-4 block tracking-wide">
                Not tutorials. Thought leadership.
              </span>
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
              className="grid md:grid-cols-2 gap-6"
            >
              {/* What It Is */}
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#d4af37]/40 via-white/[0.06] to-[#d4af37]/10">
                <div className="rounded-3xl bg-[#0c0c0c] p-10 h-full">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-[#d4af37]">
                    What It Is
                  </h2>
                  <p className="text-white/60 mb-6 text-[15px] leading-relaxed">
                    The Thinkinn is CreatINN Academy&apos;s weekly intellectual content series focused on the intersection of creativity, business, and technology.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Deep dives into monetization strategies',
                      'AI integration for creatives',
                      'Business thinking and decision-making',
                      'Long-term value creation',
                    ].map((item) => (
                      <li key={item} className="flex items-start text-white/55 text-[15px]">
                        <span className="text-[#d4af37] mr-3 mt-0.5">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What It's Not */}
              <div className="rounded-3xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent">
                <div className="rounded-3xl bg-white/[0.03] p-10 h-full">
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-white/80">
                    What It&apos;s Not
                  </h2>
                  <p className="text-white/45 mb-6 text-[15px] leading-relaxed">
                    We don&apos;t do quick tips, viral hacks, or tutorial content. This is strategic thinking for serious creatives.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Not software tutorials',
                      'Not get-rich-quick schemes',
                      'Not entertainment content',
                      'Not sales funnels',
                    ].map((item) => (
                      <li key={item} className="flex items-start text-white/35 text-[15px]">
                        <span className="mr-3 mt-0.5">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Core Topics ── */}
        <section className="px-6 mb-28">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Core Topics
              </h2>
              <p className="text-white/40 text-sm tracking-wide">
                What we think about and discuss
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
                  title: 'Monetization',
                  description: 'Building sustainable income as a creative',
                  icon: '💰',
                },
                {
                  title: 'AI Integration',
                  description: 'Using AI to amplify your creative output',
                  icon: '⚡',
                },
                {
                  title: 'Business Thinking',
                  description: 'Strategic decisions and long-term planning',
                  icon: '🧠',
                },
                {
                  title: 'Value Creation',
                  description: 'Building assets that compound over time',
                  icon: '📈',
                },
              ].map((topic) => (
                <motion.div key={topic.title} variants={fadeUp}>
                  <div className="rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent h-full">
                    <div className="rounded-2xl bg-white/[0.03] p-8 h-full hover:bg-white/[0.06] transition-colors duration-300">
                      <div className="text-3xl mb-4">{topic.icon}</div>
                      <h3 className="text-lg font-display font-bold mb-2 text-white">
                        {topic.title}
                      </h3>
                      <p className="text-white/45 text-sm leading-relaxed">{topic.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Subscribe / Coming Soon ── */}
        <section className="px-6 mb-28">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Recent Episodes
              </h2>
              <p className="text-white/40 text-sm">
                Coming soon to YouTube and podcast platforms
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-transparent">
                <div className="rounded-3xl bg-[#0c0c0c] p-12 md:p-16 text-center">
                  <p className="text-xl md:text-2xl font-display text-white/60 mb-8">
                    Subscribe to be notified when The Thinkinn launches
                  </p>
                  <SubscribeForm />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-28" />

        {/* ── Why It Exists ── */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#d4af37]/30 via-white/[0.04] to-[#d4af37]/10">
                <div className="rounded-3xl bg-[#0c0c0c] p-12 md:p-16 text-center">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                    Why The Thinkinn Exists
                  </h2>
                  <p className="text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto">
                    Because <strong className="text-white/90">creative skill without business intelligence leads to poverty.</strong>
                  </p>
                  <p className="text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto mt-6">
                    The Thinkinn is where we explore the thinking that separates struggling creatives from thriving entrepreneurs.
                  </p>
                  <p className="text-base text-[#d4af37]/60 mt-8 italic">
                    Authority-building. Filtering serious applicants. Thought leadership.
                  </p>
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
