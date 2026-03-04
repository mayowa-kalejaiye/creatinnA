"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Map program titles/slugs from URL to form value
const programMap: Record<string, string> = {
  'intensive': 'intensive',
  '2-week video editing intensive': 'intensive',
  '2-week-video-editing-intensive': 'intensive',
  'mastery': 'mastery',
  '1-on-1 mastery track': 'mastery',
  '1-on-1-mastery-track': 'mastery',
  'online': 'online',
  'online video editing': 'online',
  'online-video-editing': 'online',
  'online video editing course': 'online',
};

export default function ApplyPage() {
  // Read query params on the client to avoid server-side hook usage
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: "intensive",
    experience: "",
    motivation: "",
    commitment: false,
  });

  // Pre-select program from URL query param using window.location
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get('program');
    if (p) {
      const key = p.toLowerCase().trim();
      const mapped = programMap[key];
      if (mapped) {
        setForm((prev) => ({ ...prev, program: mapped }));
      }
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {}
      if (res.ok) {
        setStatus("submitted");
        setForm({
          name: "",
          email: "",
          phone: "",
          program: "intensive",
          experience: "",
          motivation: "",
          commitment: false,
        });
      } else {
        setStatus("error: " + (data?.error ?? res.status));
      }
    } catch (err) {
      setStatus("network error");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-accent-gold uppercase tracking-[0.3em] text-sm mb-6">
                Application Process
              </p>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Apply to CreatINN
              </h1>
              <p className="text-xl text-white/70">
                Applications are reviewed individually. Not everyone is admitted.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="px-6 mb-12">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border-l-4 border-accent-gold"
            >
              <h3 className="text-xl font-display font-bold mb-4">
                Before You Apply
              </h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">→</span>
                  <span>Applications are free and reviewed individually</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">→</span>
                  <span>Limited cohorts mean not everyone will be accepted</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">→</span>
                  <span>We review commitment, discipline, and readiness</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-gold mr-2 mt-1">→</span>
                  <span>
                    Acceptance does not guarantee graduation or alumni status
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Application Form */}
        <section className="px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12"
            >
              <form onSubmit={submit} className="space-y-6">
                {status === 'submitted' ? (
                  <div className="text-center py-8 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto text-3xl font-bold">✓</div>
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-2">Application Received</h3>
                      <p className="text-white/60 max-w-md mx-auto">
                        Thank you for applying to CreatINN Academy. Your application is now under review.
                      </p>
                    </div>

                    <div className="glass rounded-xl p-6 text-left space-y-4 max-w-md mx-auto">
                      <h4 className="font-display font-bold text-sm uppercase tracking-wider text-accent-gold">What happens next</h4>
                      <div className="space-y-3 text-sm text-white/70">
                        <div className="flex items-start gap-3">
                          <span className="text-accent-gold font-bold mt-0.5">1.</span>
                          <span>Our team will review your application within <strong className="text-white">3–5 business days</strong>.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-accent-gold font-bold mt-0.5">2.</span>
                          <span>Check the <strong className="text-white">email you provided</strong> — that&apos;s where we&apos;ll send your admission decision.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-accent-gold font-bold mt-0.5">3.</span>
                          <span>If shortlisted, you may be invited for a <strong className="text-white">brief conversation</strong> before final acceptance.</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-6 text-left max-w-md mx-auto">
                      <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white/50 mb-3">While you wait</h4>
                      <p className="text-sm text-white/60 mb-4">
                        Get a feel for how we think. Watch <strong className="text-white">The Thinkinn</strong> — our weekly series on monetization, AI, and creative business thinking.
                      </p>
                      <a
                        href="/thinkinn"
                        className="inline-block px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-all"
                      >
                        Explore The Thinkinn →
                      </a>
                    </div>

                    <p className="text-xs text-white/30 max-w-sm mx-auto">
                      Didn&apos;t receive anything after 5 business days? Reach out via our <a href="/contact" className="underline hover:text-white/50">contact page</a>.
                    </p>
                  </div>
                ) : (
                  <>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+234 ..."
                  />
                </div>

                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Which Program Are You Applying For?{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                    value={form.program}
                    onChange={(e) =>
                      setForm({ ...form, program: e.target.value })
                    }
                  >
                    <option value="intensive">
                      2-Week Video Editing Intensive (₦100,000)
                    </option>
                    <option value="mastery">
                      1-on-1 Mastery Track (₦600,000)
                    </option>
                    <option value="online">
                      Online Video Editing Course (₦30,000)
                    </option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Briefly describe your creative experience{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors resize-none"
                    value={form.experience}
                    onChange={(e) =>
                      setForm({ ...form, experience: e.target.value })
                    }
                    placeholder="What creative skills do you currently have? What tools/software do you use?"
                  />
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Why do you want to join CreatINN Academy?{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors resize-none"
                    value={form.motivation}
                    onChange={(e) =>
                      setForm({ ...form, motivation: e.target.value })
                    }
                    placeholder="What are your goals? How do you plan to apply what you learn?"
                  />
                </div>

                {/* Commitment Checkbox */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-1"
                      checked={form.commitment}
                      onChange={(e) =>
                        setForm({ ...form, commitment: e.target.checked })
                      }
                    />
                    <span className="text-sm text-white/70">
                      I understand that this is a selective program and I commit to
                      completing the training with discipline and excellence.{" "}
                      <span className="text-red-400">*</span>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-accent-gold transition-all duration-300 premium-shadow disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Submitting…' : 'Submit Application'}
                  </button>
                  <p className="text-xs text-white/40 text-center mt-4">
                    We&apos;ll review your application within 3-5 business days
                  </p>
                </div>
                  </>
                )}
              </form>
              {status && status.startsWith('error') && <p className="text-center text-red-400 mt-4">{status}</p>}
            </motion.div>
          </div>
        </section>

        {/* What Happens Next */}
        <section className="px-6 mt-12">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-2xl font-display font-bold mb-6">
                What Happens Next?
              </h3>
              <div className="space-y-4 text-white/70">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <strong className="text-white block mb-1">
                      Application Review
                    </strong>
                    We review your application within 3-5 business days
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <strong className="text-white block mb-1">
                      Interview (If Selected)
                    </strong>
                    Shortlisted candidates will be invited for a brief interview
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <strong className="text-white block mb-1">
                      Acceptance Decision
                    </strong>
                    Final decisions are communicated via email
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <strong className="text-white block mb-1">
                      Cohort Onboarding
                    </strong>
                    Accepted students receive onboarding materials and start dates
                  </div>
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
