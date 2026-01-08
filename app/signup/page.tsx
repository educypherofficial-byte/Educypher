"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength =
    password.length < 6 ? "Weak" : password.length < 10 ? "Medium" : "Strong";

  async function handleSignup() {
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 space-y-6">

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold">Create Account 🚀</h1>
          <p className="text-sm text-gray-400">
            Start building real developer skills
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* NAME */}
        <div>
          <label className="text-xs text-gray-400">Name</label>
          <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3">
            <User size={16} />
            <input
              className="w-full bg-transparent py-3 outline-none text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-xs text-gray-400">Email</label>
          <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3">
            <Mail size={16} />
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
        <div>
          <label className="text-xs text-gray-400">Password</label>
          <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3">
            <Lock size={16} />
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
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs mt-1 text-gray-400">
            Strength:{" "}
            <span
              className={
                passwordStrength === "Strong"
                  ? "text-emerald-400"
                  : passwordStrength === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }
            >
              {passwordStrength}
            </span>
          </p>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Create Account
        </button>

        <p className="text-xs text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="hover:text-emerald-400">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
