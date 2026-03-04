"use client"

import React, { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setMessage('Thanks — we will notify you when The Thinkinn launches.')
        setEmail('')
      } else {
        const data = await res.json()
        setMessage(data?.error || 'Something went wrong')
      }
    } catch (err) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="max-w-md mx-auto flex gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-5 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]/40 transition-colors"
        />
        <button
          type="submit"
          className="px-7 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-[#d4af37] transition-all duration-300 whitespace-nowrap"
          disabled={loading}
        >
          {loading ? 'Sending…' : 'Subscribe'}
        </button>
      </div>
      {message && <p className="text-sm mt-3 text-center text-white/70">{message}</p>}
    </form>
  )
}
