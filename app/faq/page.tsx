'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Footer from '@/components/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'What makes CreatINN Academy different from other courses?',
      answer: 'We are not a course platform. We are a selective institution. We limit cohorts, require paid applications, and measure real outcomes - not just testimonials. Alumni status is earned, not sold. Access to mentors and opportunities comes through demonstrated excellence.'
    },
    {
      question: 'Do I need experience to apply?',
      answer: 'It depends on the program. For Layer 1 skill programs, beginners can apply but must demonstrate commitment and discipline. For the Alumni Track (Layer 2), you need to have completed Layer 1 or demonstrate equivalent creative skills and business readiness.'
    },
    {
      question: 'What is the application process?',
      answer: 'Applications are free. Submit your application and we review it individually within 3-5 business days. Shortlisted candidates are invited for interviews. Final decisions are communicated via email. Not everyone is accepted.'
    },
    {
      question: 'What is the difference between Layer 1 and Layer 2?',
      answer: 'Layer 1 (Skill Programs) teaches practical creative skills like video editing. You get skill certification, not alumni status. Layer 2 (Alumni Track) is a 5-month advanced journey focused on monetization, business thinking, and AI integration. Alumni status is earned through this track.'
    },
    {
      question: 'Do you guarantee income or job placement?',
      answer: 'No. We do not make income guarantees or promise job placement. We build capacity, discipline, and long-term value. Your success depends on your application of what you learn, your work ethic, and your strategic thinking.'
    },
    {
      question: 'Can I get a refund if I change my mind?',
      answer: 'Applications are free. Program fees have specific refund policies communicated upon acceptance. We are selective about who we admit, and we expect the same level of commitment from our students.'
    },
    {
      question: 'What does "alumni status" mean?',
      answer: 'Alumni status is earned through completion of the Layer 2 Alumni Track with demonstrated growth, discipline, and readiness. Alumni receive deeper mentor access, referrals, opportunities, brand endorsement, and long-term support. It is not automatic - it is earned.'
    },
    {
      question: 'Are there payment plans?',
      answer: 'Payment options vary by program. Contact us for details. However, we do not offer discounts. Our pricing reflects the value and selectivity of the program.'
    },
    {
      question: 'Is training physical or online?',
      answer: 'The 2-Week Video Editing Intensive is physical (in-person). The 1-on-1 Mastery Track can be flexible. The Online Video Editing Course is self-paced digital access. Layer 2 Alumni Track combines both formats.'
    },
    {
      question: 'How many students are accepted per cohort?',
      answer: 'Very few. The 2-Week Intensive is limited to 3 students. The 1-on-1 Mastery Track is private. Cohort sizes are intentionally small to maintain quality, mentor access, and brand protection.'
    },
    {
      question: 'What is The Thinkinn?',
      answer: 'The Thinkinn is our weekly intellectual content series on monetization, AI, creative thinking, and business decisions. It is not tutorials or sales content - it is thought leadership designed to build authority and filter serious applicants.'
    },
    {
      question: 'Can I join CreatINN if I already have a business?',
      answer: 'Yes. The 1-on-1 Mastery Track is designed for busy professionals. If you already have creative skills and want to scale or integrate AI and business thinking, the Alumni Track may be right for you (if invited).'
    }
  ];

  return (
    <div className="min-h-screen">
      
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-white/70">
                Everything you need to know about CreatINN Academy
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-display font-semibold pr-8">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-accent-gold flex-shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 pb-6"
                  >
                    <p className="text-white/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="px-6 mt-20">
          <div className="max-w-3xl mx-auto glass rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-white/70 mb-8">
              Contact us directly for more information
            </p>
            <a 
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
