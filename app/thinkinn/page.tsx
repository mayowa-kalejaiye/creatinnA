'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ThinkinnPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
                The Thinkinn
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
                Weekly intellectual content on monetization, AI, creative thinking, and decision-making.
                <br />
                <span className="text-white/50 text-lg mt-2 block">
                  Not tutorials. Thought leadership.
                </span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* What is Thinkinn */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12"
            >
              <div className="glass rounded-3xl p-10">
                <h2 className="text-3xl font-display font-bold mb-6 gradient-text">
                  What It Is
                </h2>
                <p className="text-white/70 mb-6">
                  The Thinkinn is CreatINN Academy&apos;s weekly intellectual content series focused on the intersection of creativity, business, and technology.
                </p>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start">
                    <span className="text-accent-gold mr-2">→</span>
                    Deep dives into monetization strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-gold mr-2">→</span>
                    AI integration for creatives
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-gold mr-2">→</span>
                    Business thinking and decision-making
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent-gold mr-2">→</span>
                    Long-term value creation
                  </li>
                </ul>
              </div>

              <div className="glass rounded-3xl p-10 border-2 border-white/20">
                <h2 className="text-3xl font-display font-bold mb-6">
                  What It&apos;s Not
                </h2>
                <p className="text-white/60 mb-6">
                  We don&apos;t do quick tips, viral hacks, or tutorial content. This is strategic thinking for serious creatives.
                </p>
                <ul className="space-y-3 text-white/50">
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    Not software tutorials
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    Not get-rich-quick schemes
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    Not entertainment content
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✗</span>
                    Not sales funnels
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Topics Covered */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold mb-4">
                Core Topics
              </h2>
              <p className="text-white/60">
                What we think about and discuss
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Monetization',
                  description: 'Building sustainable income as a creative',
                  icon: '💰'
                },
                {
                  title: 'AI Integration',
                  description: 'Using AI to amplify your creative output',
                  icon: '🤖'
                },
                {
                  title: 'Business Thinking',
                  description: 'Strategic decisions and long-term planning',
                  icon: '🧠'
                },
                {
                  title: 'Value Creation',
                  description: 'Building assets that compound over time',
                  icon: '📈'
                }
              ].map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-xl font-display font-bold mb-2">{topic.title}</h3>
                  <p className="text-white/60 text-sm">{topic.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Placeholder for Episodes */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold mb-4">
                Recent Episodes
              </h2>
              <p className="text-white/60">
                Coming soon to YouTube and podcast platforms
              </p>
            </motion.div>

            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-2xl font-display text-white/70 mb-6">
                Subscribe to be notified when The Thinkinn launches
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                />
                <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 text-center"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Why The Thinkinn Exists
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Because <strong className="text-white">creative skill without business intelligence leads to poverty.</strong>
                <br /><br />
                The Thinkinn is where we explore the thinking that separates struggling creatives from thriving entrepreneurs.
                <br /><br />
                It&apos;s authority-building. It&apos;s filtering serious applicants. It&apos;s thought leadership.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
