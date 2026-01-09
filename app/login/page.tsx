"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [touched, setTouched] = useState(false);

  async function handleLogin() {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setError("Enter your email to reset password");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message.replace("Firebase:", ""));
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* ===== HOMEPAGE BACKGROUND ===== */}
      <div className="absolute inset-0 -z-10 bg-neutral-950" />

      {/* floating gradient blobs */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[140px] animate-floatSlow" />
      <div className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full bg-cyan-400/20 blur-[140px] animate-floatSlow delay-1000" />
      <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[160px]" />

      {/* subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* ===== LOGIN CARD ===== */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div
          className={`
            w-full max-w-md
            rounded-2xl border border-white/10
            bg-neutral-900/75 backdrop-blur-xl
            p-8 space-y-6
            transition-all duration-500
            ${touched ? "shadow-[0_30px_80px_-25px_rgba(0,0,0,0.9)] scale-[1.01]" : ""}
            animate-cardPop
          `}
        >
          {/* HEADER */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold">
              Welcome Back <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-sm text-gray-400">
              Login to continue learning & building
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 animate-shake">
              {error}
            </div>
          )}

          {/* RESET INFO */}
          {resetSent && (
            <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 animate-pop">
              Password reset email sent ✔
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Email</label>
            <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 focus-within:ring-1 focus-within:ring-emerald-500/40 transition">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                className="w-full bg-transparent py-3 outline-none text-sm"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setTouched(true);
                }}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Password</label>
            <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3 focus-within:ring-1 focus-within:ring-emerald-500/40 transition">
              <Lock size={16} className="text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent py-3 outline-none text-sm"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched(true);
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-white transition-transform active:scale-90"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between text-xs">
            <button
              onClick={handleResetPassword}
              className="text-gray-400 hover:text-emerald-400 transition"
            >
              Forgot password?
            </button>
            <Link
              href="/signup"
              className="text-gray-400 hover:text-emerald-400 transition"
            >
              Create account
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`
              w-full flex justify-center items-center gap-2
              py-3 rounded-lg font-semibold
              transition-all duration-300
              ${touched
                ? "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-[0.98] animate-ctaBounce"
                : "bg-neutral-700 text-neutral-400 cursor-not-allowed"}
              disabled:opacity-60
            `}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
