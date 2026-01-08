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
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
          <p className="text-sm text-gray-400">
            Login to continue learning & building
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* RESET INFO */}
        {resetSent && (
          <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
            Password reset email sent ✔
          </div>
        )}

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Email</label>
          <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3">
            <Mail size={16} className="text-gray-400" />
            <input
              type="email"
              className="w-full bg-transparent py-3 outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Password</label>
          <div className="flex items-center gap-2 rounded-lg bg-neutral-800 px-3">
            <Lock size={16} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-transparent py-3 outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between text-xs">
          <button
            onClick={handleResetPassword}
            className="text-gray-400 hover:text-emerald-400"
          >
            Forgot password?
          </button>
          <Link href="/signup" className="text-gray-400 hover:text-emerald-400">
            Create account
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Login
        </button>
      </div>
    </main>
  );
}
