"use client";

import { useRouter, usePathname } from "next/navigation";

export default function AdminBack({ fallback = "/admin" }: { fallback?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function goBack() {
    // when we're already in the admin section, the safe thing is to return
    // explicitly to the admin dashboard rather than relying on the browser
    // history (which might contain non-admin pages like the student view).
    if (pathname && pathname.startsWith('/admin')) {
      router.push(fallback);
      return;
    }

    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push(fallback);
      }
    } catch {
      router.push(fallback);
    }
  }

  return (
    <button
      onClick={goBack}
      className="inline-flex items-center gap-2 px-3 py-2 bg-white/6 hover:bg-white/8 rounded-lg text-sm font-medium"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
