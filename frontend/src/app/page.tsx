"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function navigate() {
    router.push("/nda");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate();
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#032147] px-4">
      {/* Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.30)] px-10 py-10 fade-up">

        {/* Logo / wordmark */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="font-heading font-bold text-[#032147] text-[28px] tracking-tight leading-none">
            Prelegal
          </span>
          <span className="text-[#888888] text-[13px] font-sans text-center">
            Legal agreements, drafted in minutes
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[#032147] text-[13px] font-medium font-sans"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-10 rounded-lg border border-[#e0e4ec] bg-[#f8f9fc] px-3.5 text-[14px] font-sans text-[#032147] placeholder:text-[#bbbbbb] outline-none focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[#032147] text-[13px] font-medium font-sans"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 rounded-lg border border-[#e0e4ec] bg-[#f8f9fc] px-3.5 text-[14px] font-sans text-[#032147] placeholder:text-[#bbbbbb] outline-none focus:border-[#209dd7] focus:ring-2 focus:ring-[#209dd7]/20 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 h-11 w-full rounded-lg bg-[#753991] hover:bg-[#5e2d74] active:bg-[#4d2560] text-white text-[14px] font-semibold font-sans transition-colors duration-150 cursor-pointer"
          >
            Sign in
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-5 text-center text-[13px] font-sans text-[#888888]">
          New to Prelegal?{" "}
          <button
            type="button"
            onClick={navigate}
            className="text-[#209dd7] hover:underline cursor-pointer bg-transparent border-none p-0 font-sans text-[13px]"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
