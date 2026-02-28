"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ApplyPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    userId: "",
    program: "intensive",
    experience: "",
    motivation: "",
    commitment: false,
  });

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
        setStatus("submitted: " + (data?.id ?? "ok"));
        setForm({
          userId: "",
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
                {/* User ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    User ID (existing user)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent-gold transition-colors"
                    value={form.userId}
                    onChange={(e) =>
                      setForm({ ...form, userId: e.target.value })
                    }
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
                    className="w-full px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-accent-gold transition-all duration-300 premium-shadow"
                  >
                    Submit Application
                  </button>
                  <p className="text-xs text-white/40 text-center mt-4">
                    We&apos;ll review your application within 3-5 business days
                  </p>
                </div>
              </form>
              {status && <p className="text-center text-white/70 mt-4">{status}</p>}
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
