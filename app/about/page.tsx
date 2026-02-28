'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
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
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
                About CreatINN Academy
              </h1>
              <p className="text-2xl text-white/70 max-w-2xl mx-auto">
                A physical creative academy that moves people from learning → earning → positioning.
                <br />
                <span className="text-white/50 text-lg mt-2 block">Lagos, Nigeria</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Belief */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 text-center premium-shadow border-2 border-accent-gold"
            >
              <h2 className="text-4xl font-display font-bold mb-6 gradient-text">
                What We Do
              </h2>
              <p className="text-2xl font-display text-white leading-relaxed mb-6">
                We help people turn creative skills into real income and long-term leverage.
              </p>
              <p className="text-xl text-white/70 leading-relaxed">
                We don&apos;t just teach how to create. We teach how creativity becomes an economic asset—through systems, pricing, clients, and repeatable execution.
              </p>
              <p className="text-lg text-white/50 italic mt-6">
                Because creative skill without business intelligence leads to poverty.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Are */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold mb-4">
                What CreatINN Is
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Creative Skills',
                  description: 'Video editing, production, and technical mastery'
                },
                {
                  title: 'Business Thinking',
                  description: 'Monetization strategies and entrepreneurship'
                },
                {
                  title: 'AI Integration',
                  description: 'Future-of-work skills and technology leverage'
                },
                {
                  title: 'Selective Education',
                  description: 'Brand-protected, merit-based access'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-8"
                >
                  <h3 className="text-xl font-display font-bold mb-3 gradient-text">
                    {item.title}
                  </h3>
                  <p className="text-white/70">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Physical Academy First */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 border-2 border-accent-gold premium-shadow"
            >
              <h2 className="text-3xl font-display font-bold mb-6 text-center gradient-text">
                We Are a Physical School First
              </h2>
              <div className="max-w-3xl mx-auto space-y-6 text-white/70 leading-relaxed">
                <p>
                  <strong className="text-white">CreatINN Academy is a physical institution</strong> located in Lagos, Nigeria. Our primary focus is in-person education with direct mentor access, hands-on training, and real-time feedback.
                </p>
                <p>
                  We are not Udemy or Coursera. We are not a course library platform. We are an academy that sells education, capacity-building, and transformation.
                </p>
                <p>
                  <strong className="text-white">Online programs exist as an alternative</strong> for those who cannot attend our physical campus. They provide access to training, but the core CreatINN experience is in-person, selective, and cohort-based.
                </p>
                <p className="text-white/50 italic">
                  Future plans include expanding course offerings and digital learning resources, but our foundation remains: a physical academy with selective admission and real mentorship.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Principles */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12"
            >
              <h2 className="text-3xl font-display font-bold mb-8 text-center">
                Our Principles
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-accent-gold">
                    Selectivity Over Scale
                  </h3>
                  <p className="text-white/70">
                    We limit cohorts, require paid applications, and maintain high standards. Not everyone is admitted. Not everyone graduates. We protect the brand and the value of access.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-accent-gold">
                    Outcomes Over Testimonials
                  </h3>
                  <p className="text-white/70">
                    We measure skill growth, discipline, completion rates, and readiness. Real outcomes matter more than marketing copy or emotional testimonials.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-accent-gold">
                    Long-Term Value Over Quick Wins
                  </h3>
                  <p className="text-white/70">
                    We don&apos;t promise fast money or shortcuts. We build capacity for sustained success, strategic thinking, and compounding value over time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-accent-gold">
                    Access Is Earned, Not Bought
                  </h3>
                  <p className="text-white/70">
                    Tuition buys training. Alumni status, mentor proximity, referrals, and brand endorsement are earned through excellence and discipline.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Two-Layer Model */}
        <section className="px-6 mb-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display font-bold mb-4">
                Two Layers. One Standard.
              </h2>
              <p className="text-white/60">
                Clear separation between skill training and alumni value
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-10">
                <div className="text-sm uppercase tracking-wider text-white/50 mb-4">Layer 1</div>
                <h3 className="text-2xl font-display font-bold mb-4">Skill Programs</h3>
                <p className="text-white/70 mb-4">
                  Short, intensive training focused on practical skills. Students receive certification upon completion, but not alumni status.
                </p>
                <Link 
                  href="/programs"
                  className="inline-block px-6 py-3 glass rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  View Programs
                </Link>
              </div>

              <div className="glass rounded-2xl p-10 border-2 border-accent-gold">
                <div className="text-sm uppercase tracking-wider text-accent-gold mb-4">Layer 2</div>
                <h3 className="text-2xl font-display font-bold mb-4">Alumni Track</h3>
                <p className="text-white/70 mb-4">
                  5-month advanced journey focused on monetization, business thinking, and AI. Alumni status is earned through demonstrated growth and readiness.
                </p>
                <Link 
                  href="/alumni"
                  className="inline-block px-6 py-3 bg-accent-gold text-black rounded-lg font-semibold hover:bg-white transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              Ready to Apply?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Submit your application. Demonstrate your commitment. Earn your access.
            </p>
            <Link 
              href="/apply"
              className="inline-block px-10 py-5 bg-white text-black font-bold text-lg rounded-lg hover:bg-accent-gold transition-all duration-300 premium-shadow"
            >
              Apply to CreatINN Academy
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
