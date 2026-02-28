'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import VisualGrid from '@/components/ui/visual-grid';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Animation Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <ScrollMorphHero />
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Not Just Skills. Economic Assets.
            </h2>
            <p className="text-white/60 text-lg">
              We focus on high-value creative skills, monetization intelligence, and modern tools (AI).
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Serious Learners Only',
                points: [
                  'Beginners accepted with readiness',
                  'Intermediate creators stuck on monetization',
                  'Career-switchers seeking future-proof skills',
                  'No guarantees without effort'
                ]
              },
              {
                title: 'Systems & Execution',
                points: [
                  'Pricing strategies that work',
                  'Client acquisition systems',
                  'Repeatable execution frameworks',
                  'AI + creativity integration'
                ]
              },
              {
                title: 'Fit Over Volume',
                points: [
                  'Not for casual learners',
                  'No cheap classes mentality',
                  'Discipline and practice required',
                  'Selective admission standards'
                ]
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-2xl font-display font-bold mb-6 gradient-text">
                  {item.title}
                </h3>
                <ul className="space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start text-white/70">
                      <span className="text-accent-gold mr-2">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          {/* Visual examples to make sections more image-forward */}
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
        </div>
      </section>

      {/* Two-Layer Model */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Two Paths. One Standard.
            </h2>
            <p className="text-white/60 text-lg">
              Choose your journey, but know that excellence is non-negotiable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-10 border-2 border-white/20"
            >
              <div className="text-sm uppercase tracking-wider text-white/50 mb-4">Layer 1</div>
              <h3 className="text-3xl font-display font-bold mb-4">Skill Programs</h3>
              <p className="text-white/70 mb-6">
                Intensive, practical training. Learn fast. Execute well.
              </p>
              <ul className="space-y-2 text-white/60">
                <li>• Short, focused programs</li>
                <li>• Skill certification only</li>
                <li>• Entry-level access</li>
                <li>• Students, not alumni</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-10 border-2 border-accent-gold premium-shadow"
            >
              <div className="text-sm uppercase tracking-wider text-accent-gold mb-4">Layer 2</div>
              <h3 className="text-3xl font-display font-bold mb-4">Alumni Track</h3>
              <p className="text-white/70 mb-6">
                5-month advanced journey. Monetization. Business thinking. AI integration.
              </p>
              <ul className="space-y-2 text-white/60">
                <li>• Alumni status is earned</li>
                <li>• Deep mentor access</li>
                <li>• Referrals & opportunities</li>
                <li>• Long-term value creation</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Physical Academy */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Physical Academy. Real Education.
            </h2>
            <p className="text-white/60 text-lg">
              We are a physical school first. Location: Lagos, Nigeria.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 text-center"
            >
              <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80" alt="campus" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-display font-bold mb-3">Physical Campus</h3>
              <p className="text-white/70">
                Our primary focus is in-person education with direct mentor access and hands-on training.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=80" alt="cohorts" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-display font-bold mb-3">Small Cohorts</h3>
              <p className="text-white/70">
                Limited in-person cohorts ensure quality, personalized attention, and real mentorship.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" alt="online" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-display font-bold mb-3">Online Alternative</h3>
              <p className="text-white/70">
                For those who cannot attend physically, we offer select online programs with digital access.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section id="programs" className="py-20 px-6 bg-gradient-to-b from-purple-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Current Programs
            </h2>
            <p className="text-white/60 text-lg">
              Premium, limited, selective.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '2-Week Video Editing Intensive',
                price: '₦100,000',
                details: ['3 students per cohort', 'Physical, mentor-led', 'Premium positioning', 'Skill certification']
              },
              {
                title: '1-on-1 Mastery Track',
                price: '₦600,000',
                details: ['High-touch mentorship', 'Flexible schedule', 'For professionals', 'Private access'],
                featured: true
              },
              {
                title: 'Online Video Editing',
                price: '₦30,000',
                details: ['Self-paced learning', 'Digital access', 'No mentorship', 'Skill training only']
              }
            ].map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-2xl p-8 ${program.featured ? 'border-2 border-accent-gold premium-shadow' : ''}`}
              >
                {program.featured && (
                  <div className="text-accent-gold text-sm uppercase tracking-wider mb-4">
                    Most Popular
                  </div>
                )}
                {/* Program thumbnail */}
                {(() => {
                  const thumbs = [
                    'https://images.unsplash.com/photo-1506765515384-028b60a970df?w=800&q=80',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
                  ];
                  const src = thumbs[index % thumbs.length];
                  return <img src={src} alt={program.title} className="w-full h-40 object-cover rounded-lg mb-4" />;
                })()}
                <h3 className="text-2xl font-display font-bold mb-2">{program.title}</h3>
                <p className="text-3xl font-bold mb-6 gradient-text">{program.price}</p>
                <ul className="space-y-2 text-white/70">
                  {program.details.map((detail) => (
                    <li key={detail}>• {detail}</li>
                  ))}
                </ul>
                <Link 
                  href={
                    program.title.includes('Online') ? `/payments/checkout?program=${encodeURIComponent(program.title)}` : `/apply?program=${encodeURIComponent(program.title)}`
                  }
                  className="block mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-center font-semibold transition-all duration-300"
                >
                  Apply
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Thinkinn */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              The Thinkinn
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Weekly intellectual content on monetization, AI, creative thinking, and decision-making.
              <br />
              <span className="text-white/50 text-base">Not tutorials. Thought leadership.</span>
            </p>
            <Link 
              href="/thinkinn"
              className="inline-block px-8 py-4 glass rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Explore Thinkinn
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Access Is Not Automatic.
              <br />
              <span className="gradient-text">It&apos;s Earned.</span>
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Submit your application. Limited cohorts. Selective admission.
            </p>
            <Link 
              href="/apply"
              className="inline-block px-10 py-5 bg-white text-black font-bold text-lg rounded-lg hover:bg-accent-gold transition-all duration-300 premium-shadow"
            >
              Apply to CreatINN Academy
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
