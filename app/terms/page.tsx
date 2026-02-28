'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-white/60 mb-12">
              Last updated: January 3, 2026
            </p>

            <div className="glass rounded-3xl p-8 md:p-12 space-y-8">
              <section>
                <h2 className="text-2xl font-display font-bold mb-4">1. Agreement to Terms</h2>
                <p className="text-white/70 leading-relaxed">
                  By accessing or using CreatINN Academy&apos;s website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">2. Selective Admission</h2>
                <p className="text-white/70 leading-relaxed">
                  CreatINN Academy maintains selective admission standards. Application does not guarantee acceptance. We reserve the right to accept or reject any application at our sole discretion. Application fees are non-refundable regardless of admission decision.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">3. Program Enrollment</h2>
                <div className="space-y-4 text-white/70">
                  <p className="leading-relaxed">
                    <strong className="text-white">3.1 Payment:</strong> Full payment or agreed payment plan must be completed before program access is granted. All fees are stated in Nigerian Naira (₦).
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">3.2 Refund Policy:</strong> Program fees may be partially refunded if requested within 7 days of program start, minus administrative fees. After 7 days, no refunds are provided. Application fees are never refundable.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">3.3 Commitment:</strong> Students are expected to attend all sessions, complete assignments, and maintain professional conduct. Failure to meet these standards may result in removal from the program without refund.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">4. Alumni Status</h2>
                <p className="text-white/70 leading-relaxed">
                  Alumni status is not automatically granted upon program completion. It is earned through demonstrated skill growth, discipline, completion of requirements, and assessment of readiness. CreatINN Academy reserves the right to determine alumni status at its sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">5. No Guarantees</h2>
                <p className="text-white/70 leading-relaxed">
                  CreatINN Academy makes no guarantees regarding income, employment, client acquisition, or business success. Our programs provide education and access; your results depend on your effort, application, and market conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">6. Intellectual Property</h2>
                <div className="space-y-4 text-white/70">
                  <p className="leading-relaxed">
                    <strong className="text-white">6.1 Course Materials:</strong> All course materials, videos, documents, and resources are the intellectual property of CreatINN Academy and are provided for personal educational use only.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">6.2 Student Work:</strong> You retain rights to work you create during programs. CreatINN Academy may showcase student work for promotional purposes with permission.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">6.3 Prohibited Use:</strong> You may not reproduce, distribute, modify, or sell course materials without written permission.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">7. Code of Conduct</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  All students must maintain professional and respectful conduct. We do not tolerate:
                </p>
                <ul className="space-y-2 text-white/70 ml-6">
                  <li>• Harassment, discrimination, or abusive behavior</li>
                  <li>• Academic dishonesty or plagiarism</li>
                  <li>• Sharing or distributing course materials</li>
                  <li>• Disruptive or unprofessional behavior</li>
                </ul>
                <p className="text-white/70 leading-relaxed mt-4">
                  Violations may result in immediate removal without refund.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">8. Limitation of Liability</h2>
                <p className="text-white/70 leading-relaxed">
                  CreatINN Academy, its instructors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or inability to use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">9. Modifications to Services</h2>
                <p className="text-white/70 leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any aspect of our services at any time. We will provide reasonable notice of significant changes to enrolled students.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">10. Governing Law</h2>
                <p className="text-white/70 leading-relaxed">
                  These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in Nigerian courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">11. Changes to Terms</h2>
                <p className="text-white/70 leading-relaxed">
                  We may update these Terms of Service at any time. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold mb-4">12. Contact</h2>
                <p className="text-white/70 leading-relaxed">
                  For questions about these Terms of Service, contact us at:
                  <br /><br />
                  Email: <a href="mailto:legal@creatinn.academy" className="text-accent-gold hover:underline">legal@creatinn.academy</a>
                  <br />
                  Or visit our <a href="/contact" className="text-accent-gold hover:underline">Contact page</a>
                </p>
              </section>

              <div className="pt-8 border-t border-white/10">
                <p className="text-white/50 text-sm italic">
                  By submitting an application or enrolling in any CreatINN Academy program, you acknowledge that you have read, understood, and agree to these Terms of Service.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
