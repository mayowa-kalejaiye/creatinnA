'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProgramsPage() {
  const programs = [
    {
      id: 'intensive',
      title: '2-Week Video Editing Intensive',
      layer: 'Layer 1: Skill Program',
      price: '₦100,000',
      duration: '2 Weeks',
      cohortSize: '3 Students',
      format: 'Physical Campus (Lagos)',
      description: 'In-person intensive training at our Lagos campus. Limited to 3 students per cohort for maximum mentor access.',
      highlights: [
        'Limited to 3 students per cohort',
        'Physical location with direct mentor access',
        'Industry-standard software and workflows',
        'Real-world project completion',
        'Skill certification upon completion',
        'Not alumni status'
      ],
      features: [
        'Daily hands-on sessions',
        'Mentor feedback and critique',
        'Portfolio piece creation',
        'Technical mastery focus'
      ]
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
      description: 'Private, flexible mentorship for busy professionals who demand excellence.',
      highlights: [
        'Complete privacy and personalized attention',
        'Flexible scheduling around your commitments',
        'Custom curriculum based on your goals',
        'Direct access to senior mentors',
        'Accelerated learning path',
        'Premium positioning'
      ],
      features: [
        'One-on-one sessions',
        'Custom project selection',
        'Industry connections',
        'Career guidance included'
      ]
    },
    {
      id: 'online',
      title: 'Online Video Editing Course',
      layer: 'Layer 1: Skill Program',
      price: '₦30,000',
      duration: 'Self-Paced',
      cohortSize: 'Remote',
      format: 'Digital Access',
      description: 'For those who cannot attend our physical campus. Self-paced digital learning with course materials.',
      highlights: [
        'Learn at your own pace',
        'Digital course materials',
        'Video tutorials and resources',
        'No mentorship included',
        'No alumni status',
        'Skill training only'
      ],
      features: [
        'Lifetime course access',
        'Downloadable resources',
        'Community forum access',
        'Basic certificate'
      ]
    }
  ];

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
                Layer 1: Skill Programs
              </p>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Physical Academy Programs
              </h1>
              <p className="text-xl text-white/70">
                In-person training in Lagos. Limited cohorts. Real mentorship.
                <br />
                <span className="text-white/50">Online option available for remote learners.</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-3xl p-8 md:p-12 ${
                  program.featured ? 'border-2 border-accent-gold premium-shadow' : ''
                }`}
              >
                {program.featured && (
                  <div className="text-accent-gold text-sm uppercase tracking-wider mb-4">
                    ★ Most Popular
                  </div>
                )}
                
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left: Info */}
                  <div className="md:col-span-2">
                    <div className="text-sm text-white/50 mb-2">{program.layer}</div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                      {program.title}
                    </h2>
                    <p className="text-lg text-white/70 mb-6">{program.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <div className="text-white/50 text-sm mb-1">Duration</div>
                        <div className="font-semibold">{program.duration}</div>
                      </div>
                      <div>
                        <div className="text-white/50 text-sm mb-1">Cohort Size</div>
                        <div className="font-semibold">{program.cohortSize}</div>
                      </div>
                      <div>
                        <div className="text-white/50 text-sm mb-1">Format</div>
                        <div className="font-semibold">{program.format}</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-display font-semibold mb-3">Program Highlights</h3>
                      <ul className="space-y-2">
                        {program.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start text-white/70">
                            <span className="text-accent-gold mr-2 mt-1">→</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-display font-semibold mb-3">What You Get</h3>
                      <div className="flex flex-wrap gap-2">
                        {program.features.map((feature) => (
                          <span 
                            key={feature}
                            className="px-4 py-2 bg-white/5 rounded-lg text-sm text-white/70"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & CTA */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="text-white/50 text-sm mb-2">Investment</div>
                      <div className="text-4xl font-bold gradient-text mb-8">
                        {program.price}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Link 
                        href="/apply"
                        className="block px-8 py-4 bg-white text-black font-semibold rounded-lg text-center hover:bg-accent-gold transition-all duration-300"
                      >
                        Apply Now
                      </Link>
                      <p className="text-xs text-white/40 text-center">
                        Applications are reviewed individually
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 mt-20">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready for the Alumni Track?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Layer 2 is where skills become business. Where creatives become entrepreneurs.
            </p>
            <Link 
              href="/alumni"
              className="inline-block px-8 py-4 glass rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Learn About Alumni Track
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
