'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AlumniPage() {
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
              <p className="text-accent-gold uppercase tracking-[0.3em] text-sm mb-6">
                Layer 2: The Value Layer
              </p>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                Alumni Status
                <br />
                <span className="gradient-text">Is Earned, Not Sold</span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                A 5-month advanced journey focused on monetization, entrepreneurship, AI integration, and long-term value creation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What Alumni Track Is */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                This Is Not Another Course
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-display font-semibold mb-4 text-accent-gold">
                    What It Is
                  </h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">✓</span>
                      Deep access to mentors and industry leaders
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">✓</span>
                      Business thinking and monetization strategies
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">✓</span>
                      AI integration and future-of-work skills
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">✓</span>
                      Referrals, opportunities, and network access
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent-gold mr-2">✓</span>
                      Long-term value creation and brand endorsement
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold mb-4 text-white/50">
                    What It's Not
                  </h3>
                  <ul className="space-y-3 text-white/50">
                    <li className="flex items-start">
                      <span className="mr-2">✗</span>
                      A guaranteed income program
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✗</span>
                      A certificate factory
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✗</span>
                      Open admission
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✗</span>
                      A shortcut to success
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✗</span>
                      For everyone
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Journey */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold mb-4">
                The 5-Month Journey
              </h2>
              <p className="text-white/60">
                From creative skill to business thinking
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  phase: 'Months 1-2',
                  title: 'Foundation & Monetization',
                  focus: 'Building your business foundation and first revenue streams'
                },
                {
                  phase: 'Months 3-4',
                  title: 'AI Integration & Scaling',
                  focus: 'Leveraging AI tools and scaling your creative business'
                },
                {
                  phase: 'Month 5',
                  title: 'Long-Term Value & Alumni Status',
                  focus: 'Strategic thinking, positioning, and earning alumni endorsement'
                }
              ].map((stage, index) => (
                <motion.div
                  key={stage.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-8 border-l-4 border-accent-gold"
                >
                  <div className="text-sm text-accent-gold mb-2">{stage.phase}</div>
                  <h3 className="text-2xl font-display font-bold mb-2">{stage.title}</h3>
                  <p className="text-white/70">{stage.focus}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 border-2 border-white/20"
            >
              <h2 className="text-3xl font-display font-bold mb-6">
                Who Should Apply
              </h2>
              <div className="space-y-4 text-white/70">
                <p>
                  <strong className="text-white">You have creative skills.</strong> You can edit, design, or produce.
                </p>
                <p>
                  <strong className="text-white">You're disciplined.</strong> You complete what you start.
                </p>
                <p>
                  <strong className="text-white">You think long-term.</strong> You want to build value, not just make quick money.
                </p>
                <p>
                  <strong className="text-white">You understand selectivity.</strong> You know that access is earned, not bought.
                </p>
                <p className="pt-4 text-white/50 italic">
                  Alumni status is not automatic. It is earned through completion, growth, and readiness.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Investment */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center premium-shadow border-2 border-accent-gold">
            <h2 className="text-3xl font-display font-bold mb-4">
              Investment & Application
            </h2>
            <p className="text-white/70 mb-8">
              Applications are currently invite-only. Layer 2 is selective by design.
            </p>
            <div className="text-5xl font-bold gradient-text mb-8">
              By Invitation Only
            </div>
            <p className="text-white/60 mb-8">
              Complete Layer 1 programs with excellence. Demonstrate discipline and growth.
              <br />
              Invitations are earned through merit and readiness.
            </p>
            <Link 
              href="/programs"
              className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all duration-300"
            >
              Start with Layer 1 Programs
            </Link>
          </div>
        </section>

        {/* What Alumni Get */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold mb-4">
                What Alumni Receive
              </h2>
              <p className="text-white/60">
                Access, opportunities, and brand endorsement
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Deep Access',
                  items: ['Mentor proximity', 'Industry connections', 'Ongoing guidance', 'Network opportunities']
                },
                {
                  title: 'Opportunities',
                  items: ['Client referrals', 'Partnership invites', 'Project collaborations', 'Speaking engagements']
                },
                {
                  title: 'Brand Endorsement',
                  items: ['Alumni certification', 'Portfolio credibility', 'CreatINN backing', 'Long-term support']
                }
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-8"
                >
                  <h3 className="text-xl font-display font-bold mb-4 gradient-text">
                    {benefit.title}
                  </h3>
                  <ul className="space-y-2">
                    {benefit.items.map((item) => (
                      <li key={item} className="text-white/70">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
