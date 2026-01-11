'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Visit or Contact Us
              </h1>
              <p className="text-xl text-white/70">
                Physical campus in Lagos. Reach us online anytime.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8 md:p-10"
          >
            <h2 className="text-2xl font-display font-bold mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-accent-gold transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Important Note */}
            <div className="glass rounded-2xl p-8 border-l-4 border-accent-gold">
              <h3 className="text-xl font-display font-bold mb-4">
                Before You Contact Us
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Check our <a href="/faq" className="text-accent-gold hover:underline">FAQ page</a> for common questions</li>
                <li>• Application inquiries: Use the <a href="/apply" className="text-accent-gold hover:underline">Apply page</a></li>
                <li>• Program details: Visit <a href="/programs" className="text-accent-gold hover:underline">Programs</a></li>
                <li>• We respond within 1-2 business days</li>
              </ul>
            </div>

            {/* Contact Methods */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-display font-bold mb-6">
                Other Ways to Reach Us
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 text-accent-gold">Email</h4>
                  <a href="mailto:hello@creatinn.academy" className="text-white/70 hover:text-white">
                    hello@creatinn.academy
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-accent-gold">Phone</h4>
                  <p className="text-white/70">
                    +234 (0) 123 456 7890
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-accent-gold">Campus Location</h4>
                  <p className="text-white/70">
                    Lagos, Nigeria
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Physical address provided upon admission
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-accent-gold">Office Hours</h4>
                  <p className="text-white/70">
                    Monday - Friday<br />
                    9:00 AM - 5:00 PM WAT
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-display font-bold mb-6">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a 
                  href="https://youtube.com/@creatinn" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  YouTube
                </a>
                <a 
                  href="https://instagram.com/creatinn" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Instagram
                </a>
                <a 
                  href="https://twitter.com/creatinn" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
