"use client";

import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Link from "next/link";
import {
  Code2,
  Brain,
  Users,
  Rss,
  Rocket,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Splash duration (2 seconds)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Home Content */}
      <main
        className={`min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900 text-white transition-opacity duration-700 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-28 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* LEFT */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Learn. Practice. <br />
                <span className="text-emerald-400">Build Like a Pro.</span>
              </h1>

              <p className="text-gray-400 text-lg max-w-xl">
                EduCypher is a modern learning platform for developers.
                Learn concepts, practice real labs, join communities,
                and grow your profile — all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
                >
                  Get Started Free
                </Link>

                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-emerald-500/10 rounded-full" />
              <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900/80 p-8 space-y-6 backdrop-blur">

                <FeatureRow
                  icon={<Brain />}
                  title="Structured Learning"
                  desc="Concepts with copy-paste code, visuals & explanations."
                />

                <FeatureRow
                  icon={<Code2 />}
                  title="Hands-on Practice"
                  desc="Real labs & tasks — not MCQs."
                />

                <FeatureRow
                  icon={<Users />}
                  title="Communities"
                  desc="Language-wise & topic-wise communities."
                />

                <FeatureRow
                  icon={<Rss />}
                  title="Developer Feed"
                  desc="Memes, tips, updates & knowledge sharing."
                />
              </div>
            </div>

          </div>
        </section>

        {/* WHY SECTION */}
        <section className="border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-24 space-y-16">

            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">
                Why EduCypher?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We focus on real skills, real growth, and real developer identity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <InfoCard
                icon={<Rocket />}
                title="Career Focused"
                desc="Not just tutorials — build skills that matter."
              />

              <InfoCard
                icon={<ShieldCheck />}
                title="No Fake Progress"
                desc="Points, badges & profile reflect real effort."
              />

              <InfoCard
                icon={<Users />}
                title="Community Driven"
                desc="Learn from others. Help others. Grow together."
              />

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-6">
            <h2 className="text-4xl font-extrabold">
              Start Your Developer Journey Today
            </h2>

            <p className="text-gray-400 max-w-xl mx-auto">
              Free to start. No credit card required.
            </p>

            <Link
              href="/signup"
              className="inline-block px-8 py-4 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 space-y-4 hover:border-neutral-700 transition">
      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
