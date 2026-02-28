'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-white/60 mb-12">
              Last updated: January 3, 2026
            </p>

            <div className="glass rounded-3xl p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-display font-bold mb-4">1. Introduction</h2>
                <p className="text-white/70 leading-relaxed">
                  CreatINN Academy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or apply to our programs.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">2. Information We Collect</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="space-y-2 text-white/70 ml-6">
                  <li>• Personal identification information (name, email, phone number)</li>
                  <li>• Application materials and responses</li>
                  <li>• Payment and billing information</li>
                  <li>• Communications with us</li>
                  <li>• Usage data and analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">3. How We Use Your Information</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="space-y-2 text-white/70 ml-6">
                  <li>• Process applications and admissions</li>
                  <li>• Provide educational services and support</li>
                  <li>• Communicate important updates and information</li>
                  <li>• Process payments and transactions</li>
                  <li>• Improve our website and services</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">4. Information Sharing</h2>
                <p className="text-white/70 leading-relaxed">
                  We do not sell or rent your personal information to third parties. We may share your information with service providers who assist in our operations, but only to the extent necessary and under strict confidentiality agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">5. Data Security</h2>
                <p className="text-white/70 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">6. Your Rights</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-white/70 ml-6">
                  <li>• Access your personal data</li>
                  <li>• Request correction of inaccurate data</li>
                  <li>• Request deletion of your data (subject to legal obligations)</li>
                  <li>• Opt-out of marketing communications</li>
                  <li>• Withdraw consent where applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">7. Cookies</h2>
                <p className="text-white/70 leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">8. Changes to This Policy</h2>
                <p className="text-white/70 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">9. Contact Us</h2>
                <p className="text-white/70 leading-relaxed">
                  If you have questions about this privacy policy or our data practices, please contact us at:
                  <br /><br />
                  Email: <a href="mailto:privacy@creatinn.academy" className="text-accent-gold hover:underline">privacy@creatinn.academy</a>
                  <br />
                  Or visit our <a href="/contact" className="text-accent-gold hover:underline">Contact page</a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
